<template>
  <b-upload
    v-model="file"
    :accept="accept"
    :disabled="uploadDisabled"
    @input="upload"
    drag-drop
    expanded
  >
    <section class="section">
      <div class="content has-text-centered">
        <p>
          <b-icon :icon="uploadIcon" size="is-large"> </b-icon>
        </p>
        <div>
          <span v-html="uploadText" />
        </div>
      </div>
    </section>
  </b-upload>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";
import { rpc } from "@/services/rpc";
import { RPC_GET_SETTINGS_METHOD } from "@/services/rpc/methods";

type UploadingState = "upload" | "uploading" | "uploaded";

@Component
export default class Upload extends Vue {
  @Prop({ type: String, default: "" }) public accept!: string;

  public file!: File | null = null;
  public maxUploadSize = null;

  public uploadingState: UploadingState = "upload";

  public get uploadText() {
    switch (this.uploadingState) {
      case "uploading":
        return "Uploading...";
      case "uploaded":
        return "Uploaded!";
      default:
        return `Drop a file here or click to upload. Max. upload size: <b>${
          this.maxUploadSize && (this.maxUploadSize / (1024 * 1024)).toFixed(2)
        } MB</b>`;
    }
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

  public get uploadDisabled() {
    return (
      this.maxUploadSize === null ||
      this.uploadingState === "uploading" ||
      this.uploadingState === "uploaded"
    );
  }

  mounted() {
    rpc
      .call(RPC_GET_SETTINGS_METHOD, { key: "max_upload_size" })
      .then((setting) => {
        this.maxUploadSize = setting ? Number(setting.value) : 0;
      });
  }

  public upload() {
    if (this.file.size > this.maxUploadSize) {
      this.$emit("maxFileSizeError", this.file.size);
      return;
    }

    const form = new FormData();
    form.append("file", this.file!);
    this.uploadingState = "uploading";
    axios
      .post(process.env.VUE_APP_FS_BUCKET_URL, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        this.$emit("uploaded", response.data);
        this.uploadingState = "uploaded";
      })
      .catch(() => (this.uploadingState = "upload"));
  }
}
</script>
