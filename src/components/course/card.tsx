import {
  Flex, Spacer,
  Tag,
  Avatar,
  TagLabel,
  Divider,
  Stack,
  Heading,
  Box,
  Image,
  Text, Link
} from "@chakra-ui/react";
//@ts-ignore
import Rating from "react-rating-stars-component";
import { IconNotes, IconUser, IconRuler2 } from '@tabler/icons';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  purchased?: boolean,
    image?: string
      title?: string
}

export const CourseCard = ({ purchased , image, title }: Props) => {
  return (
    <Box
      bg={purchased ? "purple.50" : "white"}
      border="1px"
      borderColor="gray.300"
      rounded="md"
      boxShadow="sm"
      overflow="hidden"
    >
      <Box position="relative">
        <div className="bottom-right">
          <Rating activeColor="#F2C066" size={18} />
        </div>
        <Image height="300px" width="100%" src={ image ? image : "https://thumbs-prod.si-cdn.com/s-jZTk0XtVmp-89MlOgFXqaAVe4=/fit-in/1600x0/https://public-media.si-cdn.com/filer/29/0f/290fb8c0-1872-46e5-8c12-235742905def/science_smithsonian_magazine_booklist_2019.png"} />
      </Box>

      <Box p={4}>
        <Stack spacing={3}>
        <Link as={RouterLink} to="/course">
          <Heading size="md">{ title || "Data science course" }</Heading>
          </Link>
          <Box>
            Data science is an interdisciplinary field focused on extracting
            knowledge from data sets, which are typically...
          </Box>
          <Flex>
            <Tag variant="outline" shadow={0}>
              <IconNotes />
              &nbsp;<Text fontSize="lg">23</Text>
            </Tag>
            <Spacer />
            <Tag variant="outline" shadow={0}>
              <IconRuler2 />
              &nbsp;<Text fontSize="lg">10</Text>
            </Tag>
            <Spacer />
            <Tag variant="outline" shadow={0}>
              <IconUser />
              &nbsp;<Text fontSize="lg">4</Text>
            </Tag>
          </Flex>
          <Divider />
          <Box>
          <Flex align="center">
            <Tag size="lg" borderRadius="full" bg="blue.100">
              <Avatar
                src="https://bit.ly/sage-adebayo"
                size="xs"
                name="Satoshi nakomoto"
                ml={-2}
                mr={2}
              />
              <TagLabel as="b">Satoshi Nakamoto</TagLabel>
            </Tag>
            <Spacer />
            <Text fontSize="lg"><b>23 000</b> sum</Text>
            </Flex>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
