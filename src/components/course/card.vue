<template>
  <c-box
    bg="white"
    border-width="3px"
    border-color="gray.300"
    rounded="lg"
    box-shadow="md"
    overflow="hidden"
  >
    <c-image
      src="https://thumbs-prod.si-cdn.com/s-jZTk0XtVmp-89MlOgFXqaAVe4=/fit-in/1600x0/https://public-media.si-cdn.com/filer/29/0f/290fb8c0-1872-46e5-8c12-235742905def/science_smithsonian_magazine_booklist_2019.png"
    />
    <c-box p="4">
      <c-stack spacing="4">
        <c-heading size="md">Data science courses</c-heading>
        <c-box>
          Data science is an interdisciplinary field focused on extracting
          knowledge from data sets, which are typically...
        </c-box>
        <c-flex justify-content="space-between">
          <c-tag variant="outline"
            ><unicon
              name="clipboard-notes"
              fill="gray"
              width="20"
              height="20"
            />&nbsp;23</c-tag
          >
          <c-tag variant="outline"
            ><unicon
              name="ruler"
              fill="gray"
              width="20"
              height="20"
            />&nbsp;10</c-tag
          >
          <c-tag variant="outline"
            ><unicon
              name="user"
              fill="gray"
              width="20"
              height="20"
            />&nbsp;10</c-tag
          >
        </c-flex>
      </c-stack>
      <c-divider />
      <c-flex align-items="center" justify-content="space-between" mb="-1">
        <c-tag variant-color="pink" rounded="full">
          <c-avatar
            src="https://bit.ly/sage-adebayo"
            size="xs"
            name="Segun Adebayo"
            border="none"
            :ml="-2"
            :mr="2"
          />
          <c-tag-label>Satoshi Nakamoto</c-tag-label>
        </c-tag>
        <c-text as="b" font-size="lg">23 000</c-text>
      </c-flex>
    </c-box>
  </c-box>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  CBox,
  CImage,
  CStack,
  CHeading,
  CFlex,
  CTag,
  CDivider,
  CAvatar,
  CText,
  CTagLabel
} from "@chakra-ui/vue";

@Component({
  components: { CBox, CImage, CStack, CHeading, CFlex, CTag, CDivider, CAvatar, CText, CTagLabel },
})
export default class CourseCard extends Vue {}
</script>
