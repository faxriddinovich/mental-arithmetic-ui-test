<template>
  <div class="container">
    <div class="mx-2 pt-2">
      <div class="columns is-multiline">
        <div class="column is-12-touch is-5-desktop is-4-widescreen">
          <course-card :course="course" :isLoading="courseLoading" detailed />
          <div class="mt-3">
            <div class="card p-3" v-if="courseLoading">
              <b-skeleton :count="2" />
            </div>
            <div
              class="card p-3"
              v-else-if="activeSession && !course.purchased"
            >
              <div class="buttons">
                <b-button
                  type="is-success"
                  icon-left="shopping-basket"
                  @click="displayPurchaseDialog"
                  :loading="purchaseButtonSpinner"
                  expanded
                  >Purchase
                </b-button>

                <b-collapse
                  :open="false"
                  aria-id="contentIdForA11y1"
                  style="width: 100%"
                  v-if="course.price !== 0"
                >
                  <template #trigger>
                    <b-button
                      type="is-light"
                      size="is-small"
                      icon-left="ticket"
                      :disabled="courseLoading"
                      expanded
                      aria-controls="contentIdForA11y1"
                      >I have a coupon code</b-button
                    >
                  </template>
                  <form @submit.prevent="purchaseCourse(true)" class="is-flex">
                    <b-field class="is-flex-grow-1">
                      <b-input
                        icon="ticket"
                        size="is-small"
                        placeholder="Please write the coupon code here"
                        v-model="couponText"
                        required
                      ></b-input>
                    </b-field>
                    <b-button
                      native-type="submit"
                      icon-left="check"
                      type="is-success"
                      size="is-small"
                      class="ml-2"
                      :loading="couponButtonSpinner"
                      >Purchase</b-button
                    >
                  </form>
                </b-collapse>
              </div>
            </div>
          </div>
          <div class="mt-3">
            <div class="card p-3" v-if="courseLoading">
              <b-skeleton />
            </div>
            <div class="card p-3" v-else-if="course.tags.length">
              <b-taglist>
                <b-tag
                  type="is-primary"
                  v-for="tag of course.tags"
                  :key="tag"
                  >{{ tag }}</b-tag
                >
              </b-taglist>
            </div>
          </div>

          <b-button
            tag="router-link"
            :to="{ name: 'Home' }"
            class="mt-3"
            icon-left="home"
            expanded
            >Home</b-button
          >
        </div>
        <div class="column">
          <div
            class="
              is-flex is-justify-content-space-between
              card
              mb-2
              p-2
              is-bordered
            "
            v-if="canManageCourse"
          >
            <div>
              <div class="buttons">
                <b-button type="is-primary" icon-left="chart"
                  >Statistics</b-button
                >
                <b-button type="is-success" icon-left="plus"
                  >Add lesson</b-button
                >
              </div>
            </div>
            <div>
              <div class="buttons">
                <b-button
                  type="is-warning"
                  tag="router-link"
                  :to="{
                    name: 'UpdateCourse',
                    params: { id: $route.params.id },
                  }"
                  icon-left="pen"
                  >Update</b-button
                >
                <b-button
                  type="is-danger"
                  icon-left="trash"
                  @click="displayConfirmDeleteDialog"
                  >Delete</b-button
                >
              </div>
            </div>
          </div>
          <cloud-loading class="mt-2" v-if="lessonsLoading" />
          <not-found-box text="No lessons found" v-else-if="!lessons.length" />
          <div class="mb-2" v-for="(lesson, idx) of lessons" :key="lesson.id">
            <lesson-card
              :lesson="lesson"
              :index="idx + 1"
              :canClick="course.purchased || lesson.isTrial"
              :canManage="canManageCourse"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted,
  ref,
} from "@vue/composition-api";
import CourseCard from "@/components/course/card.vue";
import LessonCard from "@/components/lesson/card.vue";
import CloudLoading from "@/components/cloud-loading.vue";
import NotFoundBox from "@/components/not-found-box.vue";
import { showToastMessage, ToastType } from "@/services/toast";
import { rpc } from "@/services/rpc";
import {
  RPC_GET_COURSE_METHOD,
  RPC_GET_LESSONS_METHOD,
  RPC_PURCHASE_COURSE_METHOD,
  RPC_DELETE_COURSE_METHOD,
} from "@/services/rpc/methods";
import {
  RPC_RESOURCE_NOT_FOUND_ERR_CODE,
  RPC_INSUFFICIENT_BALANCE_ERR_CODE,
} from "@/services/rpc/error-codes";
import { CourseContract } from "@/services/rpc/contracts/course";
import { LessonContract } from "@/services/rpc/contracts/lesson";
import { formatCurrency } from "@/common/utils";
import { Session, SessionStorage } from "@/services/storages/session";

