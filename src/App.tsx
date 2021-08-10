import * as React from "react";
import "focus-visible/dist/focus-visible";
import {
  ChakraProvider,
  Container,
  Grid,
  GridItem,
  Box,
  Center,
  Stack,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Text,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import {
  IconDots,
  IconFile,
  IconMessageCircle,
  IconRuler2,
} from "@tabler/icons";
import { theme } from "./theme";
import { Card } from "./Card.tsx";
import { BigCard } from "./BigCard.tsx";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
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
                      &nbsp;<b>23</b>
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
                      &nbsp;<b>1</b>
                    </Tab>
                  </TabList>
                </Box>
                <TabPanels>
                  <TabPanel p={0}>
                    <BigCard />
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
                      test
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
                      Tasks ...
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Stack>
            </Tabs>
          </GridItem>
          <GridItem>
            <Stack spacing={4}>
              <Card title="#1 How does memory work" />
              <Card title="#2 How does everything work" />
              <Card title="#3 How does a work" isNew={true} />
              <Card title="#4 How does b work" isNew={true} />
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
    </ChakraProvider>
  );
};
