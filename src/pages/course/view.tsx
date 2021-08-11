import { Component } from "react";
import {
  Image,
  Container,
  Box,
  Stack,
  Grid,
  GridItem,
  Flex,
  Heading,
  Divider,
  Button,
  Stat,
  StatNumber,
  StatLabel,
  StatGroup,
  Input,
  Tag,
  Avatar,
  TagLabel,
  Collapse,
} from "@chakra-ui/react";
import { IconCheck, IconShoppingCart, IconSearch } from "@tabler/icons";
import { LessonCard } from "components/lesson/card";

interface State {
  isOpen: boolean;
}

export class ViewCoursePage extends Component<{}, State> {
  public state = { isOpen: false };

  public render() {
    return (
      <Container maxW="container.xl" mt={5}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 2fr" }} gap={4}>
          <GridItem>
            <Box
              bg="white"
              border="1px"
              borderColor="gray.300"
              rounded="md"
              boxShadow="sm"
              overflow="hidden"
            >
              <Image src="https://thumbs-prod.si-cdn.com/s-jZTk0XtVmp-89MlOgFXqaAVe4=/fit-in/1600x0/https://public-media.si-cdn.com/filer/29/0f/290fb8c0-1872-46e5-8c12-235742905def/science_smithsonian_magazine_booklist_2019.png" />
              <Box p={4}>
                <Stack spacing={3}>
                  <Heading size="md">Data & science course</Heading>
                  <Box>
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
                  </Box>
                  <Box>
                    Data science is an interdisciplinary field focused on
                    extracting knowledge from data sets, which are typically
                    large (see big data), and applying the knowledge and
                    actionable insights from data to solve problems in a wide
                    range of application domains.
                  </Box>
                  <Box>
                    <StatGroup>
                      <Stat>
                        <StatLabel>Lessons</StatLabel>
                        <StatNumber>5</StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel>Users</StatLabel>
                        <StatNumber>128</StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel>Tasks</StatLabel>
                        <StatNumber>20</StatNumber>
                      </Stat>
                    </StatGroup>
                  </Box>
                  <Divider />
                  <Button
                    bg="green.400"
                    color="white"
                    leftIcon={<IconShoppingCart size={18} />}
                    _hover={{ background: "green.500" }}
                    _active={{ background: "green.600" }}
                  >
                    <b>23 000 sum</b>
                  </Button>
                  <Button
                    onClick={() =>
                      this.setState({ isOpen: !this.state.isOpen })
                    }
                  >
                    I have an activation code
                  </Button>
                  <Collapse in={this.state.isOpen}>
                    <Flex>
                      <Input
                        placeholder="Enter the activation code"
                        size="sm"
                      />
                      <Button
                        leftIcon={<IconCheck size={15} />}
                        size="sm"
                        ml={4}
                        px={6}
                      >
                        Activate
                      </Button>
                    </Flex>
                  </Collapse>
                </Stack>
              </Box>
            </Box>
          </GridItem>
          <GridItem>
            <Stack spacing={4}>
              <Box
                p={3}
                bg="white"
                border="1px"
                borderColor="gray.300"
                rounded="md"
                boxShadow="sm"
                overflow="hidden"
              >
                <Flex>
                  <Input
                    variant="outline"
                    placeholder="Lesson's name, tags, author's name..."
                    bg="gray.200"
                  />
                  <Button leftIcon={<IconSearch size={18} />} px={6} ml={4}>
                    Search
                  </Button>
                </Flex>
              </Box>
              <Grid
                templateColumns={{
                  base: "1fr",
                  lg: "1fr 1fr",
                }}
                gap={4}
              >
                <GridItem>
                  <LessonCard title="#5 Lesson's name" isNew />
                </GridItem>
                <GridItem>
                  <LessonCard title="#4 Lesson's name" isNew />
                </GridItem>
                <GridItem>
                  <LessonCard title="#3 Lesson's name" />
                </GridItem>
                <GridItem>
                  <LessonCard title="#2 Lesson's name" />
                </GridItem>
                <GridItem>
                  <LessonCard title="#1 Lesson's name" />
                </GridItem>
              </Grid>
            </Stack>
          </GridItem>
        </Grid>
      </Container>
    );
  }
}
