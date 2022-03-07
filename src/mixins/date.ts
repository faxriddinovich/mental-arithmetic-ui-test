import { format } from "date-fns";
import { uz, ru, enUS } from "date-fns/locale";
import { acquireSetting } from '@/store/setting';

export const dateMixin = {
  methods: {
    localizeDate(date: number | string | Date) {
      const locale = acquireSetting().one('locale');
      let loc;

      if(locale === "uz-UZ") {
        loc = uz;
      } else if (locale === "en-US") {
        loc = enUS;
      } else if (locale === "ru-RU") {
        loc = ru;
      }

      return format(Number(date), "PPPpp", { locale: loc });
    }
  }
}
