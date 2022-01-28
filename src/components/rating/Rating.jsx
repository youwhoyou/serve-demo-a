import React from "react";
import { Box, Flex, Icon } from "@chakra-ui/react";
import * as TiI from "react-icons/ti";

export default function Rating({reviewCount, rating}) {

  return (
    <>
      <Flex alignItems="center">
        {Array(5)
          .fill("")
          .map((_, i) => (
            <Icon as={i < rating ? ((rating - i) <= 0.75 ? TiI.TiStarHalfOutline : TiI.TiStarFullOutline) : TiI.TiStarOutline}
              key={i}
              color={i < rating ? "primary.400" : "gray.300"}
              mb="2px"
              fontSize="lg"
            />
          ))}
        <Box as="span" ml="1" color="gray.500" fontSize="sm">
          {rating} ( {reviewCount ? reviewCount : 0} reviews )
          </Box>
      </Flex>
    </>
  )
};



// const Rating = React.forwardRef(
//   ({ size, icon, scale, fillColor, strokeColor }, ref) => {
//     const [rating, setRating] = useState(0);
//     const buttons = [];

//     const onClick = idx => {
//       if (!isNaN(idx)) {
//         // allow user to click first icon and set rating to zero if rating is already 1
//         if (rating === 1 && idx === 1) {
//           setRating(0);
//         } else {
//           setRating(idx);
//         }
//       }
//     };

//     const RatingIcon = ({ fill }) => {
//       return (
//         <Icon
//           name={icon}
//           size={`${size}px`}
//           color={fillColor}
//           stroke={strokeColor}
//           onClick={onClick}
//           fillOpacity={fill ? "100%" : "0"}
//         />
//       );
//     };

//     const RatingButton = ({ idx, fill }) => {
//       return (
//         <Box
//           as="button"
//           aria-label={`Rate ${idx}`}
//           height={`${size}px`}
//           width={`${size}px`}
//           variant="unstyled"
//           mx={1}
//           onClick={() => onClick(idx)}
//           _focus={{ outline: 0 }}
//         >
//           <RatingIcon fill={fill} />
//         </Box>
//       );
//     };

//     for (let i = 1; i <= scale; i++) {
//       buttons.push(<RatingButton key={i} idx={i} fill={i <= rating} />);
//     }

//     return (
//       <Stack isInline mt={8} justify="center">
//         <input name="rating" type="hidden" value={rating} ref={ref} />
//         {buttons}
//         <Box width={`${size * 1.5}px`} textAlign="center">
//           <Text fontSize="sm" textTransform="uppercase">
//             Rating
//           </Text>
//           <Text fontSize="2xl" fontWeight="semibold" lineHeight="1.2em">
//             {rating}
//           </Text>
//         </Box>
//       </Stack>
//     );
//   }
// );

// Rating.displayName = "Rating";

// export default Rating;
