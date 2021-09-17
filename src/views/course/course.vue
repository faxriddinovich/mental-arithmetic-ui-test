<template>
  <div class="container">
    <div class="mx-2 pt-5">
      <div class="columns">
        <div
          class="column is-12-mobile is-6-tablet is-5-desktop is-4-widescreen"
        >
          <course-card :course="course" :isLoading="courseLoading" />
          <div class="mt-3">
            <div class="card p-3" v-if="courseLoading">
              <b-skeleton :count="2" />
            </div>
            <div
              class="card p-3"
              v-else-if="!course.purchased && course.price && session"
            >
              <div class="buttons">
                <b-button
                  type="is-success"
                  icon-left="shopping-basket"
                  @click="confirmPurchase"
                  :loading="purchaseButtonLoading"
                  expanded
                  >Purchase
                  <span class="has-text-weight-semibold">{{
                    formatCurrency(course.price)
                  }}</span>
                </b-button>

                <b-collapse
                  :open="false"
                  aria-id="contentIdForA11y1"
                  style="width: 100%"
                >
                  <template #trigger>
                    <b-button
                      type="is-light"
                      size="is-small"
                      icon-left="ticket"
                      :disabled="courseLoading"
                      expanded
                      aria-controls="contentIdForA11y1"
                      >I have an activation code</b-button
                    >
                  </template>
                  <form @submit.prevent="activate" class="is-flex">
                    <b-field class="is-flex-grow-1">
                      <b-input
                        icon="ticket"
                        size="is-small"
                        placeholder="Please write the code"
                        v-model="activationCode"
                        required
                      ></b-input>
                    </b-field>
                    <b-button
                      native-type="submit"
                      icon-left="check"
                      type="is-success"
                      size="is-small"
                      class="ml-2"
                      :loading="activateButtonLoading"
                      >Activate</b-button
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
            to="/"
            class="mt-3"
            icon-left="home"
            expanded
            >Home</b-button
          >
        </div>
        <div class="column">
          <div class="card p-3">
            <form @submit.prevent="search" class="is-flex">
              <b-input
                v-model="searchText"
                class="is-flex-grow-1"
                placeholder="Please write something"
                icon="search"
              />
              <b-button
                native-type="submit"
                type="is-primary"
                class="ml-3"
                icon-left="search"
                >Search</b-button
              >
            </form>
          </div>
          <div class="mt-4">
            <cloud-loading class="mt-2" v-if="lessonsLoading" />
            <NotFoundBox text="No lessons found" v-else-if="!lessons.length" />
            <div class="columns is-multiline" v-else>
              <div
                class="
                  column
                  is-12-mobile is-12-tablet is-12-desktop is-6-widescreen
                "
                v-for="lesson of lessons"
                :key="lesson.id"
              >
                <lesson-card :lesson="lesson" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { rpc } from "@/rpc/rpc";
import { Database } from "@/services/indexeddb/database";
import { Session } from "@/services/indexeddb/interfaces";
import {
  RPC_RESOURCE_NOT_FOUND_ERR_CODE,
  RPC_INSUFFICIENT_BALANCE_ERR_CODE,
} from "@/rpc/error-codes";
import {
  RPC_GET_COURSE_METHOD,
  RPC_GET_LESSONS_METHOD,
  RPC_PURCHASE_COURSE_METHOD,
} from "@/rpc/methods";
import { formatCurrency } from "@/common/utils";
import CourseCard from "@/components/course/card.vue";
import LessonCard from "@/components/lesson/card.vue";
import CloudLoading from "@/components/cloud-loading.vue";
import NotFoundBox from "@/components/not-found-box.vue";

@Component({
  components: { CourseCard, LessonCard, CloudLoading, NotFoundBox },
})
export default class Course extends Vue {
  public session: Session | null = null;
  public course = {};
  public lessons = [];
  public courseLoading = true;
  public lessonsLoading = true;
  public purchaseButtonLoading = false;
  public activationCode = "";
  public activateButtonLoading = false;
  public searchText = "";

  async mounted() {
    Database.getCurrentSession().then((session) => {
      this.session = session;
    });
    const courseId = Number(this.$route.params.id);

    rpc
      .call(RPC_GET_COURSE_METHOD, { courseId })
      .then((course) => {
        this.course = course;
      })
      .catch((error) => {
        if (error.jsonrpcError) {
          const { jsonrpcError } = error;
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
        this.lessons = lessons;
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

  public activate() {
    this.activateButtonLoading = true;
    rpc
      .call(RPC_PURCHASE_COURSE_METHOD, {
        courseId: Number(this.$route.params.id),
        pcode: this.activationCode,
      })
      .then(() => {
        this.$router.go();
      })
      .catch(() => {
        this.$buefy.toast.open({
          message: "This operation cannot be performed",
          position: "is-top",
          type: "is-danger",
        });
      })
      .finally(() => (this.activateButtonLoading = false));
  }

  public purchase(usingCode: boolean) {
    this.purchaseButtonLoading = true;
    rpc
      .call(RPC_PURCHASE_COURSE_METHOD, {
        courseId: Number(this.$route.params.id),
      })
      .then(() => {
        this.$router.go();
      })
      .catch((error) => {
        if (error.jsonrpcError) {
          const { jsonrpcError } = error;
          if (jsonrpcError.code === RPC_INSUFFICIENT_BALANCE_ERR_CODE) {
            this.$buefy.toast.open({
              message: "Insufficient balance",
              position: "is-top",
              type: "is-danger",
            });
            return;
          }
        }
        this.$buefy.toast.open({
          message: "This operation cannot be performed",
          position: "is-top",
          type: "is-danger",
        });
      })
      .finally(() => (this.purchaseButtonLoading = false));
  }

  public formatCurrency(amount: number): string {
    return formatCurrency(amount);
  }
}
</script>
