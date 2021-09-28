<template>
  <div class="container is-max-desktop">
    <div class="mx-2 pt-3">
      <div class="card p-4 mt-2">
        <form @submit.prevent="create">
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
          <b-field label="Category:" horizontal>
            <b-autocomplete
              v-model="category"
              :data="filtered"
              :loading="categoryLoading"
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
          <b-field label="Purchase code:" horizontal>
            <b-input
              type="text"
              icon="asterisk"
              v-model="coupon"
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
            <b-upload
              v-model="imageObj"
              accept=".jpg,.jpeg,.png"
              :disabled="uploadDisabled"
              drag-drop
              @input="upload"
              expanded
            >
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <b-icon :icon="uploadIcon" size="is-large"> </b-icon>
                  </p>
                  <div>
                    {{ uploadText }}
                  </div>
                </div>
              </section>
            </b-upload>
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
import axios from "axios";
import { rpc } from "@/rpc/rpc";
import {
  RPC_GET_COURSE_CATEGORIES_METHOD,
  RPC_CREATE_COURSE_METHOD,
} from "@/rpc/methods";
import { CourseCreationContract } from '@/rpc/contracts/course';

@Component
export default class CreateCourse extends Vue {
  public title = "";
  public description = "";
  public category = "";
  public selectedCategory = null;
  public tags: string[] = [];
  public coupon = "";
  public price = 0;
  public image = "";
  public imageObj: File | null = null;

  public categoryLoading = true;
  public categories: string[] = [];

  public uploadingState: "neutral" | "uploading" | "uploaded" = "neutral";
  public uploadPercent = 0;

  public createButtonLoading = false;

  mounted() {
    rpc
      .call(RPC_GET_COURSE_CATEGORIES_METHOD)
      .then((categories) => {
        // FIXME: this is must be fixed in the future
        this.categories = (categories as any) as string[];
      })
      .finally(() => (this.categoryLoading = false));
  }

  public get uploadIcon() {
    switch (this.uploadingState) {
      case "uploading":
        return "cloud";
      case "uploaded":
        return "cloud-check";
      default:
        return "upload";
    }
  }

  public get uploadText() {
    switch (this.uploadingState) {
      case "uploading":
        return "Uploading...";
      case "uploaded":
        return "Uploaded";
      default:
        return "Drop an image here or click to upload";
    }
  }

  public get uploadDisabled() {
    return (
      this.uploadingState === "uploading" || this.uploadingState === "uploaded"
    );
  }

  public get filtered() {
    return this.categories.filter((option: string) => {
      return (
        option.toLowerCase().indexOf(this.category.toLowerCase()) >=
        0
      );
    });
  }

  public upload() {
    const form = new FormData();
    form.append("image", this.imageObj!);
    this.uploadingState = "uploading";
    axios
      .post("http://192.168.1.103:3000/fs", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        this.image = response.data;
        this.uploadingState = "uploaded";
      })
      .catch(() => (this.uploadingState = "neutral"));
  }

  public create() {
    const params: CourseCreationContract = {
      title: this.title,
      description: this.description,
      category: this.category,
    };

    if (this.tags.length) params["tags"] = this.tags;
    if (this.coupon.length) params["coupon"] = this.coupon;
    if (this.price) params["price"] = this.price;
    if (this.image.length) params["image"] = this.image;
    this.createButtonLoading = true;
    rpc
      .call(RPC_CREATE_COURSE_METHOD, params)
      .then(() => {
        this.$buefy.toast.open({
          position: "is-top",
          message: "Successfully created!",
          type: "is-success",
        });
      })
      .catch(() => {
        this.$buefy.toast.open({
          position: "is-top",
          message: "Unable to create a course",
          type: "is-danger",
        });
      })
      .finally(() => (this.createButtonLoading = false));
  }
}
</script>
