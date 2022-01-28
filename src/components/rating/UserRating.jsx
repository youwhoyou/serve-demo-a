import React from "react";
import { Box, Flex, Icon } from "@chakra-ui/react";
import * as BsI from "react-icons/bs";

export default function UserRating({reviewCount, rating}) {

  return (
    <>
      <Flex alignItems="center" mt={1}>
            <Icon w={6} h={6} as={rating <= 1 ? BsI.BsStar : rating < 3.5 ? BsI.BsStarHalf : BsI.BsStarFill}
              color={rating > 1 ? "secondary.300" : "gray.500"}
              mb="2px"
            />
        <Box as="span" ml="6px" color="gray.500" fontSize="sm">
          {rating} ( {reviewCount ? reviewCount : 0} reviews )
          </Box>
      </Flex>
    </>
  )
};

// {Array(5)
//   .fill("")
//   .map((_, i) => (
//     <Icon w="15px" as={i < rating ? ((rating - i) <= 0.75 ? TiI.TiStarHalfOutline : TiI.TiStarFullOutline) : TiI.TiStarOutline}
//       key={i}
//       color={i < rating ? "secondary.300" : "gray.300"}
//       mb="2px"
//       fontSize="lg"
//     />
//   ))}