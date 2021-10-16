<template>
  <div class="container is-max-desktop">
    <div class="mx-2 pt-2" v-if="course">
      <div class="card p-4">
        <form @submit.prevent="update">
          <b-field label="Title:" horizontal>
            <b-input
              icon="pen"
              v-model="course.title"
              placeholder="e.g: Awesome course"
              minlength="5"
              maxlength="50"
              required
            ></b-input>
          </b-field>
          <b-field label="Description:" horizontal>
            <b-input
              type="textarea"
              v-model="course.description"
              placeholder="Some description here"
              minlength="10"
              maxlength="500"
              required
            ></b-input>
          </b-field>
          <b-field label="Course tags:" horizontal>
            <b-taginput
              v-model="course.tags"
              ellipsis
              icon="label"
              placeholder="Add a tag"
              aria-close-label="Delete this tag"
              maxlength="12"
              maxtags="20"
            >
            </b-taginput>
          </b-field>
          <b-field label="Category:" horizontal>
            <b-autocomplete
              v-model="course.category"
              :data="filtered"
              :loading="categoriesInputLoading"
              :open-on-focus="true"
              placeholder="e.g. Awesome course"
              icon="box"
              @select="(option) => (selectedCategory = option)"
              minlength="4"
              maxlength="20"
              clearable
              required
            >
              <template #empty>No results found</template>
            </b-autocomplete>
          </b-field>
          <b-field label="Coupon:" horizontal>
            <b-input
              type="text"
              v-model="course.coupon"
              icon="asterisk"
              placeholder="Please write strong text"
            />
          </b-field>
          <b-field label="Price:" horizontal>
            <b-numberinput
              v-model="course.price"
              :controls="false"
              :min="0"
              expanded
            ></b-numberinput>
          </b-field>
          <b-field label="Image:" horizontal>
            <upload
              accept=".jpg,.jpeg,.png"
              @uploaded="imageUploaded"
              @maxFileSizeError="maxFileSizeError"
            />
          </b-field>
          <div class="mt-5">
            <b-button
              native-type="submit"
              type="is-primary"
              icon-left="upload-alt"
              :loading="updateButtonLoading"
              expanded
              >Update</b-button
            >
          </div>
        </form>
      </div>
      <div class="is-flex mt-4">
        <b-button tag="router-link" :to="{ name: 'Course', params: { id: course.id } }" icon-left="arrow-left" expanded
          >Course</b-button
        >
        <b-button class="ml-2" tag="router-link" to="/" icon-left="home" expanded
          >Home</b-button
        >
      </div>
    </div>
    <CloudLoading class="pt-4" v-else />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Upload from "@/components/upload.vue";
import { rpc } from "@/services/rpc";
import {
  RPC_GET_COURSE_CATEGORIES_METHOD,
  RPC_GET_COURSE_FOR_UPDATE_METHOD,
  RPC_UPDATE_COURSE_METHOD,
} from "@/services/rpc/methods";
import { CourseContract } from "@/services/rpc/contracts/course";
import CloudLoading from '@/components/cloud-loading.vue';

@Component({ components: { CloudLoading, Upload } })
export default class UpdateCourse extends Vue {
  public course: CourseContract | null = null;
  public categories: string[] = [];

  public categoriesInputLoading = false;
  public updateButtonLoading = false;

  public get filtered() {
    return this.categories.filter((option) => {
      return option
        .toLowerCase()
        .indexOf(this.course.category.toLowerCase()) >= 0
    });
  }

  mounted() {
    this.getCategories();
    this.getCourse();
  }

  public getCourse() {
    const courseId = Number(this.$route.params.id);
    rpc.call(RPC_GET_COURSE_FOR_UPDATE_METHOD, { courseId }).then((course) => {
      this.course = course;
    })
  }

  public getCategories() {
    this.categoriesInputLoading = true;
    rpc
      .call(RPC_GET_COURSE_CATEGORIES_METHOD)
      .then((categories) => {
        this.categories = categories as any as string[];
      })
      .finally(() => {
        this.categoriesInputLoading = false;
      });
  }

  public update() {
    const courseId = Number(this.$route.params.id);
    const course = this.course;

    const params = {
      courseId,
      title: course.title,
      description: course.description,
      category: course.category,
      coupon: course.coupon?.length ? course.coupon : null,
      price: course.price
    }

    if(course.image.length) params['image'] = course.image;

    rpc.call(RPC_UPDATE_COURSE_METHOD, params).then(() => {
      this.$buefy.toast.open({ type: 'is-success', message: 'Successfully updated!' });
      this.$router.push({ name: 'Home' });
    });
  }

  public imageUploaded(fguid: string) {
    this.course.image = fguid;
  }

  public maxFileSizeError() {
    this.$buefy.toast.open({
      type: "is-danger",
      message: `The size of the file is too large.`,
    });
  }
}
</script>
