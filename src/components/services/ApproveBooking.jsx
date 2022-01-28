import React, { useContext, useEffect, useState } from 'react';
import { Text, Center, Stack, Spinner, Box, Flex, IconButton, Spacer, Button, useDisclosure, Icon, Image, Container, AspectRatio, useToast, useColorMode, Avatar, ModalFooter, ModalHeader, ModalCloseButton, ModalBody, Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { useMoralis } from "react-moralis";
import YouWhoLoading from '../misc/YouWhoLoading';
import ErrorDialog from '../error/ErrorDialog';
import * as BsI from "react-icons/bs";
import * as Io5 from "react-icons/io5";
import * as FaI from "react-icons/fa";
import * as HiI from "react-icons/hi";
// import * as TiI from "react-icons/ti";
import * as RiI from "react-icons/ri";


export default function ApproveBooking({ siteIsLoading, setSiteIsLoading, bookSuccess, history, grayText2, bookedId }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [bookedService, setBookedService] = useState("");
    const [showAlert, setShowAlert] = useState("");
    const [newBookingError, setNewBookingError] = useState("");
    const { Moralis } = useMoralis();

    const approveBooking = async () => {

        await Moralis.Cloud.run("setApproveBooking", { bookedId }).then(async () => {

        }).catch((error) => {
            console.log(error);
        })

    }


    useEffect(() => {

        setSiteIsLoading(true);

        try {

            (async () => {
                let Bookings = Moralis.Object.extend("Bookings");
                const queryBookings = new Moralis.Query(Bookings);
                queryBookings.equalTo("objectId", bookedId);

                await queryBookings.first()
                    .then((result) => {
                        console.log("RESULTSLS", result)
                        if (result) {

                            setBookedService(result);
                            setSiteIsLoading(false);
                        }
                    })
                    .catch((error) => {
                        setNewBookingError(["Booking Not Found", error.message]);
                        setShowAlert(true);
                        setSiteIsLoading(false);
                    });
            })();


        } catch (error) {
            setNewBookingError(["Booking Not Found", error.message]);
            setShowAlert(true);
            setSiteIsLoading(false);
        }


        // eslint-disable-next-line
    }, []);



    return (
        <>
            {showAlert && (<ErrorDialog title={newBookingError[0]} message={newBookingError[1]} showAlert={showAlert} setShowAlert={setShowAlert} />)}
            {siteIsLoading ?
                <YouWhoLoading />
                :
                <>
                    <Flex mb={3} mr={1} color={grayText2} align="center">
                        <Text fontWeight="400" fontSize="3xl" ml={1} style={{ display: "flex", alignItems: "center" }} ><Icon as={BsI.BsListCheck} color="primary.400" mr={2} />Approve Booking</Text>
                        <Spacer />
                        <IconButton icon={<Io5.IoArrowBack />} size="sm" mr={2} variant="ghost" fontSize="24px" onClick={() => { history.goBack(); }} />
                    </Flex>

                    <Stack spacing="6">
                        <Button color="primary.600" bg="primary.100" _hover={{ bg: "primary.200" }} _focus={{ bg: "primary.100" }} _active={{ bg: "primary.100" }} borderRadius="md" onClick={onOpen} ><Icon as={RiI.RiHandCoinLine} w="24px" h="24px" mr={1} /> Approve Booking</Button>
                        <Button color="crimson" bg="red.200" _hover={{ bg: "red.300" }} _focus={{ bg: "red.200" }} _active={{ bg: "red.200" }} borderRadius="md" onClick={onOpen} ><Icon as={RiI.RiHandCoinLine} w="24px" h="24px" mr={1} /> Decline Booking</Button>
                    </Stack>

                    <Modal isOpen={isOpen} size="lg" onClose={bookSuccess ? () => { onClose(); window.scrollTo(0, 0); window.location.reload(); } : () => { onClose(); }} >
                        <ModalOverlay />
                        <ModalContent minHeight="200px" borderRadius="xl" p={2} mx={3} mt="10%">
                            {bookSuccess ?
                                <>
                                    <ModalHeader p={4} fontWeight="400" style={{ display: "flex", alignItems: "center" }}><Icon as={FaI.FaRegHandSpock} color="secondary.300" mr={1} h="24px" w="24px" />Confirm Payment</ModalHeader>
                                    <ModalCloseButton m={3} onClick={() => { onClose(); window.scrollTo(0, 0); window.location.reload(); }} />
                                    <ModalBody px={4} id="categoryButtons">
                                        Your service booking was successful. Click OK view your rewards.
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button colorScheme="primary" onClick={() => { onClose(); }}>OK</Button>
                                    </ModalFooter>
                                </>
                                :
                                <>
                                    <ModalHeader p={4} fontWeight="400" style={{ display: "flex", alignItems: "center" }}><Icon as={HiI.HiOutlineBadgeCheck} color="primary.300" mr={1} h="24px" w="24px" />Confirm Booking</ModalHeader>
                                    <ModalCloseButton m={3} onClick={() => { onClose(); }} />
                                    <ModalBody px={4} id="categoryButtons">
                                        Please confirm you would like to book this service.
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button colorScheme="primary" onClick={() => { }} mr={2} isLoading={siteIsLoading}>Confirm</Button>
                                        <Button onClick={() => { onClose(); }}>Cancel</Button>
                                    </ModalFooter>
                                </>
                            }
                        </ModalContent>
                    </Modal>
                </>
            }
        </>
    )
}