<template>
  <div class="card">
    <div class="card-image is-relative">
      <b-image
        :src="
          course && course.image
            ? fsBucketFactory(course.image)
            : placeholderImg
        "
        :placeholder="placeholderImg"
        ratio="4by3"
      />
      <div class="is-bottom-left" v-if="!isLoading">
        <b-tag type="is-primary">{{ course.category }}</b-tag>
      </div>
    </div>
    <div class="card-content p-3">
      <div class="has-text-weight-semibold is-size-5">
        <b-skeleton width="70%" v-if="isLoading" />
        <div :class="!detailed && 'is-card-title'" v-else>
          <span v-if="detailed">{{ course.title }}</span>
          <router-link
            :to="{ name: 'Course', params: { id: course.id } }"
            class="has-text-dark"
            v-else
            >{{ course.title }}</router-link
          >
        </div>
      </div>
      <div class="mt-3" v-if="detailed">
        <b-skeleton :count="4" v-if="isLoading" />
        <span class="is-word-wrap" v-else>
          {{ course.description }}
        </span>
      </div>
      <div
        class="
          is-flex is-justify-content-space-between is-align-items-center
          mt-4
        "
      >
        <div>
          <div>
            <b-skeleton width="150px" v-if="isLoading" />
            <div v-else>
              <b-icon icon="user" />
              <span
                :class="{
                  'has-text-weight-semibold': true,
                  'is-blocked': course.author.isBlocked,
                }"
                >{{ course.author.username }}</span
              >
              <b-icon
                icon="check-circle"
                class="ml-1"
                type="is-info"
                v-if="course.author.role === 'root'"
              />
            </div>
          </div>
          <b-skeleton width="150px" v-if="isLoading" />
          <div v-else>
            <b-rate
              icon-pack="uis"
              v-model="course.ratingAvg"
              :custom-text="course.ratingAvg"
              :size="detailed ? 'is-medium' : ''"
              :disabled="!detailed || !activeSession || !course.canRate"
              @change="rate"
            ></b-rate>
          </div>
        </div>
        <div>
          <b-skeleton width="100px" v-if="isLoading" />
          <span class="has-text-weight-bold is-size-5" v-else>
            <span class="has-text-success" v-if="course.price === 0"
              >*FREE</span
            >
            <span v-else
              >
              <span :class="priceClasses">
               {{ formatCurrency(course.price) }}
                <span class="has-text-weight-light">uzs</span>
              </span></span
            >
          </span>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <div class="card-footer-item">
        <b-skeleton v-if="isLoading" />
        <b-tooltip label="Lessons count" v-else>
          <span class="has-text-weight-semibold">
            <b-icon icon="clipboard-alt" />{{ course.lessonsCount }}
          </span>
        </b-tooltip>
      </div>
      <div class="card-footer-item">
        <b-skeleton v-if="isLoading" />
        <b-tooltip label="Exercises count" v-else>
          <span class="has-text-weight-semibold"
            ><b-icon icon="ruler" />{{ course.tasksCount }}</span
          >
        </b-tooltip>
      </div>
      <div class="card-footer-item">
        <b-skeleton v-if="isLoading" />
        <b-tooltip label="Purchased count" v-else>
          <span class="has-text-weight-semibold"
            ><b-icon icon="users-alt" />{{ course.purchasedCount }}</span
          >
        </b-tooltip>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { rpc } from "@/services/rpc";
import { RPC_RATE_COURSE_METHOD } from "@/services/rpc/methods";
import { CourseContract } from "@/services/rpc/contracts/course";
import { Session, SessionStorage } from "@/services/storages/session";
import { formatCurrency, fsBucketFactory } from "@/common/utils";

@Component
export default class CourseCard extends Vue {
  @Prop(Object) public course!: CourseContract;
  @Prop({ type: Boolean, default: false }) public isLoading!: boolean;
  @Prop({ type: Boolean, default: false }) public detailed!: boolean;

  public activeSession: Session | null = null;
  public formatCurrency = formatCurrency;
  public fsBucketFactory = fsBucketFactory;

  mounted() {
    this.getActiveSession();
  }

  public get priceClasses() {
    const classes: string[] = ["has-text-primary"];
    if (this.detailed) classes.push("is-size-4");
    else classes.push("is-size-5");

    return classes;
  }

  public getActiveSession() {
    SessionStorage.getActiveSession().then((session) => {
      this.activeSession = session;
    });
  }

  public get placeholderImg() {
    return require("../../../public/img/placeholder.jpg");
  }

  public rate(rating: number) {
    const courseId = Number(this.$route.params.id);
    rpc
      .call(RPC_RATE_COURSE_METHOD, { rating, courseId })
      .then(() => {
        this.$buefy.toast.open({
          message: "Success",
          type: "is-success",
          position: "is-top",
        });
      })
      .catch(() => {
        this.$buefy.toast.open({
          message: "Failed to rate the course",
          type: "is-danger",
          position: "is-top",
        });
      });
  }
}
</script>
<style lang="scss" scoped>
.is-card-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 3.8rem;
}

.is-word-wrap {
  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  /* This is the dangerous one in WebKit, as it breaks things wherever */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;

  /* Adds a hyphen where the word breaks, if supported (No Blink) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
}
</style>
