import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tag,
  Spacer,
  Flex,
  Box,
  Image,
} from "@chakra-ui/react";
import {
  IconArrowNarrowRight,
  IconRotate2,
  IconBoxMultiple1,
  IconListNumbers,
  IconClock,
  IconFileText,
} from "@tabler/icons";

export const Task = ({ isDone = false, theme, img }) => {
  return (
    <Box
      bg={isDone ? "white" : "orange.50"}
      border="1px"
      borderColor="gray.300"
      rounded="md"
      boxShadow="sm"
      p="4"
    >
      <Flex align="center" direction={{ base: "column", lg: "row" }}>
        <Box mb={{ base: 4, lg: 0 }}>
          <Image src={img} w="40px" />
        </Box>
        <Box mb={{ base: 4, lg: 0 }}>
          <Breadcrumb size="sm" separator="•" spacing={null}>
            <BreadcrumbItem>
              <Tag fontSize="sm" variant="outline" shadow={0}>
                <IconFileText />
                &nbsp;<b>{theme || "Yosh o'rtoqlar +4"}</b>
              </Tag>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Tag fontSize="sm" variant="outline" shadow={0}>
                <IconClock />
                &nbsp;<b>0.1 sec</b>
              </Tag>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Tag fontSize="sm" variant="outline" shadow={0}>
                <IconRotate2 />
                &nbsp;<b>1 sec</b>
              </Tag>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Tag fontSize="sm" variant="outline" shadow={0}>
                <IconListNumbers />
                &nbsp;<b>5</b>
              </Tag>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Tag fontSize="sm" variant="outline" shadow={0}>
                <IconBoxMultiple1 />
                &nbsp;<b>20</b>
              </Tag>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
        <Spacer />
        <Button
          width={{ base: "100%", lg: "auto" }}
          size="sm"
          borderColor="gray.500"
          rightIcon={<IconArrowNarrowRight />}
          variant="outline"
        >
          Perform
        </Button>
      </Flex>
    </Box>
  );
};
