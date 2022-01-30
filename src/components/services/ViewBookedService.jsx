import React, { useContext, useEffect, useState } from 'react';
import { Text, Center, Stack, Spinner, Box, Flex, IconButton, Spacer, Button, useDisclosure, Icon, Image, Container, AspectRatio, useToast, useColorMode, Avatar, ModalFooter, ModalHeader, ModalCloseButton, ModalBody, Modal, ModalOverlay, ModalContent, Input, FormControl, InputGroup, InputLeftElement, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, FormErrorMessage, FormLabel, UnorderedList, ListItem, FormHelperText, RadioGroup, Wrap, Radio, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Select } from "@chakra-ui/react";
import { useHistory, useParams, Switch, Route } from 'react-router-dom';
import { SiteStateContext } from "../context/SiteStateContext";
import { useMoralis } from "react-moralis";

import Moralis from "moralis";
import Slider from "react-slick";
import Header from '../header/Header';
import ErrorDialog from '../error/ErrorDialog';
import Lightbox from "react-awesome-lightbox";
import YouWhoLogo from "../../media/logo/YouWhoLogo.jsx";
import YouWhoLoading from '../misc/YouWhoLoading';
import TimeDayPicker from '../misc/TimeDayPicker';
import ViewTimeDay from '../misc/ViewTimeDay';
import ViewMap from "../map/ViewMap";
import Rating from "../rating/Rating";
import SuccessBox from "../error/SuccessBox";
import UserRating from "../rating/UserRating";
import * as BsI from "react-icons/bs";
import * as Io5 from "react-icons/io5";
import * as Io4 from "react-icons/io";
import * as FaI from "react-icons/fa";
import * as HiI from "react-icons/hi";
import * as TiI from "react-icons/ti";
import * as RiI from "react-icons/ri";
import * as FcI from "react-icons/fc";
// import * as MdI from "react-icons/md";



