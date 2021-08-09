import * as React from "react";
import {
  ChakraProvider,
  Container,
  Box,
  Grid,
  GridItem,
  Image,
  Heading,
  Divider,
  Link,
  Text,
  Avatar,
  Tag,
  TagLabel,
  Badge,
  Flex,
  Spacer,
  HStack,
  Center,
} from "@chakra-ui/react";
import {
  IconCloud,
  IconLifebuoy,
  IconGolf,
  IconLayoutList,
  IconMessageCircle,
  IconRuler2,
  IconClock,
  IconPencil,
  IconDots
} from "@tabler/icons";
import { theme } from "./theme";
import { Card } from "./Card.tsx";
import { BigCard } from "./BigCard.tsx";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.xl" mt={10}>
        <Grid
          gap={4}
          templateRows="repeat(auto-fill, 1fr)"
          templateColumns="repeat(3, 1fr)"
        >
          <GridItem colSpan={2} rowSpan={10}>
            <BigCard />
          </GridItem>
          <GridItem colSpan={1}>
            <Card title="#2 How does memory work" />
          </GridItem>
          <GridItem colSpan={1}>
            <Card title="#2 How does memory work" />
          </GridItem>
          <GridItem colSpan={1}>
            <Card title="#3 Struct padding & packing" />
          </GridItem>
          <GridItem>
            <Card title="#4 Another thing about something" isNew={true} />
          </GridItem>
          <GridItem>
          <Link>
            <Box
              bg="white"
              border="1px"
              borderColor="gray.300"
              rounded="md"
              boxShadow="sm"
              p="2"
              _hover = {{ background: 'blue.50' }}
            >
              <Center><IconDots /></Center>
            </Box>
            </Link>
          </GridItem>
        </Grid>
      </Container>
    </ChakraProvider>
  );
};
