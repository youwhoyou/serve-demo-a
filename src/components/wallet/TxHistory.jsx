import React, { useEffect, useState } from 'react';
import { Button, Box, Container, Text, Icon, useColorModeValue, Stack, useColorMode, Tabs, TabList, Tab, TabPanels, TabPanel, Flex, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from "@chakra-ui/react";
import Moralis from "moralis";
import { Link as RouterLink } from 'react-router-dom';
import { useMoralis } from "react-moralis";
import * as Io5 from "react-icons/io5";
import * as AiI from "react-icons/ai";
import * as BsI from "react-icons/bs";
import { Web3 } from 'moralis/lib/browser/Parse';




export default function TxHistory({ ethAddress }) {

    const { user, web3 } = useMoralis();
    const { colorMode } = useColorMode();
    const [paymentsReceived, setPaymentsReceived] = useState([]);
    const [paymentsSent, setPaymentsSent] = useState([]);
    const [reviewedUser, setReviewedUser] = useState([]);


    useEffect(() => {
        (async () => {

            await getPaymentsReceived();
            await getPaymentsSent();
            await getReviewedUser();

        })();
    }, [])


    const getPaymentsReceived = async () => {

        const Payments = Moralis.Object.extend("Payments");
        let queryPaymentsReceived = new Moralis.Query(Payments);
        // queryPaymentsReceived.containedIn("token_address", acceptedCryptosAddresses);
        queryPaymentsReceived.equalTo("provider", user.attributes.ethAddress);
        queryPaymentsReceived.descending("updatedAt");

        let paymentsReceived1 = await queryPaymentsReceived.find();
        // console.log("paymentsReceived", paymentsReceived1);
        setPaymentsReceived(paymentsReceived1);

    }

    const getPaymentsSent = async () => {

        const Payments = Moralis.Object.extend("Payments");
        let queryPaymentsSent = new Moralis.Query(Payments);
        // queryPaymentsSent.containedIn("token_address", acceptedCryptosAddresses);
        queryPaymentsSent.equalTo("user", user.attributes.ethAddress);
        queryPaymentsSent.descending("updatedAt");

        let paymentsSent1 = await queryPaymentsSent.find();
        // console.log("paymentsSent", paymentsSent1);
        setPaymentsSent(paymentsSent1);

    }

    const getReviewedUser = async () => {

        const ReviewedUser = Moralis.Object.extend("ReviewedUser");
        let queryReviewedUser = new Moralis.Query(ReviewedUser);
        // queryPaymentsSent.containedIn("token_address", acceptedCryptosAddresses);
        // queryReviewedUser.equalTo("user", user.attributes.ethAddress);
        // queryReviewedUser.descending("updatedAt");


        const BookingsPublic = Moralis.Object.extend("BookingsPublic");
        const queryBookingsPublic = new Moralis.Query(BookingsPublic);
        queryBookingsPublic.matchesKeyInQuery("bookingBytes32", "booking", queryReviewedUser);
        queryBookingsPublic.equalTo("providerPublic", user.attributes.userPublic);
        // results has the list of users with a hometown team with a winning record
        let reviewedUser1 = await queryBookingsPublic.find();
        // console.log("reviewedUser", reviewedUser1);
        setReviewedUser(reviewedUser1);

    }





    const grayText = colorMode === "light" ? "gray.500" : "gray.400";
    const grayText2 = colorMode === "light" ? "gray.600" : "gray.100";
    const paymentsReceivedBg = colorMode === "light" ? "primary.300" : "primary.500";
    const paymentsSentBg = colorMode === "light" ? "secondary.300" : "secondary.500";
    const reviewedUserBg = colorMode === "light" ? "primary.300" : "primary.500";


    return (
        <Stack>
            <Accordion defaultIndex={[0]} allowMultiple >
                <AccordionItem borderWidth="0px">
                    <AccordionButton px={2} py={3} _hover={{ bg: "none" }}>
                        <Box flex="1" textAlign="left">
                            <Text color={grayText2} ><Icon as={AiI.AiOutlineDownload} color="primary.400" mr={2} h={5} w={5} mb="4px" />{paymentsReceived.length > 0 ? paymentsReceived.length : "No"} Payments Received</Text>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel px={0} pt={0} pb={3}>
                        <Stack spacing="3">
                            {paymentsReceived.length > 0 ?
                                paymentsReceived.map((x, i) =>
                                    <Box key={i + "alink"} as="a" target="_blank" href={`https://testnet.snowtrace.io/tx/${x.attributes.transaction_hash}`} p={4} bg={paymentsReceivedBg} borderRadius="md">
                                        <Text key={i + "atitle"} mb={2} fontWeight="600"><Icon as={AiI.AiOutlineExclamationCircle} mr={2} h={6} w={6} mb="2px" />You Received {Number((x.attributes.amount / 10 ** 18) * .97).toFixed(4)} {web3.utils.hexToAscii(x.attributes.ticker)}</Text>
                                        <Text key={i + "adetail"}>For booking <Text as="span" fontWeight="600">{web3.utils.hexToAscii(x.attributes.booking)}</Text> and was given a rating of <Text as="span" fontWeight="600">{x.attributes.rating / 10} Stars</Text> by the user.</Text>
                                    </Box>
                                )
                                :
                                <Text px={4} color={grayText} fontWeight="300" fontSize="sm">No Payments Received Yet</Text>
                            }
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem borderBottomWidth="0px">
                    <AccordionButton px={2} py={3} _hover={{ bg: "none" }}>
                        <Box flex="1" textAlign="left">
                            <Text color={grayText2}><Icon as={AiI.AiOutlineUpload} color="secondary.300" mr={2} h={5} w={5} mb="4px" />{paymentsSent.length > 0 ? paymentsSent.length : "No"} Payments Sent</Text>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel px={0} pt={0} pb={3}>
                        <Stack spacing="3">
                            {paymentsSent.length > 0 ?
                                paymentsSent.map((x, i) =>
                                    <Box key={i + "slink"} as="a" target="_blank" href={`https://testnet.snowtrace.io/tx/${x.attributes.transaction_hash}`} p={4} bg={paymentsSentBg} borderRadius="md">
                                        <Text key={i + "stitle"} mb={2} fontWeight="600"><Icon as={AiI.AiOutlineExclamationCircle} mr={2} h={6} w={6} mb="2px" />You Paid {Number(x.attributes.amount / 10 ** 18).toFixed(4)} {web3.utils.hexToAscii(x.attributes.ticker)}</Text>
                                        <Text key={i + "sdetail"}>For booking <Text as="span" fontWeight="600">{web3.utils.hexToAscii(x.attributes.booking)}</Text> and was rewarded with <Text as="span" fontWeight="600">{Number(x.attributes.amountUhu / 10 ** 18).toFixed(2)} YOU</Text> tokens as a Thank you from <Text as="span" fontWeight="600">YouWho.io</Text>!</Text>
                                    </Box>
                                )
                                :
                                <Text px={4} color={grayText} fontWeight="300" fontSize="sm">No Payments Sent Yet</Text>
                            }
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem borderBottom="0px">
                    <AccordionButton px={2} py={3} _hover={{ bg: "none" }}>
                        <Box flex="1" textAlign="left">
                            <Text color={grayText2}><Icon as={BsI.BsPersonCheck} color="primary.500" mr={2} h={5} w={5} mb="4px" />{reviewedUser.length > 0 ? reviewedUser.length : "No"} Users Reviewed</Text>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel px={0} pt={0} pb={3}>
                        <Stack spacing="3">
                            {reviewedUser.length > 0 ?
                                reviewedUser.map((x, i) =>
                                    <Box key={i + "rlink"} as={RouterLink} to={`/activity/who/bookings/${x.attributes.booking.id}`} p={4} bg={reviewedUserBg} borderRadius="md">
                                        <Text key={i + "rtitle"} mb={2} fontWeight="600"><Icon as={AiI.AiOutlineExclamationCircle} mr={2} h={6} w={6} mb="2px" />You Received {Number(x.attributes.providerUhu / 10 ** 18).toFixed(2)} YOU</Text>
                                        <Text key={i + "rdetail"}>You gave the user a rating of <Text as="span" fontWeight="600">{x.attributes.userRating} Stars</Text> for booking <Text as="span" fontWeight="600">{x.attributes.booking.id}</Text>.</Text>
                                    </Box>
                                )
                                :
                                <Text px={4} color={grayText} fontWeight="300" fontSize="sm">No Users Reviewed yet</Text>
                            }
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </Stack>
    )
}




// {newEvents.map((x, i) =>
//     <Box as={RouterLink} key={i + "link"} to={x.link} p={4} bg={x.side === "user" ? newEventBgUser : newEventBgProvider} borderRadius="md">
//         <Text key={i + "title"} mb={2} fontWeight="600"><Icon as={AiI.AiOutlineExclamationCircle} mr={2} h={6} w={6} mb="2px" />{x.title}</Text>
//         <Text key={i + "detail"}>{x.detail}</Text>
//     </Box>
// )}


// {oldEvents.map((x, i) =>
//     <Box as={RouterLink} key={i + "link"} to={x.link} p={4} bg={x.side === "user" ? "gray.5" : "gray.10"} borderRadius="md">
//         <Text key={i + "title"} mb={2} fontWeight="600"><Icon as={AiI.AiOutlineFolder} mr={2} h={6} w={6} mb="3px" />{x.title}</Text>
//         <Text key={i + "detail"}>{x.detail}</Text>
//     </Box>
// )}