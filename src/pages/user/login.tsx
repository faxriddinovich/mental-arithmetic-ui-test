import { Component, createRef, SyntheticEvent } from "react";
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
import ReCAPTCHA from "react-google-recaptcha";

const recaptchaRef = createRef();

interface Form {
  username: string;
  password: string;
  remember: boolean;
}

interface State {
  showPassword: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  form: Form;
}

export class UserLoginPage extends Component<{}, State> {
  public state: State = {
    showPassword: false,
    isDisabled: true,
    isLoading: false,
    form: { username: "", password: "", remember: false },
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
                  <FormLabel>Username or email</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<IconUser color="gray" size={21} />}
                    />
                    <Input
                      type="text"
                      value={this.state.form.username}
                      placeholder="Please enter your username or email"
                      minLength={4}
                      maxLength={20}
                      onChange={(event) =>
                        this.setFormInput("username", event.target.value)
                      }
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
                      value={this.state.form.password}
                      placeholder="Please enter your password"
                      minLength={4}
                      maxLength={20}
                      onChange={(event) =>
                        this.setFormInput("password", event.target.value)
                      }
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <Checkbox
                    colorScheme="purple"
                    onChange={(event) =>
                      this.setFormInput("remember", event.target.checked)
                    }
                  >
                    Remember me
                  </Checkbox>
                </FormControl>
                <Box>
                  <ReCAPTCHA
                    ref={recaptchaRef as any}
                    sitekey={process.env.REACT_APP_RECAPTCHA_KEY as string}
                    onChange={() => this.setState({ isDisabled: false })}
                    onExpired={() => this.setState({ isDisabled: true })}
                  />
                </Box>
                <Box mt={4}>
                  <Button
                    type="submit"
                    colorScheme="purple"
                    mt={4}
                    leftIcon={<IconUserCheck size={20} />}
                    borderColor="purple.600"
                    borderWidth="2px"
                    isFullWidth
                    isDisabled={this.state.isDisabled}
                    isLoading={this.state.isLoading}
                  >
                    Login
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
