import { Badge, Button, Text, Image, Flex, Box } from "@chakra-ui/react";

export const UserSubscription = () => {
  return (
    <Box
      bg="blue.50"
      borderWidth="2px"
      borderColor="gray.300"
      boxShadow="inner"
      rounded="md"
      p={3}
    >
      <Flex direction="column" alignItems="center">
        <Image
          src="https://image.flaticon.com/icons/png/512/804/804023.png"
          width={100}
        />
        <Badge
          borderWidth="1px"
          borderColor="blue.300"
          colorScheme="blue"
          fontSize="xl"
          mt={3}
        >
          2021-01-01 16:33
        </Badge>
      </Flex>
    </Box>
  );
};
