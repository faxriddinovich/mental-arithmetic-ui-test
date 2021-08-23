import { Component, SyntheticEvent, createRef } from "react";
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
  createStandaloneToast,
} from "@chakra-ui/react";
import { IconUser, IconMailbox, IconKey, IconUserPlus } from "@tabler/icons";
import ReCAPTCHA from "react-google-recaptcha";
import { rpc } from "rpc/rpc";

const recaptchaRef = createRef();
/* FIXME: we can't use hooks inside a class component. */
const toast = createStandaloneToast();

interface Form {
  username: string;
  email: string;
  password: string;
  role: "user" | "teacher";
  agreement: boolean;
}

interface State {
  showPassword: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  form: Form;
}

export class CreateUserPage extends Component<{}, State> {
  public state: State = {
    showPassword: false,
    isDisabled: true,
    isLoading: false,
    form: {
      username: "",
      email: "",
      password: "",
      role: "user",
      agreement: false,
    },
  };

  private setFormInput(input: keyof Form, value: any) {
    this.setState((state) => {
      (state.form[input] as string) = value;
      return state;
    });
  }

  private async handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    this.setState({ isLoading: true });
    const { username, email, password, role } = this.state.form;
    const rc = (recaptchaRef as any).current.getValue();

    try {
      const params: any = { username, password, role, rc };
      if (email.length) params["email"] = email;
      await rpc.call("user.create", params);
      toast({
        title: `Created!`,
        position: "top",
        variant: "top-accent",
        status: "success",
      });
      this.setState({ isLoading: false });
    } catch {
      (recaptchaRef as any).current.reset();
      toast({
        title: `Unable to create a profile`,
        position: "top",
        isClosable: true,
        variant: "top-accent",
        status: "warning",
      });
      this.setState({ isLoading: false });
    }
  }

  public render() {
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
            onSubmit={this.handleSubmit.bind(this)}
          >
            <form>
              <Stack>
                <FormControl id="username" isRequired>
                  <FormLabel>Username</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<IconUser color="gray" size={21} />}
                    />
                    <Input
                      type="text"
                      placeholder="For example: piececandyearth"
                      value={this.state.form.username}
                      onChange={(event) =>
                        this.setFormInput("username", event.target.value)
                      }
                      minLength={4}
                      maxLength={20}
                    />
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
                      value={this.state.form.email}
                      onChange={(event) =>
                        this.setFormInput("email", event.target.value)
                      }
                    />
                  </InputGroup>
                </FormControl>
                <FormControl id="role" isRequired>
                  <FormLabel>Select your role:</FormLabel>
                  <RadioGroup
                    colorScheme="purple"
                    value={this.state.form.role}
                    onChange={(role) => this.setFormInput("role", role)}
                  >
                    <Stack direction="row">
                      <Radio value="user">Simple user</Radio>
                      <Radio value="teacher">Teacher</Radio>
                    </Stack>
                  </RadioGroup>
                  <FormHelperText>
                    If you select "Teacher" you will able to use features such
                    as: Create a course etc.
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
                        onClick={() =>
                          this.setState({
                            showPassword: !this.state.showPassword,
                          })
                        }
                      >
                        {this.state.showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                    <Input
                      type={this.state.showPassword ? "text" : "password"}
                      placeholder="Please write a password"
                      onChange={(event) =>
                        this.setFormInput("password", event.target.value)
                      }
                      minLength={4}
                      maxLength={20}
                    />
                  </InputGroup>
                  <FormHelperText>
                    We recommend to write a strong password for you safety.
                    Please do not write passwords such as: 1234.., qwerty.. etc.
                  </FormHelperText>
                </FormControl>
                <FormControl id="agreement">
                  <Checkbox
                    colorScheme="purple"
                    isChecked={this.state.form.agreement}
                    onChange={(event) =>
                      this.setFormInput("agreement", event.target.checked)
                    }
                    isRequired
                  >
                    I agree to the
                  </Checkbox>{" "}
                  <Link color="purple.700" as="b">
                    Terms of Service
                  </Link>
                </FormControl>
                <Box>
                  <ReCAPTCHA
                    ref={recaptchaRef as any}
                    sitekey={process.env.REACT_APP_RECAPTCHA_KEY as string}
                    onChange={() => this.setState({ isDisabled: false })}
                    onExpired={() => this.setState({ isDisabled: true })}
                  />
                </Box>
                <Box>
                  <Button
                    type="submit"
                    colorScheme="purple"
                    mt={4}
                    leftIcon={<IconUserPlus size={20} />}
                    borderColor="purple.600"
                    borderWidth="2px"
                    isFullWidth
                    isDisabled={this.state.isDisabled}
                    isLoading={this.state.isLoading}
                  >
                    Create
                  </Button>
                </Box>
              </Stack>
            </form>
          </Box>
        </Flex>
      </Container>
    );
  }
}
