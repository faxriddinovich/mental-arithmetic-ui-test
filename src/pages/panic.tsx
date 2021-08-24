import { Component } from 'react';
import { Text, Button, Heading, Image, Container, Box, Flex } from '@chakra-ui/react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps { }

export class PanicPage extends Component<Props> {
  public render() {
    if(!this.props.location.state)
      this.props.history.push('/');
    return (
      <Container maxW="container.sm">
        <Flex direction="column" justifyContent="center" height="100vh">
          <Box
            bg="white"
            border="1px"
            borderColor="gray.300"
            rounded="md"
            mt={4}
            p={4}
          >
          <Flex direction="column" alignItems="center">
            { /* OFFLINE USAGE */ }
            <Image src="https://image.flaticon.com/icons/png/512/1182/1182679.png" width={100} />
            <Heading size="md" mt={3}><code>Something went wrong!</code></Heading>
            <Text>Please do not panic and contact the administrators</Text>
            <Button size="sm" mt={3} isFullWidth onClick={() => this.props.history.goBack() }>Go back</Button>
          </Flex>
          </Box>
        </Flex>
      </Container>
    );
  }
}
