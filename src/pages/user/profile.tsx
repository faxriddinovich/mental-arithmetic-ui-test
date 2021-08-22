import {
  Divider,
  Grid,
  GridItem,
  Stat,
  StatNumber,
  StatLabel,
  Spacer,
  Text,
  Avatar,
  Container,
  Flex,
  Box,
  Stack,
} from "@chakra-ui/react";
import {
  IconChartDots,
  IconChevronRight,
  IconPencil,
  IconUsers,
  IconCertificate,
  IconSettings,
  IconUserExclamation,
} from "@tabler/icons";
import { Link, Switch, Route, useRouteMatch } from "react-router-dom";
import { UserScores } from "pages/user/scores";
import { UserSessions } from "pages/user/sessions";
import { UserSubscription } from "pages/user/subscription";
import { UserEdit } from "pages/user/edit";

import { PlatformSettingsPage } from "pages/user/control-panel/platform-settings";
import { UsersPage } from "pages/user/control-panel/users";
import { UserPage } from "pages/user/control-panel/user";

export const UserProfilePage = () => {
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
                <StatNumber>110 999</StatNumber>
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
                  <IconSettings style={{ display: "inline-block" }} />{" "}
                  <Box ml={2}>
                    <Link to={`${url}/control-panel/platform-settings`}>
                      Platform settings
                    </Link>
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
                  <IconUserExclamation style={{ display: "inline-block" }} />{" "}
                  <Box ml={2}>
                    <Link to={`${url}/control-panel/users`}>Users</Link>
                  </Box>
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
            <Route path={`${path}/control-panel/platform-settings`}>
              <PlatformSettingsPage />
            </Route>
            <Route path={`${path}/control-panel/users/:id`}>
              <UserPage />
            </Route>
            <Route path={`${path}/control-panel/users`}>
              <UsersPage />
            </Route>
          </Switch>
        </GridItem>
      </Grid>
    </Container>
  );
};