export default function ViewBookedService({ setReloadPage, grayText, grayText2, history, bookedId, booking, user, siteIsLoading, setSiteIsLoading, bookingApproval, bookingPublic, description, rate, setRate, durationHours, setDurationHours, dayTime, setDayTime, serviceLocation, setServiceLocation, ethAddress, setEthAddress, ethAddresses, bookingStatus, bookingUser, setBookingStatus, claimableAmount, reviewSuccess }) {

    const [disableEdit, setDisableEdit] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [newBookingError, setNewBookingError] = useState([]);

    // console.log("USR", user);
    // console.log("booking", booking);
    // console.log("bookingPublic", bookingPublic);
    // console.log("bookingStatus", bookingStatus);
    // console.log("bookingApproval", bookingApproval);
    // console.log("ethaddress", ethAddress);
    // console.log("service location", serviceLocation);
    // console.log("dayTime in booked service", dayTime);
    // console.log("description", description);

    const handleBookingApproved = async () => {

        try {

            setSiteIsLoading(true);

            let BookingsApproval = Moralis.Object.extend("BookingsApproval");

            const acl = new Moralis.ACL();
            acl.setPublicReadAccess(true);
            // acl.setReadAccess(provider.id, true);
            acl.setWriteAccess(user.id, true);

            let bookingApproval1;

            if (!bookingApproval) {
                bookingApproval1 = new BookingsApproval();
            } else {
                bookingApproval1 = bookingApproval;
            }
            bookingApproval1.setACL(acl);
            bookingApproval1.set('approval', "approved");
            bookingApproval1.set('bookings', booking);
            bookingApproval1.set('bookingsPublic', bookingPublic);
            bookingApproval1.set('services', bookingPublic.attributes.service);
            bookingApproval1.set('agreedRate', Number(rate));
            bookingApproval1.set('agreedHours', String(durationHours));
            bookingApproval1.set('agreedDayTime', dayTime);
            bookingApproval1.set('agreedLocation', serviceLocation);
            bookingApproval1.set('providerEthAddress', ethAddress);

            await bookingApproval1.save();

            setBookingStatus("approved");
            setSiteIsLoading(false);
            setReloadPage(true);

        } catch (error) {
            console.log(error);
            setSiteIsLoading(false);
        }
    }

    const handleBookingDeclined = async () => {

        try {
            setSiteIsLoading(true);

            let BookingsApproval = Moralis.Object.extend("BookingsApproval");
            let bookingApproval1 = new BookingsApproval;
            bookingApproval1.set('approval', "declined");
            bookingApproval1.set('bookings', booking);

            await bookingApproval1.save();

            setBookingStatus("declined");
            setSiteIsLoading(false);
            setReloadPage(true);

        } catch (error) {
            console.log(error);
            setSiteIsLoading(false);
        }

    }


    useEffect(() => {
        if (document.getElementById("description") && description) {
            document.getElementById("description").innerHTML = description;
        }
    }, [description]);

    console.log("booking", booking)

    return (
        <>
            {showAlert && (<ErrorDialog title={newBookingError[0]} message={newBookingError[1]} showAlert={showAlert} setShowAlert={setShowAlert} />)}
            {siteIsLoading ?
                <YouWhoLoading />
                :
                <>
                    <Flex mb={3} mr={1} color={grayText2} align="center">
                        <Text fontWeight="400" fontSize="3xl" ml={1} color={bookingStatus === "declined" ? "crimson" : "inherit"} style={{ display: "flex", alignItems: "center" }}><Icon as={TiI.TiBookmark} color="teal.300" mr={2} />Users Booking</Text>
                        <Spacer />
                        <IconButton icon={<Io5.IoArrowBack />} size="sm" mr={2} variant="ghost" fontSize="24px" onClick={() => { history.push("/activity/who/bookings"); }} />
                    </Flex>

                    <Stack spacing="6">

                        {(bookingStatus === "paid" && claimableAmount > 0) && <SuccessBox status={`success`} title={`Booking Paid`} message={<>The User has paid for this booking. You are eligble to claim <b>{Number(claimableAmount / 10 ** 18).toFixed(4)} YOU</b> tokens. Click the Review User button below to review the User and claim your tokens!</>} setUpdateSuccess={() => { }} />}

                        <Flex role="button" onClick={() => { history.push(`/activity/who/myservices/${booking.attributes.service.id}`); window.scrollTo(0, 0); }} bg="gray.5" borderRadius="md" overflow="hidden" align="center">
                            <Box minWidth={["29vw", "120px", ""]} minHeight={["29vw", "120px", ""]} >
                                {booking.attributes.service.attributes.service_img1 ? (
                                    <Image w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} objectFit="cover" src={booking.attributes.service.attributes.service_img1._url} fallback={<Center w={["29vw", "120px", ""]} h={["29vw", "120px", ""]}><Spinner /></Center>} borderLeftRadius="md" />
                                ) : (
                                    <Center filter="grayscale(1)" bg="gray.5" w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} >
                                        <YouWhoLogo opacity="0.2" wdth={["68%", "", ""]} />
                                    </Center>
                                )}
                            </Box>
                            <Box textAlign="left" px={3} maxHeight={["29vw", "120px", ""]} overflow="auto">
                                {/* <Text id={"id" + i} key={"id" + i}>ID: {x.id}</Text> */}
                                <Text fontWeight="500" textTransform="capitalize" fontSize="sm">{booking.attributes.service.attributes.title}</Text>
                                <Text color={grayText} textTransform="capitalize" fontSize="xs">{booking.attributes.service.attributes.category} {booking.attributes.service.attributes.subCategory ? <Text as="span">&bull;</Text> : ""} {booking.attributes.service.attributes.subCategory}</Text>
                                <Text color="primary.500" textTransform="capitalize" fontSize="xl" fontWeight="500"><Text as="span" fontSize="md">$</Text>{booking.attributes.service.attributes.rate}<Text as="span" fontSize="xs" color={grayText}> USD/hr.</Text></Text>
                            </Box>
                        </Flex>

                        <Stack px={2} spacing="6">

                            <Box borderBottom="1px" pb={5} borderColor="gray.10" >
                                <Text fontWeight="300" color={grayText} mb={1}>Booking #</Text>
                                <Text fontSize="xl" fontWeight="500">{bookedId}</Text>
                            </Box>

                            {bookingUser &&
                                <Box borderBottom="1px" pb={5} borderColor="gray.10" >
                                    <Center>
                                        <Box>
                                            <Text fontWeight="300" color={grayText}>Service booked by</Text>
                                            <Text fontSize="xl" fontWeight="500">{bookingUser.attributes.username}</Text>
                                            <UserRating rating={Number(bookingUser.attributes.userRating).toFixed(2)} reviewCount={bookingUser.attributes.userReviewCount} />
                                            <Flex align="center" mt={1}>
                                                <Icon w={6} h={6} ml="1px" as={FaI.FaUserShield} color={bookingUser.attributes.userVerified ? "primary.600" : "gray.500"} />
                                                <Text ml="6px" color="gray.500" fontSize="sm">{bookingUser.attributes.userVerified ? "User verified" : "User unverified"}</Text>
                                            </Flex>
                                        </Box>
                                        <Spacer />
                                        <Stack mr={4}>
                                            <Avatar size="xl" as="button" onClick={() => history.push(`/chat/who/${booking.id}`)} name={bookingUser.attributes.username} src={bookingUser.attributes.profile_photo ? bookingUser.attributes.profile_photo._url : ""} />
                                            {bookingStatus !== "declined" &&
                                                <Button mx={2} size="xs" minWidth="25%" color="teal.400" variant="ghost" onClick={() => history.push(`/chat/who/${booking.id}`)} ><Icon as={Io5.IoChatboxEllipsesOutline} w="24px" h="24px" mr={2} mt="1px" /> Chat</Button>
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
                        </Stack>

                        {bookingStatus === "pending" &&
                            <Stack bg="gray.10" p={4} borderRadius="md" >
                                <Text>If you have discussed the booking with the <Text as="span" color="secondary.300" fontWeight="600">User</Text> and have agreed on : </Text>
                                <UnorderedList px={8}>
                                    <ListItem>Hourly <Text as="span" color="primary.500" fontWeight="600">Rate</Text></ListItem>
                                    <ListItem>Approximate number of <Text as="span" color="primary.500" fontWeight="600">Hours Required</Text></ListItem>
                                    <ListItem><Text as="span" color="primary.500" fontWeight="600">Day & Time</Text> to provide service</ListItem>
                                    <ListItem><Text as="span" color="primary.500" fontWeight="600">Service Location</Text></ListItem>
                                    <ListItem><Text as="span" color="primary.500" fontWeight="600">Avalanche Address</Text> to receive payment</ListItem>
                                </UnorderedList>
                                <Text>Please approve the booking by clicking on the <Text as="span" color="primary.500" fontWeight="600">Approve</Text> button below.</Text>
                                <Stack borderBottom="1px" borderColor="gray.10"></Stack>
                                <Text>If you have agreed with the <Text as="span" color="secondary.300" fontWeight="600">User</Text> to edit the booking then click on the <Text as="span" color="primary.300" fontWeight="600">Edit</Text> button then click <Text as="span" color="secondary.300" fontWeight="600">Save</Text>. After saving the new booking details click <Text as="span" color="primary.500" fontWeight="600">Approve</Text>.</Text>
                                <Stack borderBottom="1px" borderColor="gray.10"></Stack>
                                <Text>Otherwise if you would like to decline the booking then click the <Text as="span" color="crimson" fontWeight="600">Decline</Text> button below.</Text>
                            </Stack>
                        }

                        {bookingStatus !== "declined" &&
                            <Stack px={2} spacing="6">

                                <FormControl id="rate" isRequired={bookingStatus === "pending" ? true : false}>

                                    <FormLabel fontWeight="500" color={disableEdit ? "gray.500" : "primary.300"}>Rate (USD per hour)</FormLabel>
                                    <InputGroup width="45%">
                                        <InputLeftElement pointerEvents="none" children="$" fontSize="sm" />
                                        <NumberInput min={1} variant="flushed" value={rate} fontSize="lg" isReadOnly={disableEdit} precision={2}>
                                            <NumberInputField id="numberInputField2" pl={7} placeholder="1.0 min." fontSize="lg" onChange={(e) => setRate(e.target.value)} />
                                            <NumberInputStepper >
                                                <NumberIncrementStepper color="gray.500" onClick={disableEdit ? () => { } : () => setRate(String(Number(document.getElementById("numberInputField2").value) + .5))} />
                                                <NumberDecrementStepper color="gray.500" onClick={disableEdit ? () => { } : () => setRate(String(Number(document.getElementById("numberInputField2").value) - .5))} />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </InputGroup>
                                    <FormErrorMessage>Please provide a rate for your service.</FormErrorMessage>
                                </FormControl>

                                <FormControl id="durationHours" isRequired={bookingStatus === "pending" ? true : false}>
                                    <FormLabel fontWeight="500" color={disableEdit ? "gray.500" : "primary.300"}>Agreed duration of service (hours)</FormLabel>
                                    <InputGroup width="45%">
                                        <NumberInput min={1} variant="flushed" value={durationHours} fontSize="lg" isReadOnly={disableEdit} precision={2} isInvalid={durationHours.length > 10 ? true : false}>
                                            <NumberInputField id="hoursInput" pl={7} placeholder="1.0 min." fontSize="lg" onChange={(e) => setDurationHours(e.target.value)} />
                                            <NumberInputStepper >
                                                <NumberIncrementStepper color="gray.500" onClick={disableEdit ? () => { } : () => setDurationHours(String(Number(document.getElementById("hoursInput").value) + .5))} />
                                                <NumberDecrementStepper color="gray.500" onClick={disableEdit ? () => { } : () => setDurationHours(String(Number(document.getElementById("hoursInput").value) - .5))} />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </InputGroup>
                                    <FormErrorMessage>Please provide a duration for your service in hours.</FormErrorMessage>
                                </FormControl>

                                <FormControl id="dayTime" isRequired={bookingStatus === "pending" ? true : false}>
                                    <FormLabel fontWeight="500" mt={1} color={disableEdit ? "gray.500" : "primary.300"}>Day and Time Available</FormLabel>
                                    <FormHelperText as="i">(-)Negative or (+)positive times indicate the day before or after the day shown.</FormHelperText>
                                    <Stack>
                                        <TimeDayPicker disableEdit={disableEdit} dayTime={dayTime} setDayTime={setDayTime} />
                                    </Stack>
                                    <FormHelperText>You must click the save icon after completing your availability, otherwise the dates and times will NOT be saved.</FormHelperText>
                                </FormControl>

                                <FormControl id="location" isRequired={bookingStatus === "pending" ? true : false}>
                                    <FormLabel fontWeight="500" color={disableEdit ? "gray.500" : "primary.300"}>Service Location</FormLabel>
                                    <RadioGroup onChange={setServiceLocation} value={serviceLocation} mb={2}>
                                        <Wrap spacing="4" overflow="visible">
                                            <Radio value="users" isReadOnly={disableEdit} >Users</Radio>
                                            <Radio value="providers" isReadOnly={disableEdit} >Mine</Radio>
                                            <Radio value="global" isReadOnly={disableEdit} >Global</Radio>
                                            <Radio value="other" isReadOnly={disableEdit} >Other</Radio>
                                        </Wrap>
                                    </RadioGroup>
                                </FormControl>

                                <FormControl id="ethAddress" isRequired={bookingStatus === "pending" ? true : false}>
                                    <FormLabel fontWeight="500" mt={1} color={disableEdit ? "gray.500" : "primary.300"}>Avalanche Address</FormLabel>
                                    <Stack spacing={3}>
                                        <Select variant="flushed" isDisabled={disableEdit} placeholder={ethAddress} value={ethAddress} onChange={e => setEthAddress(e.target.value)} />
                                        <>
                                            {ethAddresses.map(x => {
                                                <option key={x} value={x}>{x}</option>
                                            })}
                                        </>
                                    </Stack>
                                </FormControl>

                            </Stack>
                        }

                    </Stack>

                    <Container maxW="md">
                        <Flex justify="space-between" w={["100vw", "512px", "", ""]} className="bgBlur" color="gray.500" minHeight="71px" pos="fixed" bottom="0" left="50%" zIndex={2} p={4} ml={["-50vw", "-251px", "", ""]} borderTopRadius={["0", "xl", "", ""]}>
                            <Center w="100%" justify="space-between" align="center">
                                {bookingStatus === "pending" ?
                                    disableEdit ?
                                        <>
                                            <ConfirmApproval handleBookingApproved={handleBookingApproved} siteIsLoading={siteIsLoading} />
                                            <Spacer />
                                            <Button color="primary.600" bg="primary.200" _hover={{ bg: "primary.300" }} _focus={{ bg: "primary.200" }} _active={{ bg: "primary.200" }} borderRadius="md" onClick={() => setDisableEdit(false)} style={{ display: "flex", alignItems: "center" }}><Icon as={Io5.IoHammerOutline} w="24px" h="24px" mr={2} mt="1px" /> Edit</Button>
                                            <Spacer />
                                            <ConfirmDecline handleBookingDeclined={handleBookingDeclined} siteIsLoading={siteIsLoading} />                                        </>
                                        :
                                        <>
                                            <Button color="secondary.500" bg="secondary.100" _hover={{ bg: "secondary.200" }} _focus={{ bg: "secondary.100" }} _active={{ bg: "secondary.100" }} borderRadius="md" onClick={() => setDisableEdit(true)} style={{ display: "flex", alignItems: "center" }}><Icon as={Io5.IoSaveOutline} w="24px" h="24px" mr={2} mt="1px" /> Save</Button>
                                        </>
                                    :
                                    bookingStatus === "approved" ?
                                        <>
                                            <Box px={2}>
                                                <Text color="primary.500" lineHeight="22px" fontSize={["lg", "xl", "2xl", ""]} fontWeight="300" style={{ display: "flex", alignItems: "center" }}><Icon as={Io4.IoMdCheckmarkCircleOutline} mb="2px" mr={1} />Booking <Text as="span" fontWeight="600">Approved</Text></Text>
                                            </Box>
                                            <Spacer />
                                            <Button w="30%" color="green.600" bg="teal.100" _hover={{ bg: "teal.200" }} _focus={{ bg: "teal.100" }} _active={{ bg: "teal.100" }} borderRadius="md" onClick={() => history.push(`/chat/who/${booking.id}`)} ><Icon as={Io5.IoChatboxEllipsesOutline} w="24px" h="24px" mr={2} mt="1px" /> Chat</Button>
                                        </>
                                        :
                                        bookingStatus === "paid" ?
                                            <>
                                                <Box px={2}>
                                                    <Text color="green.400" lineHeight="22px" fontSize={["lg", "xl", "2xl", ""]} fontWeight="300">Booking <Text as="span" fontWeight="600">Paid</Text></Text>
                                                </Box>
                                                <Spacer />
                                                {claimableAmount > 0 ?
                                                    <Button color="primary.600" bg="primary.200" _hover={{ bg: "primary.300" }} _focus={{ bg: "primary.200" }} _active={{ bg: "primary.200" }} borderRadius="md" onClick={() => history.push(`/activity/who/bookings/${bookedId}/review`)} style={{ display: "flex", alignItems: "center" }}><Icon as={BsI.BsListCheck} w="24px" h="24px" mr={2} mt="1px" /> Review User</Button>
                                                    :
                                                    <Button color="primary.600" bg="primary.100" _hover={{ bg: "primary.200" }} _focus={{ bg: "primary.100" }} _active={{ bg: "primary.100" }} borderRadius="md" onClick={() => history.push(`/wallet/main`)} style={{ display: "flex", alignItems: "center" }}><Icon as={BsI.BsListCheck} w="24px" h="24px" mr={2} mt="1px" /> Go To Wallet</Button>
                                                }
                                            </>
                                            :
                                            <>
                                                <Box px={2}>
                                                    <Text color="crimson" lineHeight="22px" fontSize={["lg", "xl", "2xl", ""]} fontWeight="300">Booking <Text as="span" fontWeight="600">Declined</Text></Text>
                                                </Box>
                                            </>

                                }
                            </Center>
                        </Flex>
                    </Container>
                </>
            }
        </>
    )
}


