<template>
  <div class="container is-max-desktop">
    <div class="mx-2 pt-2">
      <div class="card p-5">
        <form @submit.prevent="update">
          <b-field label="Title:" horizontal>
            <b-input
              icon="pen"
              v-model="title"
              placeholder="e.g: Awesome course"
              minlength="5"
              maxlength="50"
              required
            ></b-input>
          </b-field>
          <b-field label="Description:" horizontal>
            <b-input
              type="textarea"
              v-model="description"
              placeholder="Some description here"
              minlength="10"
              maxlength="500"
              required
            ></b-input>
          </b-field>
          <b-field label="Category:" horizontal>
            <b-autocomplete
              v-model="category"
              :data="filteredCategories"
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
          <b-field label="Course tags:" horizontal>
            <b-taginput
              v-model="tags"
              ellipsis
              icon="label"
              placeholder="Add a tag"
              aria-close-label="Delete this tag"
              maxlength="12"
              maxtags="20"
            >
            </b-taginput>
          </b-field>
          <b-field label="Coupon:" horizontal>
            <b-input
              type="text"
              v-model="coupon"
              icon="asterisk"
              placeholder="Please write strong text"
            />
          </b-field>
          <b-field label="Price:" horizontal>
            <b-numberinput
              v-model="price"
              :controls="false"
              :min="0"
              expanded
            ></b-numberinput>
          </b-field>
          <b-field label="Image:" horizontal>
            <upload
              accept=".jpg,.jpeg,.png"
              @upload="upload"
              @fileSizeError="fileSizeError"
              @uploadError="uploadError"
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
        <b-button
          tag="router-link"
          :to="{ name: 'Course', params: { id } }"
          icon-left="arrow-left"
          expanded
          >Course</b-button
        >
        <b-button
          class="ml-2"
          tag="router-link"
          to="/"
          icon-left="home"
          expanded
          >Home</b-button
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Upload from "@/components/upload.vue";
import { showToastMessage, ToastType } from "@/services/toast";
import { rpc } from "@/services/rpc";
import {
  RPC_GET_COURSE_CATEGORIES_METHOD,
  RPC_GET_COURSE_FOR_UPDATE_METHOD,
  RPC_UPDATE_COURSE_METHOD,
} from "@/services/rpc/methods";
import { UpdateCourseContract } from "@/services/rpc/contracts/course";

@Component({ components: { Upload } })
export default class UpdateCourse extends Vue {
  public id = 0;
  public title = "";
  public category = "";
  public description = "";
  public image = "";
  public price = 0;
  public coupon = "";
  public tags = [];
  public categories: string[] = [];

  public categoriesInputLoading = false;
  public updateButtonLoading = false;

  public get filteredCategories() {
    const inputCategory = this.category || "";
    return this.categories.filter((category) => {
      return category.indexOf(inputCategory.toLowerCase()) >= 0;
    });
  }

  mounted() {
    this.getCategories();
    this.getCourse();
  }

  public getCourse() {
    const courseId = Number(this.$route.params.id);
    rpc.call(RPC_GET_COURSE_FOR_UPDATE_METHOD, { courseId }).then((course) => {
      this.id = course.id;
      this.title = course.title;
      this.category = course.category;
      this.description = course.description;
      this.image = course.image || "";
      this.price = course.price;
      this.coupon = course.coupon || "";
      this.tags = course.tags;
    });
  }

  public getCategories() {
    this.categoriesInputLoading = true;
    rpc
      .call(RPC_GET_COURSE_CATEGORIES_METHOD)
      .then((categories) => {
        this.categories = categories;
      })
      .finally(() => {
        this.categoriesInputLoading = false;
      });
  }

  public update() {
    const courseId = Number(this.$route.params.id);

    const course: UpdateCourseContract = {
      courseId,
      title: this.title,
      description: this.description,
      category: this.category,
    };

    if (this.coupon.length) course["coupon"] = this.coupon;
    if (this.price > 0) course["price"] = this.price;
    if (this.image?.length) course["image"] = this.image;
    if (this.tags.length) course["tags"] = this.tags;

    rpc
      .call(RPC_UPDATE_COURSE_METHOD, course)
      .then(() => {
        showToastMessage("Successfully updated!", ToastType.Success);
        this.$router.push({ name: "Home" });
      })
      .catch(() => {
        showToastMessage("Unable to update the course!", ToastType.Danger);
      });
  }

  public upload(fguid: string) {
    this.image = fguid;
  }

  public fileSizeError() {
    showToastMessage("The size of the file is too large!", ToastType.Danger);
  }

  public uploadError() {
    showToastMessage("Upload error! Please try again", ToastType.Danger);
  }
}
</script>
