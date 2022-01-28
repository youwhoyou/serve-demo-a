import React, { useState } from 'react'
import { Button, Center, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import * as HiI from "react-icons/hi";
import GoogleMaps from './GoogleMaps';
import ErrorDialog from "../error/ErrorDialog";



export default function GetLocation({ myLat, setMyLat, myLong, setMyLong, disableEdit }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newServiceError, setNewServiceError] = useState([]);
    const [showAlert, setShowAlert] = useState(false);

    // console.log("myLat myLong from GeoLocation", myLat, myLong);

    function getLocation(x) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            setNewServiceError(["Geolocation Failed", "Geolocation is not supported by this browser."]);
            setShowAlert(true);
        }
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                setNewServiceError(["Geolocation Failed", "Please allow location or GPS in your web-browser or device."]);
                setShowAlert(true);
                break;
            case error.POSITION_UNAVAILABLE:
                setNewServiceError(["Geolocation Failed", "Location information is unavailable."]);
                setShowAlert(true);
                break;
            case error.TIMEOUT:
                setNewServiceError(["Geolocation Failed", "The request to get user location timed out."]);
                setShowAlert(true);
                break;
            case error.UNKNOWN_ERROR:
                setNewServiceError(["Geolocation Failed", "An unknown error occurred."]);
                setShowAlert(true);
                break;
            default:
                setNewServiceError(["Geolocation Failed", "Please allow location/GPS in your web-browser/app."]);
                setShowAlert(true);
                break;
        }
    }

    function showPosition(position) {
        setMyLat(String(position.coords.latitude));
        setMyLong(String(position.coords.longitude));
    }

    return (
        <>
            <Button minWidth="50%" id="getLocationButton" fontWeight="400" isDisabled={disableEdit} color="primary.600" bg="primary.100" _hover={{ bg: "primary.200" }} _focus={{ bg: "primary.100" }} _active={{ bg: "primary.100" }} onClick={onOpen} mb={2}>Get My Location</Button>

            <Modal isOpen={isOpen} size="lg" onClose={onClose} >
                <ModalOverlay />
                <ModalContent minHeight="200px" borderRadius="xl" p={2} mx={3} mt="10%" className="bgBlurModal">
                    {showAlert && (<ErrorDialog title={newServiceError[0]} message={newServiceError[1]} showAlert={showAlert} setShowAlert={setShowAlert} />)}
                    <ModalHeader p={4} fontWeight="400" style={{ display: "flex", alignItems: "center" }}><Icon as={HiI.HiOutlineBadgeCheck} color="primary.400" mr={1} h="24px" w="24px" />Get My Location</ModalHeader>
                    <ModalCloseButton m={3} onClick={() => { onClose(); setMyLat(""); setMyLong(""); }} />
                    <ModalBody px={4} id="getLocation">
                        <Text>Click "Get My Location" button below to find your approximate location, then tap once on the map to place a pin at your exact location.</Text>
                        <Center mt={3}>
                            <GoogleMaps myLat={myLat} myLong={myLong} setMyLat={setMyLat} setMyLong={setMyLong} />
                        </Center>
                        <Center mt={5} mb={2}>
                            <Button minWidth="50%" variant="outline" fontWeight="400" color="secondary.300" onClick={getLocation} mb={2}>Get My Location</Button>
                        </Center>
                        <Text>My Latitude: <Text as="span" fontWeight="600" color="primary.400">{myLat}</Text></Text>
                        <Text>My Longitude: <Text as="span" fontWeight="600" color="primary.400">{myLong}</Text></Text>

                    </ModalBody>
                    <ModalFooter p={4}>
                        <Button color="primary.600" bg="primary.100" _hover={{ bg: "primary.200" }} _focus={{ bg: "primary.100" }} _active={{ bg: "primary.100" }} mr={3} onClick={onClose}>
                            Save
                        </Button>
                        <Button onClick={() => { onClose(); setMyLat(""); setMyLong(""); }}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )

}
