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
            <div class="card p-3" v-else-if="!course.purchased && course.price">
              <div class="buttons">
                <b-button
                  type="is-success"
                  icon-left="shopping-basket"
                  @click="purchase"
                  :loading="purchaseButtonLoading"
                  expanded
                  >Purchase
                  <span class="has-text-weight-semibold">{{
                    formatCurrency(course.price)
                  }}</span>
                </b-button>
                <b-button
                  type="is-light"
                  size="is-small"
                  icon-left="ticket"
                  :disabled="courseLoading"
                  expanded
                  >I have an activation code</b-button
                >
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
import { Database } from "@/services/database";
import { RPC_RESOURCE_NOT_FOUND_ERR_CODE } from "@/rpc/error-codes";
import { RPC_GET_COURSE_METHOD, RPC_GET_LESSONS_METHOD, RPC_PURCHASE_COURSE_METHOD } from "@/rpc/methods";
import { formatCurrency } from "@/common/utils";
import CourseCard from "@/components/course/card.vue";
import LessonCard from "@/components/lesson/card.vue";
import CloudLoading from "@/components/cloud-loading.vue";
import NotFoundBox from "@/components/not-found-box.vue";

@Component({
  components: { CourseCard, LessonCard, CloudLoading, NotFoundBox },
})
export default class Course extends Vue {
  public course = {};
  public lessons = [];
  public courseLoading = true;
  public lessonsLoading = true;
  public purchaseButtonLoading = false;
  public searchText = "";

  async mounted() {
    const session = await Database.getCurrentSession();
    if (session) {
      rpc.setHeader("session", session.session);
    }
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

  public purchase() {
    this.purchaseButtonLoading = true;
    rpc.setHeader('session', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InJvb3QiLCJpYXQiOjE2MzE0NDYzNjQsImV4cCI6MTYzMTc5MTk2NH0.FMa6fhqF77Zun3Ye8leObnlMHviePZTrmd2sDA2z8Og').call(RPC_PURCHASE_COURSE_METHOD, { courseId: Number(this.$route.params.id) }).then(() => {
      this.$router.go();
    }).catch((error) => {
      console.log(error);
    }).finally(() => this.purchaseButtonLoading = false);
  }

  public formatCurrency(amount: number): string {
    return formatCurrency(amount);
  }
}
</script>
