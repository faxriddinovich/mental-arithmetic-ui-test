import {
  Switch,
  Radio,
  RadioGroup,
  HStack,
  FormControl,
  FormLabel,
  Spacer,
  Stack,
  Input,
  Box,
  Flex,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { IconUser, IconMail, IconDeviceFloppy } from "@tabler/icons";

export const UserPage = () => {
  return (
    <Stack>
      <Box bg="white" border="1px" borderColor="gray.300" rounded="md" p={3}>
        <Stack>
          <FormControl id="username">
            <FormLabel>Username:</FormLabel>
            <InputGroup>
              <InputLeftElement children={<IconUser />} />
              <Input type="text" value="Ciaran Sheridan" />
            </InputGroup>
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email address:</FormLabel>
            <InputGroup>
              <InputLeftElement children={<IconMail />} />
              <Input type="email" value="myemail@example.com" />
            </InputGroup>
          </FormControl>
          <FormControl as="fieldset" id="role">
            <FormLabel>Role:</FormLabel>
            <RadioGroup defaultValue="user">
              <HStack>
                <Radio value="user">User</Radio>
                <Radio value="teacher">Teacher</Radio>
                <Radio value="root">Root</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>
          <FormControl id="balance">
            <FormLabel>Balance:</FormLabel>
            <NumberInput step={1000} defaultValue={2000}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl display="flex" alignItems="center" id="is-active">
            <FormLabel mb="0">Is active user ?</FormLabel>
            <Switch id="is-active" />
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
    </Stack>
  );
};
