import React, { useContext, useEffect, useState } from 'react';
import Moralis from "moralis";
import { useMoralis, useMoralisFile, useMoralisQuery, useMoralisSubscription } from "react-moralis";
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Button, List, Divider, Box, Link, Center, Container, Text, Icon, IconButton, useColorModeValue, Stack, useDisclosure, Flex, Avatar, Input, Spacer, AvatarBadge, Spinner, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton, InputRightElement, InputGroup, useColorMode, Switch, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from "@chakra-ui/react";
import Header from '../header/Header';
import FootNav from '../footnav/FootNav';
import ErrorBox from "../error/ErrorBox";
import SuccessBox from "../error/SuccessBox";
import * as BiI from "react-icons/bi";
import * as BsI from "react-icons/bs";
import * as Io5 from "react-icons/io5";
import * as Io4 from "react-icons/io";
import * as VsC from "react-icons/vsc";
import * as AiI from 'react-icons/ai';
import * as GoI from 'react-icons/go';
import { SiteStateContext } from "../context/SiteStateContext";




export default function Events() {

    const { user } = useMoralis();
    const { colorMode } = useColorMode();
    const { newEvent, setNewEvent } = useContext(SiteStateContext);
    const history = useHistory();
    const [newEvents, setNewEvents] = useState([]);
    const [oldEvents, setOldEvents] = useState([]);
    const [events, setEvents] = useState("");


    useMoralisSubscription("Events", q => q.equalTo("user", user), [], {
        onCreate: data => { setNewEvents(data.attributes.newEvents); setOldEvents(data.attributes.oldEvents); },
        onUpdate: data => { setNewEvents(data.attributes.newEvents); setOldEvents(data.attributes.oldEvents); },
    });

    //   console.log("liveData", data)

    // console.log("newEvent", newEvent)
    // console.log("newEvents", newEvents)
    // console.log("oldEvents", oldEvents)
    // console.log("events", events)

    useEffect(() => {

        (async () => {
            await loadEvents();

        })();

    }, [])


    const loadEvents = async () => {
        try {
            const Events = Moralis.Object.extend("Events");
            const queryUserEvents = new Moralis.Query(Events);
            queryUserEvents.equalTo("user", user);
            let userEvents = await queryUserEvents.first();

            if (userEvents) {
                // console.log("userEvents", userEvents)
                setEvents(userEvents);
                setNewEvents(userEvents.attributes.newEvents);
                setOldEvents(userEvents.attributes.oldEvents);
                if (userEvents.attributes.newEvents.length > 0) {
                    setNewEvent(true);
                }
            } else {

                const Events = Moralis.Object.extend("Events");
                const acl = new Moralis.ACL();
                acl.setPublicReadAccess(false);
                acl.setReadAccess(user.id, true);
                acl.setWriteAccess(user.id, true);

                const event = new Events();
                // event.setACL(acl);
                event.set('user', user);
                event.set('newEvents', [{ id: Date.now(), title: "Welcome to YouWho.io", detail: "Thank you very much for joining us, we hope you find our Decentralized Service Marketplace useful!", link: "/activity" }])
                await event.save().then(() => {
                    // console.log("create new event success")
                    window.location.reload();
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleReadAll = async () => {

        if (newEvents.length > 0) {

            let oldEventsArray = newEvents.concat(oldEvents);

            events.set("newEvents", []);
            events.set("oldEvents", oldEventsArray);
            await events.save().then(async () => {
                console.log("update event success")
                await loadEvents();
            });

        }
        setNewEvent(false);
    }

    const grayText = colorMode === "light" ? "gray.500" : "gray.400";
    const grayText2 = colorMode === "light" ? "gray.600" : "gray.100";
    const newEventBgUser = colorMode === "light" ? "secondary.100" : "secondary.600";
    // const newEventTextUser = colorMode !== "light" ? "secondary.200" : "secondary.500";
    const newEventBgProvider = colorMode === "light" ? "primary.100" : "primary.700";
    // const newEventTextProvider = colorMode !== "light" ? "primary.200" : "primary.600";;
    const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(249,249,249,0.07) 50%, rgba(249,249,249,0.0) 100%)";

    // const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(249,249,249,0.07) 50%, rgba(249,249,249,0.0) 100%)";

    const bgGradientDark = "radial-gradient(circle at 80vw -30vh, rgba(0,201,153, 0.25) 0%, rgba(13,110,253,0.15) 35%, rgba(19,19,19,0.5) 100%)";
    const bg = useColorModeValue(bgGradientLight, bgGradientDark);

    return (
        <Box w="100%" minH="100vh" minW="100vw" h="100%" p={0} bg={bg} border={0}>
            <Header bgSearch={[colorMode === "light" ? "gray.50" : "gray.900", "none", "", ""]} />
            <Box p={[0, 4, 6, 8]} minH="100%">
                <Container minHeight={["91vh", "200px", "200px", "200px"]} maxW="lg" borderRadius={["0", "xl", "xl", "xl"]} px={[4, 6, "", ""]} pb={[4, 6, "", ""]} pt={[1, 5, "", ""]} mb={["60px", "0", "", ""]} >
                    <Center mb={1} mr={1} color={grayText2}>
                        <Text fontWeight="400" fontSize="3xl" ml={1} color={grayText2} style={{ display: "flex", alignItems: "center" }}><Icon as={newEvent ? BiI.BiCommentError : BiI.BiCommentDetail} color={newEvent ? "red.400" : "primary.400"} mr={2} />{newEvent ? "New Events" : "My Events"}</Text>
                        <Spacer />
                        <Button variant="ghost" display={["block", "none", "", ""]} fontWeight="400" onClick={handleReadAll}><Icon as={Io5.IoMailOpenOutline} w={5} h={5} mb="4px" mr={1} /></Button>
                        <Button variant="ghost" display={["none", "block", "", ""]} fontWeight="400" onClick={handleReadAll}><Icon as={Io5.IoMailOpenOutline} w={5} h={5} mb="4px" mr={1} />Read All</Button>
                        <Divider orientation="vertical" h="24px" borderColor="gray.500" />
                        <IconButton icon={<Io5.IoArrowBack />} size="sm" ml={1} variant="ghost" fontSize="24px" onClick={() => { history.push("/account/profile"); }} />
                    </Center>
                    <Stack>
                        <Accordion defaultIndex={[0]} allowMultiple >
                            <AccordionItem borderWidth="0px">
                                <AccordionButton px={1} py={3} _hover={{ bg: "none" }}>
                                    <Box flex="1" textAlign="left">
                                        <Text color="primary.400" fontWeight="600" fontSize="lg">New Events</Text>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel px={0} pt={0} pb={3}>
                                    <Stack spacing="3">
                                        {newEvents.map((x, i) =>
                                            <Box as={RouterLink} key={i + "link"} to={x.link} p={4} bg={x.side === "user" ? "secondary.100" : "primary.200"} borderRadius="md">
                                                <Text key={i + "title"} mb={2} fontWeight="600" color="gray.700"><Icon as={AiI.AiOutlineExclamationCircle} mr={2} h={6} w={6} mb="2px" />{x.title}</Text>
                                                <Text key={i + "detail"} color="gray.800">{x.detail}</Text>
                                            </Box>
                                        )}
                                    </Stack>
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem borderBottom="0px">
                                <AccordionButton px={1} py={3} _hover={{ bg: "none" }}>
                                    <Box flex="1" textAlign="left">
                                        <Text color={grayText2}>Old Events</Text>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel px={0} pt={0} pb={3}>
                                    <Stack spacing="3">
                                        {oldEvents.map((x, i) =>
                                            <Box as={RouterLink} key={i + "link"} to={x.link} p={4} bg={x.side === "user" ? "gray.5" : "gray.10"} borderRadius="md">
                                                <Text key={i + "title"} mb={2} fontWeight="600"><Icon as={AiI.AiOutlineFolder} mr={2} h={6} w={6} mb="3px" />{x.title}</Text>
                                                <Text key={i + "detail"}>{x.detail}</Text>
                                            </Box>
                                        )}
                                    </Stack>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </Stack>
                </Container>
            </Box>
            <FootNav />
        </Box>
    )
}

function SaveChanges({ handleSave, isUserUpdating, isUploading }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    return (
        <>
            <Button colorScheme="primary" onClick={onOpen} isLoading={isUserUpdating} isDisabled={isUploading} >Save<Icon as={Io5.IoSaveOutline} w={6} h={6} ml={2} /></Button>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent m={3} borderRadius="lg" className="bgBlurModal">
                    <AlertDialogHeader style={{ display: "flex", alignItems: "center" }}><Icon as={Io5.IoSaveOutline} w={6} h={6} mr={2} />Save Changes</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        Do you want to save changes?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button color="primary.600" bg="primary.100" _hover={{ bg: "primary.200" }} _focus={{ bg: "primary.100" }} _active={{ bg: "primary.100" }} ref={cancelRef} onClick={() => { handleSave(); onClose(); }}>
                            Yes
                        </Button>
                        <Button color="secondary.500" bg="secondary.100" _hover={{ bg: "secondary.200" }} _focus={{ bg: "secondary.100" }} _active={{ bg: "secondary.100" }} ml={3} onClick={onClose}>
                            No
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
