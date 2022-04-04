<template>
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
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch } from "@vue/composition-api";
import { Theme } from "@mental-arithmetic/themes";
import { getThemes } from "@/services/generator";

const lowerCase = (str: string) => str.toLowerCase();
const matches = (str0: string, str1: string) => {
  return lowerCase(str0).indexOf(lowerCase(str1)) >= 0;
};

export default defineComponent({
  props: {
    digit: { type: Number, required: true },
  },
  setup(props, context) {
    const themesInputFocus = ref<boolean>(false);
    const theme = ref<string>("");

    const themes = computed(() => {
      return getThemes().filter(({ loc, metadata }) => {
        const shouldBeExcluded = metadata.excludeDigits?.includes(props.digit);
        if (shouldBeExcluded) return false;

        const message = context.root.$t(loc, { digit: props.digit }) as string;
        if (!matches(message, theme.value)) return false;

        return true;
      });
    });

    const pickTheme = (value: Theme) => {
      context.emit("input", value);
    };

    watch(
      () => props.digit,
      () => (theme.value = "")
    );

    return {
      theme,
      themes,
      pickTheme,
      themesInputFocus,
    };
  },
});
</script>

