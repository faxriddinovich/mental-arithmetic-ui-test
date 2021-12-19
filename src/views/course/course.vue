<template>
  <div class="container">
    <div class="mx-2 pt-2">
      <div class="columns">
        <div
          class="column is-12-mobile is-6-tablet is-5-desktop is-4-widescreen"
        >
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
                  @click="confirmPurchase"
                  :loading="purchaseButtonLoading"
                  expanded
                  >Purchase
                  <span
                    class="has-text-weight-semibold"
                    v-if="course.price !== 0"
                    >{{ formatCurrency(course.price) }}</span
                  >
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
                  <form @submit.prevent="purchaseUsingCoupon" class="is-flex">
                    <b-field class="is-flex-grow-1">
                      <b-input
                        icon="ticket"
                        size="is-small"
                        placeholder="Please write the coupon code her"
                        v-model="coupon"
                        required
                      ></b-input>
                    </b-field>
                    <b-button
                      native-type="submit"
                      icon-left="check"
                      type="is-success"
                      size="is-small"
                      class="ml-2"
                      :loading="couponButtonLoading"
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
          <cloud-loading class="mt-2" v-if="lessonsLoading" />
          <NotFoundBox text="No lessons found" v-else-if="!lessons.length" />
          <div class="mb-2" v-for="(lesson, idx) of lessons" :key="lesson.id">
            <lesson-card :lesson="lesson" :idx="idx + 1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
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

@Component({
  components: { CourseCard, LessonCard, CloudLoading, NotFoundBox },
})
export default class Course extends Vue {
  public activeSession: Session | null = null;

  public course: CourseContract | null = null;
  public lessons: LessonContract[] = [];
  public courseLoading = true;
  public lessonsLoading = true;
  public purchaseButtonLoading = false;
  public couponButtonLoading = false;
  public coupon = "";
  public searchText = "";

  // utils
  public formatCurrency = formatCurrency;

  mounted() {
    const courseId = Number(this.$route.params.id);
    this.getActiveSession();

    rpc
      .call(RPC_GET_COURSE_METHOD, { courseId })
      .then((course) => {
        this.course = course as any as CourseContract;
      })
      .catch((error) => {
        if (error.jsonrpcError) {
          const { jsonrpcError } = error;
          console.log(jsonrpcError);
          if (jsonrpcError.code === RPC_RESOURCE_NOT_FOUND_ERR_CODE) {
            this.$router.push("/");
          }
        }
      })
      .finally(() => {
        this.courseLoading = false;
      });

    rpc
      .call(RPC_GET_LESSONS_METHOD, { courseId })
      .then((lessons) => {
        this.lessons = lessons as any as LessonContract[];
      })
      .catch((error) => {
        if (error.jsonrpcError) {
          const { jsonrpcError } = error;
          if (jsonrpcError.code === RPC_RESOURCE_NOT_FOUND_ERR_CODE) {
            this.$router.push("/");
          }
        }
      })
      .finally(() => (this.lessonsLoading = false));
  }

  public getActiveSession() {
    SessionStorage.getActiveSession().then((session) => {
      this.activeSession = session;
    });
  }

  public confirmPurchase() {
    this.$buefy.dialog.confirm({
      message:
        'Do you really want to purchase this course ?<br><span class="has-text-weight-semibold">After purchasing the course you cannot cancel this operation!</span>',
      onConfirm: () => this.purchase(),
      confirmText: "Purchase",
      hasIcon: true,
      icon: "shopping-basket",
    });
  }

  public confirmDeleteCourse() {
    this.$buefy.dialog.confirm({
      title: "Deleting course",
      message: "Are you sure you want to <b>delete</b> this course?",
      confirmText: "Delete Course",
      type: "is-danger",
      hasIcon: true,
      onConfirm: () => this.deleteCourse(),
    });
  }

  public purchaseUsingCoupon() {
    const courseId = Number(this.$route.params.id);
    this.couponButtonLoading = true;
    rpc
      .call(RPC_PURCHASE_COURSE_METHOD, {
        courseId,
        coupon: this.coupon,
      })
      .then(() => {
        this.$router.go(0);
      })
      .catch(() => {
        showToastMessage(
          "This operation cannot be performed",
          ToastType.Danger
        );
      })
      .finally(() => (this.couponButtonLoading = false));
  }

  public purchase() {
    this.purchaseButtonLoading = true;
    rpc
      .call(RPC_PURCHASE_COURSE_METHOD, {
        courseId: Number(this.$route.params.id),
      })
      .then(() => {
        this.$router.go(0);
      })
      .catch((error) => {
        if (error.jsonrpcError) {
          const { jsonrpcError } = error;
          if (jsonrpcError.code === RPC_INSUFFICIENT_BALANCE_ERR_CODE) {
            showToastMessage("Insufficient balance", ToastType.Danger);
            return;
          }
        }
        showToastMessage(
          "This operation cannot be performed",
          ToastType.Danger
        );
      })
      .finally(() => (this.purchaseButtonLoading = false));
  }

  public deleteCourse() {
    const courseId = Number(this.$route.params.id);

    rpc
      .call(RPC_DELETE_COURSE_METHOD, { courseId })
      .then(() => {
        this.$router.push({ name: "Home" });
        showToastMessage("Successfully deleted!", ToastType.Warning);
      })
      .catch(() => {
        showToastMessage("Unable to delete the course!", ToastType.Danger);
      });
  }
}
</script>
