import React, { useContext, useEffect, useState } from 'react';
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useHistory, useParams, Route, Switch as RouterSwitch, useLocation, Redirect } from 'react-router-dom';
import { Box, Button, Container, Text, Icon, useColorModeValue, Stack, useColorMode, Flex, Spacer, Switch, useToast, Center, Spinner, Image, Avatar } from "@chakra-ui/react";
import Header from '../header/Header';
import FootNav from '../footnav/FootNav';
import * as Io5 from "react-icons/io5";
import * as AiI from "react-icons/ai";
import { SiteStateContext } from "../context/SiteStateContext";
import YouChat from '../chat/YouChat';
import WhoChat from '../chat/WhoChat';
import Moralis from 'moralis';
import YouWhoLoading from '../misc/YouWhoLoading';
import YouWhoLogo from '../../media/logo/YouWhoLogo';



export default function Chat() {

    const { user, web3 } = useMoralis();
    const { booking, side } = useParams();
    const { youWhoSwitch, setYouWhoSwitch, siteIsLoading, setSiteIsLoading, siteIsLoading2, setSiteIsLoading2 } = useContext(SiteStateContext);
    const { colorMode } = useColorMode();
    const history = useHistory();
    const [userChats, setUserChats] = useState([]);
    const [selectedUserChat, setSelectedUserChat] = useState("");
    const [newUserMessage, setNewUserMessage] = useState("");
    const [providerChats, setProviderChats] = useState([]);
    const [selectedProviderChat, setSelectedProviderChat] = useState("");
    const [newProviderMessage, setNewProviderMessage] = useState("");
    const [provider, setProvider] = useState("");
    const [notifyNewYouMessage, setNotifyNewYouMessage] = useState(true);
    const [notifyNewWhoMessage, setNotifyNewWhoMessage] = useState(true);
    const [reloadPage, setReloadPage] = useState(false);
    const toastIdyou = "new-you-message";
    const toastIdwho = "new-who-message";
    const toast = useToast();

    useEffect(() => {

        if (user) {
            setProvider(user.attributes.userPublic);
        }

    }, [user])


    useEffect(() => {

        if (!booking) {
            setNotifyNewYouMessage(true)
            setNotifyNewWhoMessage(true)
        } else {
        }

    }, [booking])


    useEffect(() => {

        (async () => {
            setSiteIsLoading(true);
            await getYouChats();
            await getWhoChats();
            setSiteIsLoading(false);
        })();

    }, [reloadPage])

    // useEffect(() => {

    //     if (youChatData) {
    //         setUserChats(youChatData);
    //     }

    // }, [youChatData])


    const { data: youChatData } = useMoralisQuery(
        "Chats",
        query =>
            query
                .equalTo("user", user)
                .include("provider")
                .include("service")
                .include("booking"),
        [],
        {
            live: true,
            onLiveUpdate: (youChats) => {


                // setUserChats(youChats);
                setNotifyNewYouMessage(true);
                console.log("youChatssss", youChats);
                if (!toast.isActive(toastIdyou)) {
                    toast({
                        id: toastIdyou,
                        position: "top",
                        title: "New Booking Message",
                        description: "You received a new message for one of your bookings.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        render: () => (
                            <Box as="button" textAlign="left" onClick={() => history.push("/chat/you")} w={["94vw", "512px", "", ""]} position="fixed" top="0" left="50%" p={4} pb={5} ml={["-47vw", "-251px", "", ""]} color="primary.600" bg="primary.200" borderBottomRadius="lg">
                                <Text fontWeight="600"><Icon as={AiI.AiOutlineExclamationCircle} mr={1} mb="4px" />New Booking Message</Text>
                                <Text>You received a new message from the service provider for one of your bookings.</Text>
                            </Box>
                        ),
                    });
                };

            },
        },
    );

    console.log("youChatData", youChatData)

    const { data: whoChatData } = useMoralisQuery(
        "Chats",
        query =>
            query
                .equalTo("provider", provider)
                .include("userPublic")
                .include("service")
                .include("booking"),
        [],
        {
            live: true,
            onLiveUpdate: (whoChats) => {
                // setProviderChats(whoChats);
                console.log("whoChats", whoChats);
                if (!toast.isActive(toastIdwho) && notifyNewWhoMessage) {
                    toast({
                        id: toastIdwho,
                        position: "top",
                        title: "New Booking Message",
                        description: "You received a new message for one of your bookings.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        render: () => (
                            <Box as="button" textAlign="left" onClick={() => history.push("/chat/who")} w={["94vw", "512px", "", ""]} position="fixed" top="0" left="50%" p={4} pb={5} ml={["-47vw", "-251px", "", ""]} color="secondary.600" bg="secondary.200" borderBottomRadius="lg">
                                <Text fontWeight="600"><Icon as={AiI.AiOutlineExclamationCircle} mr={1} mb="4px" />New Booking Message</Text>
                                <Text>You received a new message from a User for one of your bookings.</Text>
                            </Box>
                        ),
                    });
                };
                setNotifyNewWhoMessage(true);
            },
        },
    );


    const getYouChats = async () => {

        const Chats = Moralis.Object.extend("Chats");
        let queryChats = new Moralis.Query(Chats);
        queryChats.equalTo("user", user);
        queryChats.descending("updatedAt");
        queryChats.include("provider");
        queryChats.include("service");
        queryChats.include("booking");

        let youChats = await queryChats.find();
        console.log("getYouChats", youChats);
        setUserChats(youChats);

        setNotifyNewWhoMessage(false);

    }

    const getWhoChats = async () => {

        const Chats = Moralis.Object.extend("Chats");
        let queryChats = new Moralis.Query(Chats);
        queryChats.equalTo("provider", user.attributes.userPublic);
        queryChats.descending("updatedAt");
        queryChats.include("userPublic");
        queryChats.include("service");
        queryChats.include("booking");


        let whoChats = await queryChats.find();
        console.log("getWhoChats", whoChats);
        setProviderChats(whoChats);

        setNotifyNewYouMessage(false);

    }


    const handleSendYouMessage = async (bookingId) => {

        let newMessagesArray = [{ time: Date.now(), from: "user", message: newUserMessage }];

        newMessagesArray = selectedUserChat.attributes.messages.concat(newMessagesArray);

        let newMessagesReturn = await Moralis.Cloud.run("sendYouMessage", { bookingId, newMessagesArray });

        setUserChats(newMessagesReturn);
        setNewUserMessage("");


    }

    const handleSendWhoMessage = async (bookingId) => {

        let newMessagesArray = [{ time: Date.now(), from: "provider", message: newProviderMessage }];

        newMessagesArray = selectedProviderChat.attributes.messages.concat(newMessagesArray);

        let newMessagesReturn = await Moralis.Cloud.run("sendWhoMessage", { bookingId, newMessagesArray });

        setProviderChats(newMessagesReturn);
        setNewProviderMessage("");


    }


    function truncate(str, n = 6) {
        return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
    };


    const grayText = colorMode === "light" ? "gray.500" : "gray.400";
    const grayText2 = colorMode === "light" ? "gray.600" : "gray.100";
    const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(249,249,249,0.07) 50%, rgba(249,249,249,0.0) 100%)";

    // const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(249,249,249,0.07) 50%, rgba(249,249,249,0.0) 100%)";

    const bgGradientDark = "radial-gradient(circle at 80vw -30vh, rgba(0,201,153, 0.25) 0%, rgba(13,110,253,0.15) 35%, rgba(19,19,19,0.5) 100%)";
    const bg = useColorModeValue(bgGradientLight, bgGradientDark);

    if (siteIsLoading) {
        return (
            <Box w="100%" minH="100vh" minW="100vw" h="100%" p={0} bg={bg} border={0}>
                <Header bgSearch={[colorMode === "light" ? "gray.50" : "gray.900", "none", "", ""]} />
                <Box p={[0, 4, 6, 8]} minH="100%">
                    <Container minHeight={["91vh", "400px", "", ""]} maxW="lg" borderRadius={["0", "xl", "xl", "xl"]} px={[4, 6, "", ""]} pb={[4, 6, "", ""]} pt={[1, 5, "", ""]} mb={["60px", "0", "", ""]} >
                        <Stack pb={2} spacing="0" >
                            <Flex mb={3} mr={1} color={grayText2}>
                                <Text fontWeight="400" fontSize="3xl" ml={1} color={grayText2} style={{ display: "flex", alignItems: "center" }}><Icon as={Io5.IoChatboxEllipsesOutline} color="teal.300" mr={2} />My Chats</Text>
                                <Spacer />
                                <Flex color={grayText} fontSize="xl">
                                    {youWhoSwitch ? (
                                        <><Text color="third.500" fontWeight="300">w</Text><Text fontWeight="300">ho</Text></>
                                    ) : (
                                        <><Text color="secondary.400">y</Text><Text>ou</Text></>
                                    )}
                                    <Box id="youWhoSwitch" className={youWhoSwitch ? "who" : "you"} ><Switch ml={2} isChecked={youWhoSwitch} onChange={() => { setYouWhoSwitch(!youWhoSwitch); window.localStorage.setItem("youWhoSwitch", !youWhoSwitch); history.push(`/chat/${!youWhoSwitch ? "who" : "you"}`); }} /></Box>
                                </Flex>
                            </Flex>

                            <YouWhoLoading />

                        </Stack>
                    </Container>
                </Box>
                <FootNav />
            </Box>
        )
    }

    return (
        <Box w="100%" minH="100vh" minW="100vw" h="100%" p={0} bg={bg} border={0}>
            <RouterSwitch>
                <Route path="/chat/you/:booking">

                    <Box display={["none", "block", "", ""]} >
                        <Header bgSearch={[colorMode === "light" ? "gray.50" : "gray.900", "none", "", ""]} />
                    </Box>
                    <Box p={[0, 4, 6, 8]} minH="100%">
                        <Container minHeight={["100vh", "400px", "", ""]} maxW="lg" borderRadius={["0", "xl", "xl", "xl"]} p={0} overflow="hidden" >
                            <YouChat getYouChats={getYouChats} userChats={userChats} newUserMessage={newUserMessage} setNewUserMessage={setNewUserMessage} handleSendYouMessage={handleSendYouMessage} selectedUserChat={selectedUserChat} setSelectedUserChat={setSelectedUserChat} grayText={grayText} grayText2={grayText2} siteIsLoading={siteIsLoading} setSiteIsLoading={setSiteIsLoading} siteIsLoading2={siteIsLoading2} setSiteIsLoading2={setSiteIsLoading2} reloadPage={reloadPage} setReloadPage={setReloadPage} />
                        </Container>
                    </Box>

                </Route>

                <Route path="/chat/who/:booking">

                    <Box display={["none", "block", "", ""]} >
                        <Header bgSearch={[colorMode === "light" ? "gray.50" : "gray.900", "none", "", ""]} />
                    </Box>
                    <Box p={[0, 4, 6, 8]} minH="100%">
                        <Container minHeight={["100vh", "400px", "", ""]} maxW="lg" borderRadius={["0", "xl", "xl", "xl"]} p={0} overflow="hidden" >
                            <WhoChat getWhoChats={getWhoChats} providerChats={providerChats} newProviderMessage={newProviderMessage} setNewProviderMessage={setNewProviderMessage} handleSendWhoMessage={handleSendWhoMessage} selectedProviderChat={selectedProviderChat} setSelectedProviderChat={setSelectedProviderChat} grayText={grayText} grayText2={grayText2} siteIsLoading={siteIsLoading} setSiteIsLoading={setSiteIsLoading} siteIsLoading2={siteIsLoading2} setSiteIsLoading2={setSiteIsLoading2} reloadPage={reloadPage} setReloadPage={setReloadPage} />
                        </Container>
                    </Box>

                </Route>

                <Route path="/chat/you">

                    <Header bgSearch={[colorMode === "light" ? "gray.50" : "gray.900", "none", "", ""]} />
                    <Box p={[0, 4, 6, 8]} minH="100%">
                        <Container minHeight={["91vh", "400px", "", ""]} maxW="lg" borderRadius={["0", "xl", "xl", "xl"]} px={[4, 6, "", ""]} pb={[4, 6, "", ""]} pt={[1, 5, "", ""]} mb={["60px", "0", "", ""]} >
                            <Stack pb={2} spacing="0" >
                                <Flex mb={3} mr={1} color={grayText2}>
                                    <Text fontWeight="400" fontSize="3xl" ml={1} color={grayText2} style={{ display: "flex", alignItems: "center" }}><Icon as={Io5.IoChatboxEllipsesOutline} color="teal.300" mr={2} />My Chats</Text>
                                    <Spacer />
                                    <Flex color={grayText} fontSize="xl">
                                        {youWhoSwitch ? (
                                            <><Text color="third.500" fontWeight="300">w</Text><Text fontWeight="300">ho</Text></>
                                        ) : (
                                            <><Text color="secondary.400">y</Text><Text>ou</Text></>
                                        )}
                                        <Box id="youWhoSwitch" className={youWhoSwitch ? "who" : "you"} ><Switch ml={2} isChecked={youWhoSwitch} onChange={() => { setYouWhoSwitch(!youWhoSwitch); window.localStorage.setItem("youWhoSwitch", !youWhoSwitch); history.push(`/chat/${!youWhoSwitch ? "who" : "you"}`); }} /></Box>
                                    </Flex>
                                </Flex>

                                <Stack spacing="3">
                                    {userChats.length > 0 ?
                                        userChats.map((x, i) =>

                                            <Flex key={x.attributes.booking.id + "flex"} maxHeight={["19vw", "80px", ""]} role="button" onClick={() => { setSelectedUserChat(x); history.push(`/chat/you/${x.attributes.booking.id}`); }} bg={x.attributes.userRead ? "gray.5" : "rgba(255, 163, 126, 0.2)"} borderRadius="md" overflow="hidden" align="center">
                                                <Box id={"flex1" + i} key={"flex1" + i} minWidth={["19vw", "80px", ""]} minHeight={["19vw", "80px", ""]} >
                                                    {x.attributes.service.attributes.service_img1 ? (
                                                        <Image id={"img1" + i} key={"img1" + i} w={["19vw", "80px", ""]} h={["19vw", "80px", ""]} objectFit="cover" src={x.attributes.service.attributes.service_img1._url} fallback={<Center w={["19vw", "80px", ""]} h={["19vw", "80px", ""]}><Spinner /></Center>} borderLeftRadius="md" />
                                                    ) : (
                                                        <Center filter="grayscale(1)" bg="gray.5" key={"logo" + i} w={["19vw", "80px", ""]} h={["19vw", "80px", ""]} >
                                                            <YouWhoLogo opacity="0.2" wdth={["68%", "", ""]} />
                                                        </Center>
                                                    )}
                                                </Box>
                                                <Box p={2}>
                                                    <Text key={i + x.attributes.service.attributes.title} fontWeight="500" textTransform="capitalize" fontSize={["xs", "md", "", ""]}>{truncate(x.attributes.service.attributes.title, 30)}</Text>
                                                    <Text key={i + x.attributes.booking.id} color={grayText} textTransform="capitalize" fontSize="xs">{truncate(x.attributes.booking.id, 25)}</Text>
                                                    <Text key={i + x.attributes.booking.attributes.bookingPublic.attributes.approval} textTransform="uppercase" fontSize={["xs", "sm", "", ""]} color={x.attributes.booking.attributes.bookingPublic.attributes.approval === "pending" ? "primary.400" : x.attributes.booking.attributes.bookingPublic.attributes.approval === "approved" ? "primary.600" : x.attributes.booking.attributes.bookingPublic.attributes.approval === "paid" ? "green.300" : "crimson"} >{x.attributes.booking.attributes.bookingPublic.attributes.approval}</Text>
                                                </Box>
                                                <Spacer />
                                                <Center p={2}>
                                                    <Avatar size="md" name={x.attributes.provider.attributes.username} src={x.attributes.provider.attributes.profile_photo ? x.attributes.provider.attributes.profile_photo._url : ""} />
                                                </Center>

                                            </Flex>


                                        )
                                        :
                                        <Text>You do not have any messages yet.</Text>
                                    }
                                </Stack>

                            </Stack>
                        </Container>
                    </Box>
                    <FootNav />
                </Route>

                <Route path="/chat/who">

                    <Header bgSearch={[colorMode === "light" ? "gray.50" : "gray.900", "none", "", ""]} />
                    <Box p={[0, 4, 6, 8]} minH="100%">
                        <Container minHeight={["91vh", "400px", "", ""]} maxW="lg" borderRadius={["0", "xl", "xl", "xl"]} px={[4, 6, "", ""]} pb={[4, 6, "", ""]} pt={[1, 5, "", ""]} mb={["60px", "0", "", ""]} >
                            <Stack pb={2} spacing="0" >
                                <Flex mb={3} mr={1} color={grayText2}>
                                    <Text fontWeight="400" fontSize="3xl" ml={1} color={grayText2} style={{ display: "flex", alignItems: "center" }}><Icon as={Io5.IoChatboxEllipsesOutline} color="teal.300" mr={2} />My Chats</Text>
                                    <Spacer />
                                    <Flex color={grayText} fontSize="xl">
                                        {youWhoSwitch ? (
                                            <><Text color="third.500" fontWeight="300">w</Text><Text fontWeight="300">ho</Text></>
                                        ) : (
                                            <><Text color="secondary.400">y</Text><Text>ou</Text></>
                                        )}
                                        <Box id="youWhoSwitch" className={youWhoSwitch ? "who" : "you"} ><Switch ml={2} isChecked={youWhoSwitch} onChange={() => { setYouWhoSwitch(!youWhoSwitch); window.localStorage.setItem("youWhoSwitch", !youWhoSwitch); history.push(`/chat/${!youWhoSwitch ? "who" : "you"}`); }} /></Box>
                                    </Flex>
                                </Flex>

                                <Stack spacing="3">
                                    {providerChats.length > 0 ?
                                        providerChats.map((x, i) =>

                                            <Flex key={x.attributes.booking.id + "flex"} role="button" maxHeight={["19vw", "80px", ""]} onClick={() => { setSelectedProviderChat(x); history.push(`/chat/who/${x.attributes.booking.id}`); }} bg={!x.attributes.providerRead ? "gray.5" : "rgba(0, 201, 153, 0.2)"} borderRadius="md" overflow="hidden" align="center">
                                                <Box id={"flex1" + i} key={"flex1" + i} minWidth={["19vw", "80px", ""]} minHeight={["19vw", "80px", ""]} >
                                                    {x.attributes.service.attributes.service_img1 ? (
                                                        <Image id={"img1" + i} key={"img1" + i} w={["19vw", "80px", ""]} h={["19vw", "80px", ""]} objectFit="cover" src={x.attributes.service.attributes.service_img1._url} fallback={<Center w={["19vw", "80px", ""]} h={["19vw", "80px", ""]}><Spinner /></Center>} borderLeftRadius="md" />
                                                    ) : (
                                                        <Center filter="grayscale(1)" bg="gray.5" key={"logo" + i} w={["19vw", "80px", ""]} h={["19vw", "80px", ""]} >
                                                            <YouWhoLogo opacity="0.2" wdth={["68%", "", ""]} />
                                                        </Center>
                                                    )}
                                                </Box>

                                                <Box p={2}>
                                                    <Text key={i + x.attributes.service.attributes.title} fontWeight="500" textTransform="capitalize" fontSize={["xs", "md", "", ""]}>{truncate(x.attributes.service.attributes.title, 30)}</Text>
                                                    <Text key={i + x.attributes.booking.id} color={grayText} textTransform="capitalize" fontSize="xs">{truncate(x.attributes.booking.id, 25)}</Text>
                                                    <Text key={i + x.attributes.booking.attributes.bookingPublic.attributes.approval} textTransform="uppercase" fontSize={["xs", "sm", "", ""]} color={x.attributes.booking.attributes.bookingPublic.attributes.approval === "pending" ? "primary.400" : x.attributes.booking.attributes.bookingPublic.attributes.approval === "approved" ? "primary.600" : x.attributes.booking.attributes.bookingPublic.attributes.approval === "paid" ? "green.300" : "crimson"} >{x.attributes.booking.attributes.bookingPublic.attributes.approval}</Text>
                                                </Box>
                                                <Spacer />
                                                <Center p={2}>
                                                    <Avatar size="md" name={x.attributes.userPublic.attributes.username} src={x.attributes.userPublic.attributes.profile_photo ? x.attributes.userPublic.attributes.profile_photo._url : ""} />
                                                </Center>

                                            </Flex>


                                        )
                                        :
                                        <Text>You do not have any messages yet.</Text>
                                    }
                                </Stack>

                            </Stack>
                        </Container>
                    </Box>
                    <FootNav />
                </Route>

                <Route path="/chat">
                    <Redirect to="/chat/you" />
                </Route>
            </RouterSwitch >
        </Box>
    )
}
