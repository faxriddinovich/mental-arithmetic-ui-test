<template>
  <b-field>
    <p class="control" v-if="themesInputFocus === false">
      <b-dropdown v-model="digit" @change="pickDigit">
        <template #trigger>
          <b-button>
            <b-icon icon="dialpad-alt" size="is-small" class="m-0" />
            <span class="is-hidden-mobile ml-1">Digits</span>
          </b-button>
        </template>

        <b-dropdown-item custom>Select Digits</b-dropdown-item>
        <b-dropdown-item separator></b-dropdown-item>
        <b-dropdown-item :value="1">1</b-dropdown-item>
        <b-dropdown-item :value="2">2</b-dropdown-item>
        <b-dropdown-item :value="3">3</b-dropdown-item>
        <b-dropdown-item :value="4">4</b-dropdown-item>
        <b-dropdown-item :value="5">5</b-dropdown-item>
        <b-dropdown-item :value="6">6</b-dropdown-item>
      </b-dropdown>
    </p>
    <b-autocomplete
      placeholder="Search a theme"
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
        <span
          >Found:
          <span class="has-text-weight-semibold">{{ themes.length }}</span>
          theme(s)</span
        >
      </template>

      <template slot-scope="props">
        <div class="is-flex is-justify-content-space-between">
          <div>
            <b-icon icon="file" /> {{ $t(props.option.loc, { digit }) }}
          </div>
          <div class="has-text-weight-semibold">
            <b-tag type="is-primary is-light">
              {{ props.option.metadata.operation | toOperation }}
            </b-tag>
          </div>
        </div>
      </template>

      <template #empty>No results found</template>
    </b-autocomplete>
  </b-field>
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

