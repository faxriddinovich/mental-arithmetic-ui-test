<template>
  <div>
    <b-field>
      <template #label> <b-icon icon="file" /> {{ $t("theme") }} </template>
      <b-autocomplete
        :placeholder="$t('themes_input_placeholder')"
        icon="search"
        :data="themes"
        dropdown-position="bottom"
        @focus="themesInputFocus = true"
        @focusout.native="themesInputFocus = false"
        :custom-formatter="(option) => $t(option.loc, { digit })"
        @select="pickTheme"
        v-model="theme"
        open-on-focus
        keep-first
        expanded
        clearable
      >
        <template #header>
          {{ $t("themes_found") }}:
          <span class="has-text-weight-semibold">{{ themes.length }}</span>
        </template>

        <template slot-scope="props">
          <div class="is-flex is-justify-content-space-between">
            <div>
              <b-icon icon="file" /> {{ $t(props.option.loc, { digit }) }}
            </div>
            <div class="has-text-weight-semibold">
              <b-tag type="is-primary  ">
                {{ props.option.metadata.operation | toOperation }}
              </b-tag>
            </div>
          </div>
        </template>

        <template #empty>{{ $t("no_themes_found") }}</template>
      </b-autocomplete>
    </b-field>
    <b-field title="esf">
      <template #label>
        <b-icon icon="draggabledots" /> {{ $t("digits") }}
      </template>
      <b-radio-button :native-value="1" v-model="digit" type="is-primary">
        <span>1</span>
      </b-radio-button>
      <b-radio-button :native-value="2" v-model="digit" type="is-primary">
        <span>2</span>
      </b-radio-button>
      <b-radio-button :native-value="3" v-model="digit" type="is-primary">
        <span>3</span>
      </b-radio-button>
      <b-radio-button :native-value="4" v-model="digit" type="is-primary">
        <span>4</span>
      </b-radio-button>
      <b-radio-button :native-value="5" v-model="digit" type="is-primary">
        <span>5</span>
      </b-radio-button>
      <b-radio-button :native-value="6" v-model="digit" type="is-primary">
        <span>6</span>
      </b-radio-button>
    </b-field>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from "@vue/composition-api";
import { Theme } from "@mental-arithmetic/themes";
import { getThemes } from "@/services/generator";

const lowerCase = (str: string) => str.toLowerCase();
const matches = (str0: string, str1: string) => {
  return lowerCase(str0).indexOf(lowerCase(str1)) >= 0;
};

export default defineComponent({
  setup(_, context) {
    const themesInputFocus = ref<boolean>(false);
    const digit = ref<number>(1);
    const theme = ref<string>("");

    const themes = computed(() => {
      return getThemes().filter(({ loc, metadata }) => {
        const shouldBeExcluded = metadata.excludeDigits?.includes(digit.value);
        if (shouldBeExcluded) return false;

        const message = context.root.$t(loc, { digit: digit.value }) as string;
        if (!matches(message, theme.value)) return false;

        return true;
      });
    });

    let cacheTheme: Theme | null = null;
    const pickTheme = (value: Theme) => {
      context.emit("pick", digit.value, value.loc);
      cacheTheme = value;
    };

    const pickDigit = (value: number) => {
      if (cacheTheme) context.emit("pick", value, cacheTheme);
    };

    return {
      digit,
      theme,
      themes,
      pickTheme,
      pickDigit,
      themesInputFocus,
    };
  },
});
</script>

