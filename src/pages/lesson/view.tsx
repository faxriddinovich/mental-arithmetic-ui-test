import * as React from "react";
import "focus-visible/dist/focus-visible";
import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
  Text,
  Textarea,
} from "@chakra-ui/react";
import {
  IconClock,
  IconDots,
  IconFile,
  IconMessageCircle,
  IconPencil,
  IconRuler2,
} from "@tabler/icons";
import { LessonCard } from "components/lesson/card";
import { Comment } from "components/lesson/comment";
import { Task } from "components/lesson/task";

export const ViewLessonPage = () => {
  return (
    <Container maxW="container.xl" mt={5}>
      <Grid gap={4} templateColumns={{ base: "1fr", lg: "2fr 1fr" }}>
        <GridItem>
          <Tabs isFitted variant="unstyled" isLazy>
            <Stack spacing={4}>
              <Box
                bg="white"
                border="1px"
                borderColor="gray.300"
                rounded="md"
                boxShadow="sm"
                p={4}
              >
                <TabList>
                  <Tab
                    _selected={{
                      color: "white",
                      bg: "gray.500",
                      borderRadius: 5,
                    }}
                  >
                    <IconFile />{" "}
                    <Text
                      d={{ base: "none", sm: "none", xl: "block" }}
                      isTruncated
                    >
                      Endianness
                    </Text>
                  </Tab>
                  <Tab
                    _selected={{
                      color: "white",
                      bg: "gray.500",
                      borderRadius: 5,
                    }}
                  >
                    <IconMessageCircle />{" "}
                    <Text d={{ base: "none", sm: "none", xl: "block" }}>
                      Comments:
                    </Text>
                    &nbsp;<b>2</b>
                  </Tab>
                  <Tab
                    _selected={{
                      color: "white",
                      bg: "gray.500",
                      borderRadius: 5,
                    }}
                  >
                    <IconRuler2 />{" "}
                    <Text d={{ base: "none", sm: "none", xl: "block" }}>
                      Tasks:
                    </Text>
                    &nbsp;<b>6</b>
                  </Tab>
                </TabList>
              </Box>
              <TabPanels>
                <TabPanel p={0}>
                  <Box
                    bg="white"
                    border="1px"
                    borderColor="gray.300"
                    rounded="md"
                    boxShadow="sm"
                    p={4}
                  >
                    <Stack spacing={3}>
                      <Heading size="lg">#1 Endianness</Heading>
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
                        Internally, any given computer will work equally well
                        regardless of what endianness it uses since its hardware
                        will consistently use the same endianness to both store
                        and load its data. For this reason, programmers and
                        computer users normally ignore the endianness of the
                        computer they are working with. However, endianness can
                        become an issue when moving data external to the
                        computer – as when transmitting data between different
                        computers, or a programmer investigating internal
                        computer bytes of data from a memory dump – and the
                        endianness used differs from expectation. In these
                        cases, the endianness of the data must be understood and
                        accounted for. Bi-endianness is a feature supported by
                        numerous computer architectures that feature switchable
                        endianness in data fetches and stores or for instruction
                        fetches.
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
                </TabPanel>
                <TabPanel p={0}>
                  <Box
                    bg="white"
                    border="1px"
                    borderColor="gray.300"
                    rounded="md"
                    boxShadow="sm"
                    p="4"
                  >
                    <Stack spacing={4} pb={4}>
                      <Box>
                        <Stack spacing={4}>
                          <Textarea
                            placeholder="Here is a sample placeholder"
                            size="md"
                          />
                          <Flex>
                            <Spacer />
                            <Button
                              leftIcon={<IconPencil />}
                              size="sm"
                              colorScheme="green"
                              variant="solid"
                            >
                              Leave a comment
                            </Button>
                          </Flex>
                        </Stack>
                      </Box>
                      <Comment isAdmin={true} username="Michelle (Shelley)" />
                      <Divider />
                      <Comment username="Rachel Stone" />
                    </Stack>
                  </Box>
                </TabPanel>
                <TabPanel p={0}>
                  <Stack>
                    <Task
                      img="https://image.flaticon.com/icons/png/512/1156/1156977.png"
                      isDone
                    />
                    <Task
                      img="https://image.flaticon.com/icons/png/512/1519/1519458.png"
                      isDone
                      theme="Katta o'rtoqlar -2"
                    />
                    <Task
                      img="https://image.flaticon.com/icons/png/512/1519/1519458.png"
                      isDone
                      theme="Some theme"
                    />
                    <Task
                      img="https://image.flaticon.com/icons/png/512/1994/1994825.png"
                      theme="Some theme"
                    />
                    <Task
                      img="https://image.flaticon.com/icons/png/512/867/867454.png"
                      theme="Some theme"
                    />
                    <Task img="https://image.flaticon.com/icons/png/512/1046/1046277.png" />
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Stack>
          </Tabs>
        </GridItem>
        <GridItem>
          <Stack spacing={4}>
            <LessonCard title="#1 How does memory work" />
            <LessonCard title="#2 How does everything work" />
            <LessonCard title="#3 How does a work" isNew={true} />
            <LessonCard title="#4 How does b work" isNew={true} />
            <LinkBox
              bg="white"
              border="1px"
              borderColor="gray.300"
              rounded="md"
              boxShadow="sm"
              p="2"
              _hover={{ background: "blue.50" }}
            >
              <Center>
                <LinkOverlay href="#">
                  <IconDots />
                </LinkOverlay>
              </Center>
            </LinkBox>
          </Stack>
        </GridItem>
      </Grid>
    </Container>
  );
};
