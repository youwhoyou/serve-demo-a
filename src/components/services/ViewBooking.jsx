import React, { useContext, useEffect, useState } from 'react';
import { Text, Center, Stack, Spinner, Box, Flex, IconButton, Spacer, Button, useDisclosure, Icon, Image, Container, AspectRatio, useToast, useColorMode, Avatar, ModalFooter, ModalHeader, ModalCloseButton, ModalBody, Modal, ModalOverlay, ModalContent, Input, FormControl, InputGroup, InputLeftElement, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, FormErrorMessage, FormLabel, UnorderedList, ListItem, FormHelperText, RadioGroup, Wrap, Radio, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Select } from "@chakra-ui/react";
import { SiteStateContext } from "../context/SiteStateContext";
import ErrorDialog from '../error/ErrorDialog';
import Lightbox from "react-awesome-lightbox";
import YouWhoLogo from "../../media/logo/YouWhoLogo.jsx";
import YouWhoLoading from '../misc/YouWhoLoading';
import ViewTimeDay from '../misc/ViewTimeDay';
import ModalLogin from "../login/ModalLogin";
import ProviderRating from "../rating/ProviderRating";
import SuccessBox from "../error/SuccessBox";
import * as BsI from "react-icons/bs";
import * as Io5 from "react-icons/io5";
import * as Io4 from "react-icons/io";
import * as FaI from "react-icons/fa";
// import * as HiI from "react-icons/hi";
import * as TiI from "react-icons/ti";
import * as RiI from "react-icons/ri";
import * as FcI from "react-icons/fc";
// import * as MdI from "react-icons/md";


