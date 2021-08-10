import { Flex, Avatar, Box, Text, Badge } from "@chakra-ui/react";

export const Comment = ({ username, isAdmin }) => {
  return (
    <Flex>
      <Avatar name={username ? username : ""} />
      <Box ml="3">
        <Text fontWeight="bold">
          {username}
          {isAdmin ? (
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
        <Text fontSize="md">
          For a seed to be used in a pseudorandom number generator, it does not
          need to be random. Because of the nature of number generating
          algorithms, so long as the original seed is ignored, the rest of the
          values that the algorithm generates will follow probability
          distribution in a pseudorandom manner.
        </Text>
      </Box>
    </Flex>
  );
};
