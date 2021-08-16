import {
  Center,
  Stat,
  StatHelpText,
  StatNumber,
  Spacer,
  Badge,
  Text,
  Avatar,
  Container,
  Flex,
  Box,
  Stack,
} from "@chakra-ui/react";
import { IconMail, IconHash } from "@tabler/icons";

export const UserAccount = () => {
  return (
    <Container maxW="container.sm">
      <Flex direction="column" justifyContent="center" height="100vh">
        <Stack spacing={4}>
          <Box
            bg="white"
            border="1px"
            borderColor="gray.300"
            rounded="md"
            boxShadow="md"
            mt={4}
            p={4}
          >
            <Flex align="center">
              <Box>
                <Flex>
                  <Stack>
                    <Avatar name="S N" size="lg" />
                    <Box>
                      <Center>
                        <Badge variant="outline" colorScheme="purple">
                          ADMIN
                        </Badge>
                      </Center>
                    </Box>
                  </Stack>
                  <Spacer />
                  <Box ml={4}>
                    <Stack spacing={0.9}>
                      <Text fontSize="lg" fontWeight="bold">
                        milkcamelantrunning
                      </Text>
                      <Text>
                        <IconMail
                          style={{ display: "inline-block" }}
                          size={20}
                        />
                        &nbsp;milkcamelant@yahoo.com
                      </Text>
                      <Text>
                        <IconHash
                          style={{ display: "inline-block" }}
                          size={20}
                        />
                        23442
                      </Text>
                    </Stack>
                  </Box>
                </Flex>
              </Box>
              <Spacer />
              <Box>
                <Stat>
                  <StatNumber>128 000</StatNumber>
                  <StatHelpText>uzs</StatHelpText>
                </Stat>
              </Box>
            </Flex>
          </Box>
          <Box
            bg="white"
            border="1px"
            borderColor="gray.300"
            rounded="md"
            boxShadow="md"
            mt={4}
            p={4}
          ></Box>
        </Stack>
      </Flex>
    </Container>
  );
};
