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
              v-else-if="session && !course.purchased"
            >
              <div class="buttons">
                <b-button
                  type="is-success"
                  icon-left="shopping-basket"
                  @click="confirmPurchase"
                  :loading="purchaseButtonLoading"
                  expanded
                  >Purchase
                  <span class="has-text-weight-semibold" v-if="course.price !== 0">{{
                    formatCurrency(course.price)
                  }}</span>
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
            to="/"
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
import { Component, Mixins, Vue } from "vue-property-decorator";
import CourseCard from "@/components/course/card.vue";
import LessonCard from "@/components/lesson/card.vue";
import CloudLoading from "@/components/cloud-loading.vue";
import NotFoundBox from "@/components/not-found-box.vue";
import { Base } from "@/mixins/base.mixin";
import { rpc } from "@/rpc/rpc";
import {
  RPC_RESOURCE_NOT_FOUND_ERR_CODE,
  RPC_INSUFFICIENT_BALANCE_ERR_CODE,
} from "@/rpc/error-codes";
import {
  RPC_GET_COURSE_METHOD,
  RPC_GET_LESSONS_METHOD,
  RPC_PURCHASE_COURSE_METHOD,
} from "@/rpc/methods";
import { CourseContract } from '@/rpc/contracts/course';
import { LessonContract } from '@/rpc/contracts/lesson';

@Component({
  components: { CourseCard, LessonCard, CloudLoading, NotFoundBox },
})
export default class Course extends Mixins(Base) {
  public course: CourseContract | null = null;
  public lessons: LessonContract[] = [];
  public courseLoading = true;
  public lessonsLoading = true;
  public purchaseButtonLoading = false;
  public couponButtonLoading = false;
  public coupon = "";
  public searchText = "";

  async mounted() {
    const courseId = Number(this.$route.params.id);

    rpc
      .call(RPC_GET_COURSE_METHOD, { courseId })
      .then((course) => {
        this.course = (course as any) as CourseContract;
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
        this.lessons = (lessons as any) as LessonContract[];
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
        this.$buefy.toast.open({
          message: "This operation cannot be performed",
          position: "is-top",
          type: "is-danger",
        });
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
}
</script>
