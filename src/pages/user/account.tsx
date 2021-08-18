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

export const UserAccount = () => {
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
                  <Box ml={2}>Scores</Box>
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
                  <Box ml={2}>Sessions</Box>
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
                  <Box ml={2}>Subscription</Box>
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
                  <Box ml={2}>Edit account</Box>
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
          <Box>
            <UserScores />
          </Box>
        </GridItem>
      </Grid>
    </Container>
  );
};
