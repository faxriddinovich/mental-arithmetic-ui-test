import {
  Divider,
  Heading,
  Grid,
  GridItem,
  Center,
  Stat,
  StatHelpText,
  StatNumber,
  StatLabel,
  Spacer,
  Badge,
  Text,
  Avatar,
  Container,
  Flex,
  Box,
  Stack,
} from "@chakra-ui/react";
import {
  IconMail,
  IconHash,
  IconChartDots,
  IconChevronRight,
  IconPencil,
  IconNotes,
  IconUsers,
  IconCertificate,
} from "@tabler/icons";
import { UserScores } from "pages/user/scores";
import { UserSessions } from "pages/user/sessions";
import { UserSubscription } from "pages/user/subscription";
import { UserEdit } from "pages/user/edit";
import { Link, Switch, Route, useRouteMatch } from "react-router-dom";

export const UserPage = () => {
  const { path, url } = useRouteMatch();
  return (
    <Container maxW="container.lg">
      <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={4} mt={4}>
        <GridItem>
          <Stack>
            <Box
              bg="white"
              border="1px"
              borderColor="gray.300"
              rounded="md"
              p={3}
            >
              <Flex direction="column" alignItems="center">
                <Avatar name="Ciaran Sheridan." size="2xl" />
                <Text mt={2} fontWeight="bold" fontSize={20}>
                  Ciaran Sheridan
                </Text>
                <Text>myemail@example.com</Text>
              </Flex>
            </Box>
            <Box
              bg="white"
              border="1px"
              borderColor="gray.300"
              rounded="md"
              p={2}
            >
              <Stat textAlign="center">
                <StatLabel>Balance</StatLabel>
                <StatNumber>22 000</StatNumber>
              </Stat>
            </Box>
            <Box
              bg="white"
              border="1px"
              borderColor="gray.300"
              rounded="md"
              p={2}
            >
              <Box px={1} py={2} _hover={{ backgroundColor: "gray.50" }}>
                <Flex align="center">
                  <IconChartDots style={{ display: "inline-block" }} />{" "}
                  <Box ml={2}>
                    <Link to={url}>Scores</Link>
                  </Box>
                  <Spacer />
                  <Box>
                    <IconChevronRight />
                  </Box>
                </Flex>
              </Box>
              <Divider />
              <Box px={1} py={2} _hover={{ backgroundColor: "gray.50" }}>
                <Flex align="center">
                  <IconUsers style={{ display: "inline-block" }} />{" "}
                  <Box ml={2}>
                    <Link to={`${url}/sessions`}>Sessions</Link>
                  </Box>
                  <Spacer />
                  <Box>
                    <IconChevronRight />
                  </Box>
                </Flex>
              </Box>
              <Divider />
              <Box px={1} py={2} _hover={{ backgroundColor: "gray.50" }}>
                <Flex align="center">
                  <IconCertificate style={{ display: "inline-block" }} />{" "}
                  <Box ml={2}>
                    <Link to={`${url}/subscription`}>Subscription</Link>
                  </Box>
                  <Spacer />
                  <Box>
                    <IconChevronRight />
                  </Box>
                </Flex>
              </Box>
              <Divider />
              <Box px={1} py={2} _hover={{ backgroundColor: "gray.50" }}>
                <Flex align="center">
                  <IconPencil style={{ display: "inline-block" }} />{" "}
                  <Box ml={2}>
                    <Link to={`${url}/edit`}>Edit account</Link>
                  </Box>
                  <Spacer />
                  <Box>
                    <IconChevronRight />
                  </Box>
                </Flex>
              </Box>
              <Divider />
              <Box px={1} py={2} _hover={{ backgroundColor: "gray.50" }}>
                <Flex align="center">
                  <IconNotes style={{ display: "inline-block" }} />{" "}
                  <Box ml={2}>Purchased courses</Box>
                  <Spacer />
                  <Box>
                    <IconChevronRight />
                  </Box>
                </Flex>
              </Box>
            </Box>
          </Stack>
        </GridItem>
        <GridItem minWidth={0}>
          <Switch>
            <Route exact path={`${path}`}>
              <UserScores />
            </Route>
            <Route path={`${path}/sessions`}>
              <UserSessions />
            </Route>
            <Route path={`${path}/subscription`}>
              <UserSubscription />
            </Route>
            <Route path={`${path}/edit`}>
              <UserEdit />
            </Route>
          </Switch>
        </GridItem>
      </Grid>
    </Container>
  );
};
