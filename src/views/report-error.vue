<template>
  <c-box w="100%" mx="auto" maxW="70ch" px="1rem">
    <c-flex align-items="center" height="100vh">
      <c-box
        bg="white"
        border-width="2px"
        rounded="md"
        box-shadow="lg"
        border-style="dashed"
        border-color="gray.300"
        p="4"
        width="100%"
      >
        <c-flex direction="column" align-items="center">
          <c-image
            src="https://image.flaticon.com/icons/png/512/1182/1182679.png"
            size="100"
          />
          <c-heading size="md" mt="3"
            ><code>Something went wrong!</code></c-heading
          >
          <c-text>Please do not panic and contact the administrators</c-text>
          <c-code width="100%" height="100px" mt="4" overflow-y="scroll">
            <b>- {{ runtimeError.message }}</b>
            <br />
            {{ runtimeError.stack }}
          </c-code>
          <c-button mt="5" width="100%" @click="goBack()">
            <unicon name="history-alt" width="20" />&nbsp;&nbsp;Go back
          </c-button>
        </c-flex>
      </c-box>
    </c-flex>
  </c-box>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  CBox,
  CFlex,
  CCode,
  CImage,
  CText,
  CHeading,
  CButton,
} from "@chakra-ui/vue";

@Component({
  components: {
    CBox,
    CFlex,
    CImage,
    CText,
    CHeading,
    CButton,
    CCode,
  },
})
export default class RuntimeError extends Vue {
  public goBack() {
    this.$store.commit('freeRuntimeError');
    this.$router.back();
  }

  get runtimeError() {
    console.log(this.$store.state.runtimeError);
    return this.$store.state.runtimeError;
  }
}
</script>
