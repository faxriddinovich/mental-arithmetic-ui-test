<template>
  <div class="container is-max-desktop">
    <div class="mx-2 pt-2">
      <div class="card p-5">
        <form @submit.prevent="createCourse">
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
              @uploaded="imageUploaded"
              @maxFileSizeError="maxFileSizeError"
            />
          </b-field>
          <div class="mt-5">
            <b-button
              native-type="submit"
              type="is-primary"
              icon-left="plus"
              :loading="createButtonLoading"
              expanded
              >Create</b-button
            >
          </div>
        </form>
      </div>
      <div class="mt-4">
        <b-button tag="router-link" to="/" icon-left="home" expanded
          >Home</b-button
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Upload from "@/components/upload.vue";
import { showToastMessage, ToastType } from '@/services/toast';
import { rpc } from "@/services/rpc";
import {
  RPC_GET_COURSE_CATEGORIES_METHOD,
  RPC_CREATE_COURSE_METHOD,
} from "@/services/rpc/methods";
import { CreateCourseContract } from "@/services/rpc/contracts/course";

@Component({ components: { Upload } })
export default class CreateCourse extends Vue {
  public title = "";
  public category = "";
  public description = "";
  public image = "";
  public price = 0;
  public coupon = "";
  public tags = [];
  public categories: string[] = [];

  public categoriesInputLoading = false;
  public createButtonLoading = false;

  public get filteredCategories() {
    return this.categories.filter((category) => {
      return category.indexOf(this.category.toLowerCase()) >= 0;
    });
  }

  mounted() {
    this.getCategories();
  }

  public getCategories() {
    rpc
      .call(RPC_GET_COURSE_CATEGORIES_METHOD)
      .then((categories) => {
        this.categories = categories;
      })
      .finally(() => {
        this.categoriesInputLoading = false;
      });
  }

  public createCourse() {
    this.createButtonLoading = true;

    const course: CreateCourseContract = {
      title: this.title,
      description: this.description,
      category: this.category,
    };

    if (this.coupon.length) course["coupon"] = this.coupon;
    if (this.price > 0) course["price"] = this.price;
    if (this.image?.length) course["image"] = this.image;
    if (this.tags.length) course["tags"] = this.tags;

    rpc
      .call(RPC_CREATE_COURSE_METHOD, course)
      .then((courseId) => {
        showToastMessage("Successfully created!", ToastType.Success);
        this.$router.push({ name: "Course", params: { id: courseId } });
      })
      .catch(() => {
        showToastMessage("Unable to create a course!", ToastType.Danger);
      })
      .finally(() => {
        this.createButtonLoading = false;
      });
  }

  public imageUploaded(fguid: string) {
    this.image = fguid;
  }

  public maxFileSizeError() {
    showToastMessage("The size of the file is too large!", ToastType.Danger);
  }
}
</script>
