<template>
  <b-field>
    <template #label>
      <b-icon icon="file"/>
      {{ $t("theme") }}
    </template>
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

      <template v-slot="props">
        <div class="is-flex is-justify-content-space-between">
          <div>
            <b-icon icon="file"/>
            {{ $t(props.option.loc, {digit}) }}
          </div>
          <div class="has-text-weight-semibold">
            <b-tag type="is-primary">
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
import {computed, defineComponent, ref, watch} from "@vue/composition-api";
import {Theme} from "@mental-arithmetic/themes";
import {getThemes} from "@/services/generator";

const lowerCase = (str: string) => str.toLowerCase();
const matches = (str0: string, str1: string) => {
  return lowerCase(str0).indexOf(lowerCase(str1)) >= 0;
};

export default defineComponent({
  props: {
    digit: {type: Number, required: true},
  },
  setup(props, context) {
    const themesInputFocus = ref<boolean>(false);
    const theme = ref<string>("");

    const themes = computed(() => {
      return getThemes().filter((item) => {
        const {loc} = item;
        if (item.metadata) {
          const shouldBeExcluded = item.metadata.excludeDigits?.includes(props.digit);
          if (shouldBeExcluded) return false;
        } else return false;

        const message = context.root.$t(loc, {digit: props.digit}) as string;
        return matches(message, theme.value);


      });
    });

    const pickTheme = (value: Theme) => {
      context.emit("input", value);
    };

    watch(
        () => props.digit,
        () => (theme.value = "")
    );

    function setTheme(_theme: Theme) {
      theme.value = context.root.$i18n.t(_theme.loc, {
        digit: props.digit,
      }) as string;
      context.emit('input', _theme);
    }

    return {
      theme,
      themes,
      setTheme,
      pickTheme,
      themesInputFocus,
    };
  },
});
</script>

