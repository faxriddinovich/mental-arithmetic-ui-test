import { Component, Vue } from "vue-property-decorator";
import { formatCurrency } from "@/common/utils";

@Component
export class Base extends Vue {
  public fsBucketFactory(id: string) {
    return process.env.VUE_APP_FS_BUCKET_URL + "/" + id;
  }

  public formatCurrency(amount: number): string {
    return formatCurrency(amount);
  }
}
