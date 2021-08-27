<template>
  <c-box
    bg="white"
    rounded="lg"
    shadow="md"
    p="3"
    cursor="pointer"
    border-width="1px"
    :_hover="{ borderColor: 'gray.200' }"
    :_active="{ boxShadow: 'inner' }"
  >
    <c-stack align-items="center">
      <unicon :name="icon" width="50" height="50" fill="#9b59b6" />
      <c-text font-size="15px">{{ title }}</c-text>
    </c-stack>
  </c-box>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { CBox, CStack, CText } from "@chakra-ui/vue";

@Component({
  components: {
    CBox,
    CStack,
    CText,
  },
})
export default class MenuItem extends Vue {
  @Prop(String) public title!: string;
  @Prop(String) public icon!: string;
}
</script>
