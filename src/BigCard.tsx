import {
  Box,
  Heading,
  Divider,
  Avatar,
  Tag,
  TagLabel,
  HStack,
  Image,
  Stack,
  Flex,
  Spacer,
} from "@chakra-ui/react";

import { IconClock } from "@tabler/icons";

export const BigCard = () => {
  return (
    <Box
      bg="white"
      border="1px"
      borderColor="gray.300"
      rounded="md"
      boxShadow="sm"
      p={4}
    >
      <Stack spacing={3}>
        <Heading size="lg">
          #1 Endianness
        </Heading>
        <Box>
          <Flex align="center">
            <Tag size="lg" borderRadius="full" bg="blue.100">
              <Avatar
                src="https://bit.ly/sage-adebayo"
                size="xs"
                name="Satoshi nakomoto"
                ml={-2}
                mr={2}
              />
              <TagLabel as="b">Satoshi Nakamoto</TagLabel>
            </Tag>
            <Spacer />
            <Tag variant="outline" shadow={0}>
              <IconClock size={20} />
              &nbsp;
              <b>2021-04-04 16:34</b>
            </Tag>
          </Flex>
        </Box>
        <Box>
          Internally, any given computer will work equally well regardless of
          what endianness it uses since its hardware will consistently use the
          same endianness to both store and load its data. For this reason,
          programmers and computer users normally ignore the endianness of the
          computer they are working with. However, endianness can become an
          issue when moving data external to the computer – as when transmitting
          data between different computers, or a programmer investigating
          internal computer bytes of data from a memory dump – and the
          endianness used differs from expectation. In these cases, the
          endianness of the data must be understood and accounted for.
          Bi-endianness is a feature supported by numerous computer
          architectures that feature switchable endianness in data fetches and
          stores or for instruction fetches.
          <Image src="https://pythontic.com/BigEndian-LittleEndian.png" />
        </Box>
        <Divider />
        <Box>
          <HStack wrap="wrap">
            <Tag>Only for childs</Tag>
            <Tag>Tag name</Tag>
            <Tag>Sample tag</Tag>
          </HStack>
        </Box>
      </Stack>
    </Box>
  );
};
