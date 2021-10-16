<template>
  <div class="container is-max-desktop">
    <div class="mx-2 pt-2">
      <div class="card p-4 mt-2">
        <form @submit.prevent="create">
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
import { rpc } from "@/services/rpc";
import {
  RPC_GET_COURSE_CATEGORIES_METHOD,
  RPC_CREATE_COURSE_METHOD,
} from "@/services/rpc/methods";
import { CourseCreationContract } from "@/services/rpc/contracts/course";

@Component({ components: { Upload } })
export default class CreateCourse extends Vue {
  public course: CourseCreationContract = {
    title: "",
    description: "",
    category: "",
    tags: [],
    coupon: "",
    price: 0,
    image: "",
  };

  public categoryLoading = true;
  public categories: string[] = [];

  public createButtonLoading = false;

  mounted() {
    rpc
      .call(RPC_GET_COURSE_CATEGORIES_METHOD)
      .then((categories) => {
        // FIXME: this is must be fixed in the future
        this.categories = categories as any as string[];
      })
      .finally(() => (this.categoryLoading = false));
  }

  public get filtered() {
    return this.categories.filter((option: string) => {
      return (
        option.toLowerCase().indexOf(this.course.category.toLowerCase()) >= 0
      );
    });
  }

  public imageUploaded(fguid: string) {
    this.image = fguid;
  }

  public maxFileSizeError() {
    this.$buefy.toast.open({
      type: "is-danger",
      message: `The size of the file is too large.`,
    });
  }

  public create() {
    const { course } = this;

    // exclude empty fields from the params. I this ok ?
    if (!course.tags.length) delete course["tags"];
    if (!course.coupon.length) delete course["coupon"];
    if (!course.image.length) delete course["image"];
    this.createButtonLoading = true;

    rpc
      .call(RPC_CREATE_COURSE_METHOD, course)
      .then((id) => {
        this.$buefy.toast.open({
          position: "is-top",
          message: "Successfully created!",
          type: "is-success",
        });
        this.$router.push({ name: "Course", params: { id } });
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
