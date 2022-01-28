import React, { useContext, useEffect, useState } from 'react';
import { Text, Center, Stack, Spinner, Box, Flex, IconButton, Spacer, Button, useDisclosure, Icon, Image, Container, AspectRatio, useToast, useColorMode, Avatar, ModalFooter, ModalHeader, ModalCloseButton, ModalBody, Modal, ModalOverlay, ModalContent, Input, FormControl, InputGroup, InputLeftElement, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, FormErrorMessage, FormLabel, UnorderedList, ListItem, FormHelperText, RadioGroup, Wrap, Radio, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Select } from "@chakra-ui/react";
import YouWhoLoading from '../misc/YouWhoLoading';
import ReactStars from "react-rating-stars-component";

import * as BsI from "react-icons/bs";
import * as Io5 from "react-icons/io5";
import * as Io4 from "react-icons/io";
import * as FaI from "react-icons/fa";
import * as HiI from "react-icons/hi";
// import * as TiI from "react-icons/ti";
// import * as RiI from "react-icons/ri";
import * as FcI from "react-icons/fc";
// import * as MdI from "react-icons/md";

export default function ReviewUser({ Moralis, ethAddress, user, grayText, grayText2, history, bookedId, booking, web3, account, youDapp, siteIsLoading3, setSiteIsLoading3, siteIsLoading, setSiteIsLoading, reviewSuccess, review, setReviewSuccess, reviewRating, setReviewRating, reviewDescription, setReviewDescription, bookingUser, bookingUsername, claimableAmount }) {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [confirmReview, setConfirmReview] = useState(false);


    const ratingStars = {
        size: 10,
        count: 5,
        color: "#718096",
        activeColor: "#1099e5",
        value: 3.5,
        a11y: true,
        isHalf: true,
        emptyIcon: <Icon w={8} h={8} as={BsI.BsStar} />,
        halfIcon: <Icon w={8} h={8} as={BsI.BsStarHalf} />,
        filledIcon: <Icon w={8} h={8} as={BsI.BsStarFill} />,
        onChange: newValue => { setReviewRating(newValue * 10); }
    };


    const reviewUser = async () => {

        if (youDapp !== 'undefined') {
            setSiteIsLoading3(true);
            try {
                await youDapp.methods.reviewClaim(web3.utils.asciiToHex(bookedId), reviewRating).send({ from: ethAddress }).then(async () => {

                    setReviewSuccess(true);
                    setSiteIsLoading3(false);
                    console.log("review user success");
                });
            } catch (error) {
                console.log("error review", error);
                setSiteIsLoading3(false);
            }
        }

    };



    return (
        <>
            {(siteIsLoading && !bookingUser) ?
                <YouWhoLoading />
                :
                <>
                    <Flex mb={3} mr={1} color={grayText2} align="center">
                        <Text fontWeight="400" fontSize="3xl" ml={1} style={{ display: "flex", alignItems: "center" }} ><Icon as={BsI.BsListCheck} color="primary.400" mr={2} />Review User</Text>
                        <Spacer />
                        <IconButton icon={<Io5.IoArrowBack />} size="sm" mr={2} variant="ghost" fontSize="24px" onClick={() => { history.goBack(); }} />
                    </Flex>

                    {(reviewSuccess) ?
                        <>
                            <Stack spacing="6" p={2}>
                                <Center>
                                    <Text fontSize="xl" color="primary.400" fontWeight="300">Thank you for reviewing this booking. Your <b>YOU Token</b> rewards have been sent to your wallet.</Text>
                                </Center>
                            </Stack>
                        </>
                        :
                        <Stack spacing="6" p={2}>
                            <Box >
                                <Text fontWeight="300" color={grayText} mb={1}>Give <Text as="span" color="primary.400" fontWeight="600">{bookingUsername}</Text> a rating</Text>
                                <Center pt={3} pb={4}>
                                    <ReactStars {...ratingStars} />
                                </Center>
                            </Box>

                            <Box >
                                <FormControl id="reviewDescription">
                                    <Flex justify="space-between">
                                        <FormLabel fontWeight="300" color={grayText}>Review details</FormLabel>
                                        <FormHelperText as="i" color={reviewDescription.length > 400 ? "red" : "gray.500"} >{400 - reviewDescription.length} char. remaining.</FormHelperText>
                                    </Flex>
                                    <Input as="textarea" isInvalid={reviewDescription.length > 400 ? true : false} variant="flushed" minHeight="150px" type="text" overflow="visible" py={1} placeholder="Provide a brief review of your booking." onChange={(e) => setReviewDescription(e.target.value)} />
                                </FormControl>
                            </Box>

                            <Box pb={2} >
                                <Text fontWeight="300" color={grayText} mb={2}>Your Rewards</Text>
                                <Text>You will receive approximately <Text as="span" color="secondary.300" fontWeight="600">{Number(claimableAmount / 10 ** 18).toFixed(4)} YOU</Text> Rewards after reviewing <Text as="span" color="primary.400" fontWeight="600">{bookingUsername}</Text></Text>
                            </Box>

                            <Stack spacing="3">
                                {!confirmReview ?
                                    <>
                                        <Button colorScheme="primary" onClick={() => setConfirmReview(true)} isLoading={siteIsLoading3}><Icon as={FaI.FaRegPaperPlane} mr={2} h="20px" w="20px" /> Submit Review?</Button>
                                        <Flex>
                                            <Spacer />
                                            <Button w="40%" onClick={() => { onClose(); }} isLoading={siteIsLoading3}>Cancel<Icon as={FcI.FcCancel} height="22px" width="22px" ml={2} /></Button>
                                        </Flex>
                                    </>
                                    :
                                    <>
                                        <Button colorScheme="green" onClick={reviewUser} isLoading={siteIsLoading3}><Icon as={FaI.FaRegPaperPlane} mr={2} h="20px" w="20px" /> Yes Submit My Review!</Button>
                                        <Flex>
                                            <Spacer />
                                            <Button w="40%" onClick={() => setConfirmReview(false)} isLoading={siteIsLoading3}  >Cancel<Icon as={FcI.FcCancel} height="22px" width="22px" ml={2} /></Button>
                                        </Flex>
                                    </>
                                }
                            </Stack>

                        </Stack>
                    }
                </>
            }
        </>
    )
}