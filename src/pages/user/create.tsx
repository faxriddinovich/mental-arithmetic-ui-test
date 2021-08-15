import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { IconUser, IconMailbox, IconKey, IconUserPlus } from "@tabler/icons";

export const CreateUser = () => {
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
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<IconUser color="gray" size={21} />}
                />
                <Input type="text" placeholder="For example: piececandyearth" />
              </InputGroup>
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<IconMailbox color="gray" size={21} />}
                />
                <Input
                  type="email"
                  placeholder="For example: piececandyearth@example.com"
                />
              </InputGroup>
            </FormControl>
            <FormControl id="role">
              <FormLabel>Select your role:</FormLabel>
              <RadioGroup colorScheme="purple" value="1">
                <Stack direction="row">
                  <Radio value="1">Simple user</Radio>
                  <Radio value="2">Teacher</Radio>
                </Stack>
              </RadioGroup>
              <FormHelperText>
                If you select "Teacher" you will able to use features such as:
                Create a course etc.
              </FormHelperText>
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
                  placeholder="Please write a password"
                />
              </InputGroup>
              <FormHelperText>
                We recommend to write a strong password for you safety. Please
                do not write passwords such as: 1234.., qwerty.. etc.
              </FormHelperText>
            </FormControl>
            <FormControl id="repeat-password" isRequired>
              <FormLabel>Repeat the password</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<IconKey color="gray" size={21} />}
                />
                <Input type="password" placeholder="Repeat the password" />
              </InputGroup>
            </FormControl>
            <FormControl>
              <Checkbox colorScheme="purple">I agree to the</Checkbox>{" "}
              <Link color="purple.700" as="b">
                Terms of Service
              </Link>
            </FormControl>
            <Box>
              <Button
                colorScheme="purple"
                mt={4}
                leftIcon={<IconUserPlus size={20} />}
                borderColor="purple.600"
                borderWidth="2px"
                isFullWidth
              >
                Create
              </Button>
            </Box>
          </Stack>
        </Box>
      </Flex>
    </Container>
  );
};
