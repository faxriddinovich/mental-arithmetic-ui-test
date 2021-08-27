<template>
  <c-box w="100%" mx="auto" maxW="120ch" px="1rem">
    <c-box mt="4">
      <!--
        <c-box>
          <c-box
            variant="left-accent"
            bg="gray.100"
            border-style="dashed"
            border-color="gray.300"
            border-width="3px"
            p="3"
            position="relative"
          >
            <c-box> Some news! </c-box>
            <c-close-button position="absolute" right="8px" top="8px" />
          </c-box>
          -->
      <c-grid template-columns="repeat(6, 1fr)" column-gap="20px" mt="4">
        <c-grid-item>
          <menu-item title="Abacus" icon="abacus" />
        </c-grid-item>
        <c-grid-item>
          <menu-item title="Flash card" icon="square-shape" />
        </c-grid-item>
        <c-grid-item>
          <menu-item title="Table" icon="window-section" />
        </c-grid-item>
        <c-grid-item>
          <menu-item title="Scores" icon="chart-line" />
        </c-grid-item>
        <c-grid-item>
          <menu-item title="Settings" icon="setting" />
        </c-grid-item>
      </c-grid>
    </c-box>
    <c-box> </c-box>
    <c-stack mt="4">
      <c-box bg="white" p="3" border-width="2px" rounded="md">
        <c-flex align-items="center" justify-content="space-between">
          <c-text font-size="20px" vertical-align="baseline">
            <unicon
              name="layer-group"
              fill="purple"
              icon-style="monochrome"
              width="25"
              height="25"
            />
            <span>Mental arithmetic courses:</span>
          </c-text>
          <c-box>
            <c-button size="sm" variant-color="indigo" variant="outline">
              See all&nbsp; <b>23</b>
              <unicon name="angle-right" width="20" height="20" />
            </c-button>
          </c-box>
        </c-flex>
      </c-box>
    </c-stack>
    <c-grid template-columns="repeat(3, 1fr)" column-gap="20px" mt="4">
      <course-card />
      <course-card />
      <course-card />
    </c-grid>
  </c-box>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import {
  CFlex,
  CBox,
  CGrid,
  CGridItem,
  CStack,
  CText,
  CAlert,
  CAlertDescription,
  CAlertTitle,
  CCloseButton,
  CButton,
} from "@chakra-ui/vue";
import MenuItem from "@/components/menu-item.vue";
import CourseCard from "@/components/course/card.vue";

@Component({
  components: {
    CFlex,
    CBox,
    CGrid,
    CGridItem,
    CStack,
    CText,
    CAlert,
    CAlertDescription,
    CAlertTitle,
    CCloseButton,
    CButton,
    MenuItem,
    CourseCard,
  },
})
export default class Home extends Vue {}
</script>
