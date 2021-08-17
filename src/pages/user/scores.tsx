import {
  Center,
  Stat,
  StatHelpText,
  StatNumber,
  Spacer,
  Badge,
  Text,
  Avatar,
  Container,
  Flex,
  Box,
  Stack,
  Heading,
  Divider,
  StatLabel,
  StatGroup,
} from "@chakra-ui/react";

import { Bar, Line } from "react-chartjs-2";

const barData = {
  labels: ["Abacus", "Flash card", "Table", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const barOptions = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const data = {
  labels: [
    "2021/01/02",
    "2021/01/03",
    "2021/01/04",
    "2021/01/05",
    "2021/01/06",
    "2021/01/07",
  ],
  datasets: [
    {
      label: "Abacus",
      data: [3, 19, 3, 5, 2, 3],
      fill: false,
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgba(255, 99, 132)",
    },
    {
      label: "Flash card",
      data: [2, 9, 3, 9, 4, 1],
      fill: false,
      backgroundColor: "rgb(33, 99, 132)",
      borderColor: "rgba(33, 99, 132)",
    },
    {
      label: "Table",
      data: [20, 15, 13, 24, 4, 10],
      fill: false,
      backgroundColor: "rgb(100, 100, 32)",
      borderColor: "rgba(103, 100, 32)",
    },
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

export const UserAccount = () => {
  return (
    <Container maxW="container.lg">
      <Stack spacing={5}>
        <Box
          bg="white"
          border="1px"
          borderColor="gray.300"
          boxShadow="inner"
          rounded="md"
          mt={4}
          p={4}
        >
          <StatGroup>
            <Stat>
              <StatLabel>Daily ex.</StatLabel>
              <StatNumber>45</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Weekly ex.</StatLabel>
              <StatNumber>1000</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Total ex.</StatLabel>
              <StatNumber>1000</StatNumber>
            </Stat>
          </StatGroup>
        </Box>
        <Box
          bg="white"
          border="1px"
          borderColor="gray.300"
          boxShadow="inner"
          rounded="md"
          mt={4}
          p={4}
        >
          <Bar data={barData} options={barOptions} />
        </Box>
        <Box
          bg="white"
          border="1px"
          borderColor="gray.300"
          boxShadow="inner"
          rounded="md"
          mt={4}
          p={4}
        >
          <Line data={data} options={options} />
        </Box>
      </Stack>
    </Container>
  );
};
