<template>
  <b-upload
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

type uploadState = "upload" | "uploading" | "uploaded";

@Component
export default class Upload extends Vue {
  @Prop({ type: String, default: ".jpg,.png" }) public accept!: string;
  public maxUploadSize: number | null = null;

  public uploadState: uploadState = "upload";

  public get uploadText() {
    switch (this.uploadState) {
      case "uploading":
        return "Uploading...";
      case "uploaded":
        return "Uploaded!";
      default:
        return `Drop a file here or click to upload. Max. upload size: <b>${
          this.maxUploadSize && (this.maxUploadSize / (1024 * 1024)).toFixed(2)
        } MB</b><br>Accepts: <b>${this.accept}<b>`;
    }
  }

  public get uploadIcon() {
    switch (this.uploadState) {
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
      this.uploadState === "uploading" ||
      this.uploadState === "uploaded"
    );
  }

  mounted() {
    this.getMaxUploadSize();
  }

  public getMaxUploadSize() {
    rpc
      .call(RPC_GET_SETTINGS_METHOD, { key: "max_upload_file_size" })
      .then((setting) => {
        this.maxUploadSize = setting ? Number(setting.value) : 0;
      });
  }

  public upload(file: File) {
    if (file.size > this.maxUploadSize) {
      this.$emit("fileSizeError", file.size);
      return;
    }

    const form = new FormData();
    form.append("file", file);
    this.uploadState = "uploading";
    axios
      .post(process.env.VUE_APP_FS_BUCKET_URL, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        this.$emit("upload", response.data.filename);
        this.uploadState = "uploaded";
      })
      .catch((error) => {
        this.uploadState = "upload";
        this.$emit("uploadError", error);
      });
  }
}
</script>
