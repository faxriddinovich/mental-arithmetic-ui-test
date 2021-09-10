<template>
  <div class="container">
    <div class="mx-2 pt-5">
      <div class="columns">
        <div class="column is-4-desktop">
          <course-card :course="course" :isLoading="isLoading" />
          <div class="card mt-3 p-3">
            <div class="buttons">
              <b-button
                type="is-success"
                icon-left="shopping-basket"
                :disabled="isLoading"
                expanded
                >Purchase

                <b-skeleton width="60px" v-if="isLoading" />
                <span class="has-text-weight-semibold" v-else>23,000</span>
              </b-button>
              <b-button
                type="is-light"
                size="is-small"
                icon-left="ticket"
                :disabled="isLoading"
                expanded
                >I have an activation code</b-button
              >
            </div>
          </div>
          <div class="card mt-3 p-3">
          <b-skeleton count="2" v-if="isLoading" />
            <b-taglist v-else>
              <b-tag type="is-primary" v-for="tag of course.tags" :key="tag">{{tag}}</b-tag>
            </b-taglist>
          </div>
        </div>
        <div class="column is-8-desktop">
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
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { rpc } from "@/rpc/rpc";
import { Database } from "@/services/database";
import { RPC_RESOURCE_NOT_FOUND_ERR_CODE } from '@/rpc/error-codes';
import { RPC_GET_COURSE_METHOD } from '@/rpc/methods';
import CourseCard from "@/components/course/card";

@Component({ components: { CourseCard } })
export default class Course extends Vue {
  public course = {};
  public isLoading = true;
  public searchText = "";

  async mounted() {
    const session = await Database.getCurrentSession();
    if (session) {
      rpc.setHeader("session", session.session);
    }
    try {
      this.course = await rpc.call(RPC_GET_COURSE_METHOD, { courseId: Number(this.$route.params.id) });
      this.isLoading = false;
    } catch (error) {
      if(error.jsonrpcError) {
        const { jsonrpcError } = error;
        if(jsonrpcError.code === RPC_RESOURCE_NOT_FOUND_ERR_CODE) {
          this.$router.push('/');
        }
      }
    }
  }
}
</script>
