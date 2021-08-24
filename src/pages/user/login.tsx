import { Component, createRef, SyntheticEvent } from "react";
import { RouteComponentProps } from 'react-router-dom';
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
  createStandaloneToast,
} from "@chakra-ui/react";
import {
  IconUserCheck,
  IconKey,
  IconUser,
} from "@tabler/icons";
import ReCAPTCHA from "react-google-recaptcha";
import { rpc } from "rpc/rpc";
import { RPC_ERR_INVALID_CREDENTIALS } from "rpc/error-codes";
import { RPCException } from "@theta-rpc/json-rpc";

const recaptchaRef = createRef();
/* FIXME: we can't use hooks inside a class component. */
const createToast = createStandaloneToast();

interface Props extends RouteComponentProps { }
interface Form {
  login: string;
  password: string;
  remember: boolean;
}

interface State {
  showPassword: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  form: Form;
}

export class UserLoginPage extends Component<Props, State> {
  public state: State = {
    showPassword: false,
    isDisabled: true,
    isLoading: false,
    form: { login: "", password: "", remember: false },
  };

  private setFormInput(input: keyof Form, value: any) {
    this.setState((state) => {
      (state.form[input] as string) = value;
      return state;
    });
  }

  private handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    const { login, password } = this.state.form;
    this.setState({ isLoading: true });
    const rc = (recaptchaRef as any).current.getValue();
    rpc
      .call("user.login", { login, password, rc })
      .then(() => {
      })
      .catch((error) => {
        (recaptchaRef as any).current.reset();
        if (error instanceof RPCException) {
          const { jsonrpcError } = error;
          if (jsonrpcError.code === RPC_ERR_INVALID_CREDENTIALS) {
            createToast({
              title: `Invalid credentials`,
              position: "top",
              variant: "top-accent",
              status: "warning",
            });
          }
        }
        this.setState({ isLoading: false, isDisabled: true });
        this.props.history.push({ pathname: '/panic', state: true });
      })
      .finally(() => this.setState({ isLoading: false }));
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
                <FormControl id="login" isRequired>
                  <FormLabel>Username or email</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<IconUser color="gray" size={21} />}
                    />
                    <Input
                      type="text"
                      value={this.state.form.login}
                      placeholder="Please enter your username or email"
                      minLength={4}
                      maxLength={20}
                      onChange={(event) =>
                        this.setFormInput("login", event.target.value)
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