function ConfirmApproval({ handleBookingApproved, siteIsLoading }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    return (
        <>
            <Button mx={2} minWidth="25%" color="primary.600" bg="primary.100" _hover={{ bg: "primary.200" }} _focus={{ bg: "primary.100" }} _active={{ bg: "primary.100" }} onClick={onOpen} style={{ display: "flex", alignItems: "center" }}><Icon as={Io4.IoMdCheckmarkCircleOutline} w="24px" h="24px" mr={2} mt="1px" /> Approve</Button>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent m={3} borderRadius="lg" className="bgBlurModal">
                    <AlertDialogHeader style={{ display: "flex", alignItems: "center" }}><Icon as={Io4.IoMdCheckmarkCircleOutline} color="primary.600" w={6} h={6} mr={2} />Approve</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        Are you sure you want to <Text as="span" color="primary.500" fontWeight="600">Approve</Text> the booking?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button color="primary.600" bg="primary.100" _hover={{ bg: "primary.200" }} _focus={{ bg: "primary.100" }} _active={{ bg: "primary.100" }} isLoading={siteIsLoading} ref={cancelRef} onClick={handleBookingApproved} >
                            Yes
                        </Button>
                        <Button color="crimson" bg="red.100" _hover={{ bg: "red.200" }} _focus={{ bg: "red.100" }} _active={{ bg: "red.100" }} ml={3} isLoading={siteIsLoading} onClick={onClose}>
                            No
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

function ConfirmDecline({ handleBookingDeclined, siteIsLoading }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    return (
        <>
            <Button mx={2} minWidth="25%" color="crimson" bg="red.100" _hover={{ bg: "red.200" }} _focus={{ bg: "red.100" }} _active={{ bg: "red.100" }} onClick={onOpen}><Icon as={FcI.FcCancel} w="24px" h="24px" mr={2} mt="1px" color="secondary.100" /> Decline</Button>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent m={3} borderRadius="lg" className="bgBlurModal">
                    <AlertDialogHeader style={{ display: "flex", alignItems: "center" }}><Icon as={FcI.FcCancel} w={6} h={6} mr={2} />Decline Booking</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        Are you sure you want to <Text as="span" color="crimson" fontWeight="600">Decline</Text> the booking?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button color="crimson" bg="red.100" _hover={{ bg: "red.200" }} _focus={{ bg: "red.100" }} _active={{ bg: "red.100" }} isLoading={siteIsLoading} ref={cancelRef} onClick={handleBookingDeclined}>
                            Yes
                        </Button>
                        <Button color="primary.600" bg="primary.100" _hover={{ bg: "primary.200" }} _focus={{ bg: "primary.100" }} _active={{ bg: "primary.100" }} ml={3} isLoading={siteIsLoading} onClick={onClose}>
                            No
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}