export default function ViewBooking({ grayText, grayText2, history, bookedService, bookingId, provider, rate, setRate, description, setDescription, selectedTimezone, user, showLightbox, lightboxArray, setShowLightbox, ethAddress, setEthAddress, bookingUser, setBookingUser, booking, setBooking, bookingPublic, setBookingPublic, bookingApproval, setBookingApproval, ethAddresses, setEthAddresses, bookingStatus, setBookingStatus, rateAgreed, setRateAgreed, durationHours, setDurationHours, serviceLocation, setServiceLocation, paidAmountUsd, setPaidAmountUsd, dayTime, setDayTime, amountYou }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { siteIsLoading } = useContext(SiteStateContext);
    const [showAlert, setShowAlert] = useState(false);
    const [newBookingError, setNewBookingError] = useState([]);


    useEffect(() => {
        if (document.getElementById("description") && description) {
            document.getElementById("description").innerHTML = description;
        }
    }, [description, document.getElementById("description")])



    return (
        <>
            {showAlert && (<ErrorDialog title={newBookingError[0]} message={newBookingError[1]} showAlert={showAlert} setShowAlert={setShowAlert} />)}
            {siteIsLoading ?
                <YouWhoLoading />
                :
                <>
                    <Flex mb={3} mr={1} color={grayText2} align="center">
                        <Text fontWeight="400" fontSize="3xl" ml={1} color={bookingStatus === "declined" ? "crimson" : "inherit"} style={{ display: "flex", alignItems: "center" }} ><Icon as={TiI.TiBookmark} color="primary.400" mr={2} />My Booking</Text>
                        <Spacer />
                        <IconButton icon={<Io5.IoArrowBack />} size="sm" mr={2} variant="ghost" fontSize="24px" onClick={() => { history.push("/activity/you/booked"); }} />
                    </Flex>

                    <Stack spacing="6">

                        {(bookingStatus === "paid" && !siteIsLoading && amountYou) && <SuccessBox status={`success`} title={`Congratulations!`} message={<>You earned <b>{Number(amountYou / 10 ** 18).toFixed(4)} YOU</b> Tokens as our way of saying Thank you!</>} setUpdateSuccess={() => { }} />}


                        <Flex role="button" onClick={() => { history.push(`/activity/you/viewed/${bookedService.id}`); window.scrollTo(0, 0); }} bg="gray.5" borderRadius="md" overflow="hidden" align="center">
                            <Box minWidth={["29vw", "120px", ""]} minHeight={["29vw", "120px", ""]} >
                                {bookedService.attributes.service_img1 ? (
                                    <Image w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} objectFit="cover" src={bookedService.attributes.service_img1._url} fallback={<Center w={["29vw", "120px", ""]} h={["29vw", "120px", ""]}><Spinner /></Center>} borderLeftRadius="md" />
                                ) : (
                                    <Center filter="grayscale(1)" bg="gray.5" w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} >
                                        <YouWhoLogo opacity="0.2" wdth={["68%", "", ""]} />
                                    </Center>
                                )}
                            </Box>
                            <Box textAlign="left" px={3} maxHeight={["29vw", "120px", ""]} overflow="auto">
                                {/* <Text id={"id" + i} key={"id" + i}>ID: {x.id}</Text> */}
                                <Text fontWeight="500" textTransform="capitalize" fontSize="sm">{bookedService.attributes.title}</Text>
                                <Text color={grayText} textTransform="capitalize" fontSize="xs">{bookedService.attributes.category} {bookedService.attributes.subCategory ? <Text as="span">&bull;</Text> : ""} {bookedService.attributes.subCategory}</Text>
                                <Text color="primary.500" textTransform="capitalize" fontSize="xl" fontWeight="500"><Text as="span" fontSize="md">$</Text>{bookedService.attributes.rate}<Text as="span" fontSize="xs" color={grayText}> USD/hr.</Text></Text>
                            </Box>
                        </Flex>

                        <Stack px={1} spacing="6">

                            <Box borderBottom="1px" pb={5} borderColor="gray.10" >
                                <Text fontWeight="300" color={grayText} mb={1}>Booking #</Text>
                                <Text fontSize="xl" fontWeight="500">{bookingId}</Text>
                            </Box>

                            {provider &&
                                <Box borderBottom="1px" pb={5} borderColor="gray.10" >
                                    <Center>
                                        <Box>
                                            <Text fontWeight="300" color={grayText}>Service provided by</Text>
                                            <Text fontSize="xl" fontWeight="500">{provider.attributes.username}</Text>
                                            <ProviderRating rating={Number(provider.attributes.providerRating).toFixed(2)} reviewCount={provider.attributes.providerReviewCount} />
                                            <Flex align="center" mt={1}>
                                                <Icon w={6} h={6} ml="1px" as={FaI.FaUserShield} color={provider.attributes.providerVerified ? "primary.600" : "gray.500"} />
                                                <Text ml="6px" color="gray.500" fontSize="sm">{provider.attributes.providerVerified ? "Provider verified" : "Provider unverified"}</Text>
                                            </Flex>
                                        </Box>
                                        <Spacer />
                                        <Stack mr={4}>
                                            <Avatar as="button" size="xl" name={provider.attributes.username} src={provider.attributes.profile_photo ? provider.attributes.profile_photo._url : ""} onClick={() => history.push(`/chat/you/${booking.id}`)} />
                                            {bookingStatus !== "declined" &&
                                                <Button mx={2} size="xs" minWidth="25%" color="teal.400" variant="ghost" onClick={() => history.push(`/chat/you/${booking.id}`)} style={{ display: "flex", alignItems: "center" }} ><Icon as={Io5.IoChatboxEllipsesOutline} w="24px" h="24px" mr={2} mt="1px" /> Chat</Button>
                                            }
                                        </Stack>
                                    </Center>
                                </Box>
                            }

                            <Box borderBottom="1px" pb={5} borderColor="gray.10">
                                <Flex>
                                    <Box>
                                        <Text fontWeight="300" color={grayText}>User Requirements</Text>
                                        <Text id="description">{description}</Text>
                                    </Box>
                                </Flex>
                            </Box>

                            {(bookingStatus === "approved" || bookingStatus === "paid") ?
                                <Stack spacing="6">
                                    <Box borderBottom="1px" pb={5} borderColor="gray.10">
                                        <Flex>
                                            <Box w="50%">
                                                <Text fontWeight="300" color={grayText}>Booked Rate</Text>
                                                <Text as="span" fontSize="lg" color="secondary.300" >$</Text><Text as="span" fontSize="2xl" color="secondary.300" fontWeight="600">{rate ? rate.toFixed(2) : ""}</Text><Text as="span" fontSize="sm" fontWeight="500" color="inherit"> USD/hr. </Text>
                                            </Box>
                                            <Box>
                                                <Text fontWeight="300" color={grayText}>Agreed Rate</Text>
                                                <Text as="span" fontSize="lg" color="primary.400" >$</Text><Text as="span" fontSize="2xl" color="primary.400" fontWeight="600">{rateAgreed ? rateAgreed.toFixed(2) : ""}</Text><Text as="span" fontSize="sm" fontWeight="500" color="inherit"> USD/hr. </Text>

                                            </Box>
                                        </Flex>
                                    </Box>

                                    <Box borderBottom="1px" pb={5} borderColor="gray.10">
                                        <Flex>
                                            <Box>
                                                <Text fontWeight="300" color={grayText}>Day & Start Time <Text as="span" fontSize="sm">{selectedTimezone && selectedTimezone.offset ? <>({selectedTimezone.offset < 0 ? "-" : "+"}{selectedTimezone.offset} UTC 24hr)</> : ""}</Text></Text>
                                                <ViewTimeDay dayTime={dayTime} />
                                                <Text fontSize="xs" as="i" fontWeight="200">(-)Negative or (+)positive times indicate the day before or after the day shown.</Text>
                                            </Box>
                                        </Flex>
                                    </Box>

                                    <Box borderBottom="1px" pb={5} borderColor="gray.10">
                                        <Text fontWeight="300" color={grayText}>Agreed duration of service</Text>
                                        <Flex>
                                            <Box>
                                                <Text>{Number(durationHours).toFixed(2)} Hours</Text>
                                            </Box>
                                        </Flex>
                                    </Box>

                                    <Box borderBottom="1px" pb={5} borderColor="gray.10">
                                        <Flex>
                                            <Box>
                                                <Text fontWeight="300" color={grayText}>Service Location</Text>
                                                <Text textTransform="capitalize">{serviceLocation}</Text>
                                            </Box>
                                        </Flex>
                                    </Box>

                                    <Box >
                                        <Flex>
                                            <Box>
                                                <Text fontWeight="300" color={grayText}>Providers Wallet Address</Text>
                                                <Text>{ethAddress}</Text>
                                            </Box>
                                        </Flex>
                                    </Box>
                                </Stack>
                                :
                                bookingStatus === "pending" ?
                                    <Stack spacing="6">
                                        <Box borderBottom="1px" pb={5} borderColor="gray.10">
                                            <Flex>
                                                <Box w="50%">
                                                    <Text fontWeight="300" color={grayText}>Booked Rate</Text>
                                                    <Text as="span" fontSize="lg" color="secondary.300" >$</Text><Text as="span" fontSize="2xl" color="secondary.300" fontWeight="600">{rate ? rate.toFixed(2) : ""}</Text><Text as="span" fontSize="sm" fontWeight="500" color="inherit"> USD/hr. </Text>
                                                </Box>
                                                <Box>
                                                    <Text fontWeight="300" color={grayText}>Agreed Rate</Text>
                                                    <Text>Awaiting Approval</Text>
                                                </Box>
                                            </Flex>
                                        </Box>

                                        <Box borderBottom="1px" pb={5} borderColor="gray.10">
                                            <Text fontWeight="300" color={grayText}>Day & Start Time <Text as="span" fontSize="sm">{selectedTimezone && selectedTimezone.offset ? <>({selectedTimezone.offset < 0 ? "-" : "+"}{selectedTimezone.offset} UTC 24hr)</> : ""}</Text></Text>
                                            <Flex>
                                                <Box>
                                                    <Text>Awaiting Approval</Text>
                                                </Box>
                                            </Flex>
                                        </Box>

                                        <Box borderBottom="1px" pb={5} borderColor="gray.10">
                                            <Text fontWeight="300" color={grayText}>Agreed duration of service</Text>
                                            <Flex>
                                                <Box>
                                                    <Text>Awaiting Approval</Text>
                                                </Box>
                                            </Flex>
                                        </Box>

                                        <Box borderBottom="1px" pb={5} borderColor="gray.10">
                                            <Flex>
                                                <Box>
                                                    <Text fontWeight="300" color={grayText}>Service Location</Text>
                                                    <Text>Awaiting Approval</Text>
                                                </Box>
                                            </Flex>
                                        </Box>

                                        <Box >
                                            <Flex>
                                                <Box>
                                                    <Text fontWeight="300" color={grayText}>Providers Wallet Address</Text>
                                                    <Text>Awaiting Approval</Text>
                                                </Box>
                                            </Flex>
                                        </Box>
                                    </Stack>
                                    :
                                    <>
                                    </>
                            }



                        </Stack>

                    </Stack>
                    <Container maxW="md">
                        <Flex justify="space-between" w={["100vw", "512px", "", ""]} className="bgBlur" color="gray.500" minHeight="71px" pos="fixed" bottom="0" left="50%" zIndex={2} p={4} ml={["-50vw", "-251px", "", ""]} borderTopRadius={["0", "xl", "", ""]}>
                            <Center w="100%" justify="space-between" align="center">
                                {!user ?
                                    <>
                                        <Center w="100%">
                                            <Button w="70%" color="secondary.500" bg="secondary.100" _hover={{ bg: "secondary.200" }} onClick={onOpen}>Sign in to Book Service</Button>
                                            <ModalLogin isOpen={isOpen} onClose={onClose} />
                                        </Center>
                                    </>
                                    :
                                    bookingStatus === "pending" ?
                                        <>
                                            <Box px={2}>
                                                <Text color="primary.400" lineHeight="22px" fontSize={["lg", "xl", "2xl", ""]} fontWeight="300" style={{ display: "flex", alignItems: "center" }}><Icon as={Io4.IoIosTimer} mb="2px" mr={1} />Awaiting Approval</Text>
                                            </Box>
                                        </>
                                        :
                                        bookingStatus === "approved" ?
                                            <>
                                                <Box px={2}>
                                                    <Text color="primary.500" fontSize="3xl" fontWeight="600"><Text as="span" fontSize="xl">$</Text>{rateAgreed ? (rateAgreed * durationHours).toFixed(2) : ""}<Text as="span" fontSize="sm" color={grayText}> Total</Text></Text>
                                                </Box>
                                                <Spacer />
                                                <Button w="42%" size="lg" color="green.500" bg="green.100" _hover={{ bg: "green.200" }} _focus={{ bg: "green.100" }} _active={{ bg: "green.100" }} borderRadius="md" onClick={() => history.push(`/activity/you/booked/${bookingId}/payment`)} style={{ display: "flex", alignItems: "center" }} ><Icon as={RiI.RiHandCoinLine} w="24px" h="24px" mr={2} mt="1px" /> Pay Now</Button>
                                            </>
                                            :
                                            bookingStatus === "paid" ?
                                                <>
                                                    <Box px={2}>
                                                        <Text color="green.400" lineHeight="22px" fontSize={["lg", "xl", "2xl", ""]} fontWeight="300">Paid <Text as="span" fontWeight="600">${paidAmountUsd}</Text></Text>
                                                    </Box>
                                                    <Spacer />
                                                    <Button color="primary.600" bg="primary.100" _hover={{ bg: "primary.200" }} _focus={{ bg: "primary.100" }} _active={{ bg: "primary.100" }} borderRadius="md" onClick={() => history.push(`/wallet/history/${bookingId}`)} style={{ display: "flex", alignItems: "center" }}><Icon as={BsI.BsListCheck} w="24px" h="24px" mr={2} mt="1px" /> View Payment Details</Button>
                                                </>
                                                :
                                                <>
                                                    <Box px={2}>
                                                        <Text color="crimson" lineHeight="22px" fontSize={["lg", "xl", "2xl", ""]} fontWeight="600"><Icon as={FcI.FcCancel} mr={2} mb="2px" />Booking <Text as="span" fontWeight="600">Declined</Text></Text>
                                                    </Box>
                                                </>
                                }
                            </Center>
                        </Flex>
                    </Container>

                    {showLightbox &&
                        (lightboxArray.length === 1 ?
                            <Lightbox image={lightboxArray[0].url} title={lightboxArray[0].title} onClose={() => setShowLightbox(false)} />
                            :
                            <Lightbox images={lightboxArray} onClose={() => setShowLightbox(false)} />
                        )
                    }
                </>
            }
        </>
    )
}
