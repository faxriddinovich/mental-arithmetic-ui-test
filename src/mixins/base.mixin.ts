import { Component, Vue } from "vue-property-decorator";
import { formatCurrency } from "@/common/utils";
import { Database } from "@/services/indexeddb/database";
import { Session } from "@/services/indexeddb/interfaces";

@Component
export class Base extends Vue {
  public session: Session | null = null;

  mounted() {
    Database.getCurrentSession().then((session) => {
      this.session = session;
    });
  }

  public fsBucketFactory(id: string) {
    return process.env.VUE_APP_FS_BUCKET_URL + "/" + id;
  }

  public formatCurrency(amount: number): string {
    return formatCurrency(amount);
  }
}
