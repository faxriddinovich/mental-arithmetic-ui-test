import {
  Spacer,
  Flex,
  Button,
  FormLabel,
  Input,
  FormControl,
  InputGroup,
  InputLeftElement,
  Box,
  Stack,
} from "@chakra-ui/react";
import { IconDeviceFloppy, IconMailbox, IconUser } from "@tabler/icons";
export const UserEdit = () => {
  return (
    <Box bg="white" border="1px" borderColor="gray.300" rounded="md" p={3}>
      <Stack>
        <FormControl id="username">
          <FormLabel>Username</FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<IconUser color="gray" size={21} />}
            />
            <Input type="text" value="Ciaran Sheridan" />
          </InputGroup>
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<IconMailbox color="gray" size={21} />}
            />
            <Input type="mail" value="myemail@example.com" />
          </InputGroup>
        </FormControl>
        <Flex>
          <Spacer />
          <Button
            colorScheme="purple"
            size="sm"
            leftIcon={<IconDeviceFloppy size={20} />}
            borderColor="purple.600"
            borderWidth="2px"
          >
            Save
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};
