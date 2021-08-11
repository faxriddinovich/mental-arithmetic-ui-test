import { Component } from "react";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Flex,
  Spacer,
  Tag,
  TagLabel,
  Text,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { IconRuler2, IconMessageCircle } from "@tabler/icons";
interface Props {
  title?: string;
  isNew?: boolean;
}

export class LessonCard extends Component<Props> {
  public render() {
    return (
      <LinkBox
        bg="white"
        border="1px"
        borderColor="gray.300"
        rounded="md"
        boxShadow="sm"
        p="4"
        _hover={{
          background: "gray.50",
        }}
      >
        <LinkOverlay
          mt={1}
          display="block"
          fontSize="lg"
          lineHeight="normal"
          fontWeight="semibold"
          href="#"
        >
          {this.props.title}{" "}
          {this.props.isNew ? (
            <Badge variant="solid" colorScheme="green">
              New
            </Badge>
          ) : (
            ""
          )}
        </LinkOverlay>
        <Text mt={2} color="gray.500" mb={3}>
          Getting a new business off the ground is a lot of hard work.
        </Text>
        <Divider orientation="horizontal" />

        <Flex align="center" mt={3}>
          <Box>
            <Tag size="lg" borderRadius="full" bg="purple.100">
              <Avatar
                src="https://bit.ly/sage-adebayo"
                size="xs"
                name="Kennedy Yang"
                ml={-2}
                mr={2}
              />
              <TagLabel as="b">Kennedy Yang</TagLabel>
            </Tag>
          </Box>

          <Spacer />
          <Box>
            <Tag variant="outline" shadow={0}>
              <IconMessageCircle />
              &nbsp;<b>34</b>&nbsp;&nbsp;
              <IconRuler2 />
              &nbsp;<b>5</b>
            </Tag>
          </Box>
        </Flex>
      </LinkBox>
    );
  }
}