export default defineComponent({
  components: { CourseCard, LessonCard, CloudLoading, NotFoundBox },
  setup(_, context) {
    const course = ref<CourseContract | null>(null);
    const lessons = ref<LessonContract[] | null>(null);
    const courseLoading = ref<boolean>(true);
    const lessonsLoading = ref<boolean>(true);
    const purchaseButtonSpinner = ref<boolean>(false);
    const couponButtonSpinner = ref<boolean>(false);

    const couponText = ref<string>("");
    const searchText = ref<string>("");

    const activeSession = ref<Session | null>(null);

    const routeParams = context.root.$route.params;

    const canManageCourse = computed(() => {
      const isRoot = activeSession.value && activeSession.value.role === "root";
      const isCourseAuthor =
        activeSession.value &&
        course.value &&
        course.value.author.id === activeSession.value.id;
      return isRoot || isCourseAuthor;
    });

    function getActiveSession() {
      SessionStorage.getActiveSession().then((session) => {
        activeSession.value = session;
      });
    }

    function getCourse() {
      rpc
        .call(RPC_GET_COURSE_METHOD, { courseId: routeParams.id })
        .then((result) => {
          course.value = result;
        })
        .catch((error) => {
          if (error.jsonrpcError) {
            const { jsonrpcError } = error;
            if (jsonrpcError.code === RPC_RESOURCE_NOT_FOUND_ERR_CODE) {
              context.root.$router.push("/");
            }
          }
        })
        .finally(() => {
          courseLoading.value = false;
        });
    }

    function getLessons() {
      rpc
        .call(RPC_GET_LESSONS_METHOD, { courseId: routeParams.id })
        .then((result) => {
          lessons.value = result;
        })
        .catch((error) => {
          if (error.jsonrpcError) {
            const { jsonrpcError } = error;
            if (jsonrpcError.code === RPC_RESOURCE_NOT_FOUND_ERR_CODE) {
              context.root.$router.push("/");
            }
          }
        })
        .finally(() => {
          lessonsLoading.value = false;
        });
    }

    function purchaseCourse(usingCoupon = false) {
      if (usingCoupon) couponButtonSpinner.value = true;
      else purchaseButtonSpinner.value = true;
      const params: any = { courseId: routeParams.id }; // FIXME: fix the any type
      if (usingCoupon) params["coupon"] = couponText.value;
      rpc
        .call(RPC_PURCHASE_COURSE_METHOD, params)
        .then(() => {
          context.root.$router.go(0);
        })
        .catch((error) => {
          if (error.jsonrpcError) {
            const { jsonrpcError } = error;
            if (jsonrpcError.code === RPC_INSUFFICIENT_BALANCE_ERR_CODE) {
              showToastMessage("Insufficient balance", ToastType.Danger);
              return;
            }
            // TODO: maybe we should handle RPC_PURCHASE_INVALID_COUPON_ERR_CODE here ?
            showToastMessage(
              "This operation cannot be performed",
              ToastType.Danger
            );
          }
        })
        .finally(() => {
          purchaseButtonSpinner.value = false;
          if (usingCoupon) couponButtonSpinner.value = false;
        });
    }

    function deleteCourse() {
      rpc
        .call(RPC_DELETE_COURSE_METHOD, { courseId: Number(routeParams.id) })
        .then(() => {
          showToastMessage("Course successfully deleted!", ToastType.Warning);
          context.root.$router.push({ name: "Home" });
        });
    }

    function displayPurchaseDialog() {
      context.root.$buefy.dialog.confirm({
        message:
          'Do you really want to purchase this course ?<br><span class="has-text-weight-semibold">After purchasing the course you cannot cancel this operation!</span>',
        onConfirm: () => purchaseCourse(),
        confirmText: "Purchase",
        hasIcon: true,
        icon: "shopping-basket",
      });
    }
    function displayConfirmDeleteDialog() {
      context.root.$buefy.dialog.confirm({
        message: "Do you really want to delete this course ?",
        onConfirm: () => deleteCourse(),
        confirmText: "Delete",
      });
    }

    onMounted(() => {
      getActiveSession();
      getCourse();
      getLessons();
    });

    return {
      activeSession,
      course,
      lessons,
      canManageCourse,
      purchaseButtonSpinner,
      couponButtonSpinner,
      lessonsLoading,
      courseLoading,
      couponText,
      searchText,
      formatCurrency,
      displayConfirmDeleteDialog,
      displayPurchaseDialog,
      purchaseCourse,
    };
  },
});
</script>
