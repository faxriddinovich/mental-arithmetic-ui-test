import { useState } from "react";
import {
  Checkbox,
  InputRightElement,
  Button,
  Stack,
  InputGroup,
  Container,
  Flex,
  Box,
  FormControl,
  Input,
  InputLeftElement,
  FormLabel,
} from "@chakra-ui/react";
import { IconUserCheck, IconKey, IconUser } from "@tabler/icons";

export const LoginUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Container maxW="container.sm">
      <Flex direction="column" justifyContent="center" height="100vh">
        <Box
          bg="white"
          border="1px"
          borderColor="gray.300"
          rounded="md"
          boxShadow="md"
          mt={4}
          p={4}
        >
          <Stack>
            <FormControl id="username">
              <FormLabel>Username or email</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<IconUser color="gray" size={21} />}
                />
                <Input
                  type="text"
                  placeholder="Please enter your username or email"
                />
              </InputGroup>
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<IconKey color="gray" size={21} />}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Please enter your password"
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <Checkbox colorScheme="purple">Remember me</Checkbox>
            </FormControl>
            <Box mt={4}>
              <Button
                colorScheme="purple"
                mt={4}
                leftIcon={<IconUserCheck size={20} />}
                borderColor="purple.600"
                borderWidth="2px"
                isFullWidth
              >
                Login
              </Button>
            </Box>
          </Stack>
        </Box>
      </Flex>
    </Container>
  );
};
