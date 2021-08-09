import {
  Avatar,
  Badge,
  Box,
  Divider,
  Flex,
  Link,
  Spacer,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import { IconRuler2, IconMessageCircle } from "@tabler/icons";
export const Card = ({ title, isNew }) => {
  return (
    <Box
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
      <Link
        mt={1}
        display="block"
        fontSize="lg"
        lineHeight="normal"
        fontWeight="semibold"
        href="#"
      >
        {title}{" "}
        {isNew ? (
          <Badge variant="solid" colorScheme="green">
            New
          </Badge>
        ) : (
          ""
        )}
      </Link>
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
    </Box>
  );
};
