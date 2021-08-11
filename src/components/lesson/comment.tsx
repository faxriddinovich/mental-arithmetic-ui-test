import { Component } from "react";
import {
  Button,
  IconButton,
  Spacer,
  Flex,
  Avatar,
  Box,
  Text,
  Badge,
} from "@chakra-ui/react";
import { IconTrash, IconCornerUpLeft } from "@tabler/icons";

interface Props {
  username?: string;
  isAdmin?: boolean;
}

export class Comment extends Component<Props> {
  public render() {
    return (
      <Flex>
        <Avatar name={this.props.username ? this.props.username : ""} />
        <Box ml="3">
          <Text fontWeight="bold">
            {this.props.username}
            {this.props.isAdmin ? (
              <Badge variant="outline" ml="1" colorScheme="purple">
                administrator
              </Badge>
            ) : (
              ""
            )}
          </Text>
          <Text color="gray.600" as="b" fontSize="sm">
            2021-06-06 16:44
          </Text>
          <Text fontSize="md" mb={2}>
            For a seed to be used in a pseudorandom number generator, it does
            not need to be random. Because of the nature of number generating
            algorithms, so long as the original seed is ignored, the rest of the
            values that the algorithm generates will follow probability
            distribution in a pseudorandom manner.
          </Text>
          <Flex>
            <span>
              <Button leftIcon={<IconCornerUpLeft />} px={6} size="sm">
                <b>Reply</b>
              </Button>
            </span>
            <Spacer />
            <span>
              <IconButton aria-label="test" icon={<IconTrash />} size="sm" />
            </span>
          </Flex>
        </Box>
      </Flex>
    );
  }
}
