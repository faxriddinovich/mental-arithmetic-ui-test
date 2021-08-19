import {
  Stack,
  Button,
  Spacer,
  Text,
  Avatar,
  Flex,
  Divider,
  Box,
} from "@chakra-ui/react";
import { IconTrash, IconPlus, IconLogin } from "@tabler/icons";

export const UserSessions = () => {
  return (
    <Box bg="white" border="1px" borderColor="gray.300" rounded="md" p={4}>
      <Stack>
        <Flex mb={4}>
          <Button
            colorScheme="yellow"
            leftIcon={<IconTrash size={20} />}
            size="sm"
          >
            Delete all except this
          </Button>
          <Spacer />
          <Button
            colorScheme="green"
            leftIcon={<IconPlus size={20} />}
            size="sm"
          >
            Add
          </Button>
        </Flex>
        <Flex align="center" mb={1}>
          <Avatar name="Ciaran Sheridan." size="md" />
          <Box ml={3}>
            <Text fontSize="lg">
              <b>Ciaran Sheridan</b>
            </Text>
            <Text fontSize="sm">2021-06-06 23:33</Text>
          </Box>
          <Spacer />
        </Flex>
        <Divider />
        <Flex align="center" mb={1}>
          <Avatar name="Ashley Wise." size="md" />
          <Box ml={3}>
            <Text fontSize="lg">
              <b>Ashley Wise</b>
            </Text>
            <Text fontSize="sm">2021-05-06 03:13</Text>
          </Box>
          <Spacer />
          <Button leftIcon={<IconLogin size={20} />} size="sm">
            Enter
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};
