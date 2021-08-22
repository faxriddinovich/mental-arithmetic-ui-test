import {
  Box,
  Stack,
  Button,
  Spacer,
  Text,
  Avatar,
  Flex,
  Input,
} from "@chakra-ui/react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { IconSearch, IconPencil } from "@tabler/icons";

export const UsersPage = () => {
  const history = useHistory();
  const { url } = useRouteMatch();

  return (
    <Stack>
      <Box bg="white" border="1px" borderColor="gray.300" rounded="md" p={3}>
        <Flex>
          <Input
            variant="outline"
            placeholder="Username, email or id"
            bg="gray.200"
          />
          <Button leftIcon={<IconSearch size={18} />} px={6} ml={4}>
            Search
          </Button>
        </Flex>
      </Box>

      <Box bg="white" border="1px" borderColor="gray.300" rounded="md" p={3}>
        <Stack>
          <Flex align="center" mb={1}>
            <Avatar name="Ciaran Sheridan." size="md" />
            <Box ml={3}>
              <Text fontSize="lg">
                <b>Ciaran Sheridan</b>
              </Text>
              <Text fontSize="sm">mysuperemail@example.com</Text>
            </Box>
            <Spacer />
            <Box>
              <Button
                leftIcon={<IconPencil size={20} />}
                variant="outline"
                size="sm"
                onClick={() => history.push(url + "/user")}
              >
                Edit
              </Button>
            </Box>
          </Flex>
        </Stack>
      </Box>
    </Stack>
  );
};
