import {
  Stack,
  Container,
  Box,
  Grid,
  GridItem,
  Flex,
  Input,
  Button,
} from "@chakra-ui/react";
import { CourseCard } from "components/course/card";
import { IconSearch } from "@tabler/icons";

export const CourseList = () => {
  return (
    <Container maxW="container.xl" mt={5}>
      <Stack spacing={4}>
            <Box
              bg="white"
              border="1px"
              borderColor="gray.300"
              rounded="md"
              boxShadow="sm"
              overflow="hidden"
              p={2}
            >
              <Flex>
                <Input
                  variant="outline"
                  placeholder="Lesson's name, tags, author's name..."
                  bg="gray.200"
                />
                <Button leftIcon={<IconSearch size={18} />} px={6} ml={4}>
                  Search
                </Button>
              </Flex>
            </Box>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }} gap={4}>
          <GridItem>
            <CourseCard purchased image="https://gsc.edu.in/wp-content/uploads/2018/08/maths.jpg" title="Mathematics" />
          </GridItem>
          <GridItem>
            <CourseCard image="https://images.unsplash.com/photo-1602144586093-06c14ac4fe4a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjV8fGJpb2xvZ3l8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80" title="Biology" />
          </GridItem>
          <GridItem>
            <CourseCard image="https://rasadgaran.ir/wp-content/uploads/2020/12/bknk.jpg" title="Astronomy"/>
          </GridItem>
          <GridItem>
            <CourseCard image="https://thumbs.dreamstime.com/b/red-blue-horseshoe-magnet-physics-magnetic-compass-iron-powder-magnetic-field-white-paper-graph-background-107309637.jpg" title="Physics" />
          </GridItem>
        </Grid>
      </Stack>
    </Container>
  );
};
