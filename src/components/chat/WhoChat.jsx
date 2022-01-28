import React, { useContext, useEffect, useState } from 'react';
import Moralis from 'moralis';
import { useHistory, useParams, Route, Switch as RouterSwitch, useLocation, Redirect } from 'react-router-dom';
import { Box, Button, Container, Text, Icon, useColorModeValue, Stack, useColorMode, Flex, Spacer, Input, IconButton, InputGroup, InputRightAddon, Center, Avatar } from "@chakra-ui/react";
import YouWhoLoading from '../misc/YouWhoLoading';
import * as Io5 from "react-icons/io5";
import * as FaI from "react-icons/fa";



export default function WhoChat({ getWhoChats, providerChats, newProviderMessage, setNewProviderMessage, handleSendWhoMessage, selectedProviderChat, setSelectedProviderChat, grayText, grayText2, siteIsLoading, setSiteIsLoading, siteIsLoading2, setSiteIsLoading2, reloadPage, setReloadPage }) {

    const { booking } = useParams();
    const { colorMode } = useColorMode();
    const history = useHistory();
    const [chatRoomFound, setChatRoomFound] = useState(false);

    useEffect(() => {

        (async () => {
            if (!selectedProviderChat && !chatRoomFound) {
                setSiteIsLoading2(true);
                await getWhoChats();
                console.log("booking", booking)
                const found = await providerChats.find(e => e.attributes.bookingId === booking);
                console.log("found", found)
                if (found !== undefined) {
                    setSelectedProviderChat(found);
                    setChatRoomFound(true);
                } else {
                    console.log("not found")
                    setChatRoomFound(true);
                    // history.push("/chat/who")
                }
                setSiteIsLoading2(false);
            }
            setSiteIsLoading2(false);
        })();

    }, [])


    useEffect(() => {
        (async () => {
            if (selectedProviderChat && selectedProviderChat.attributes.providerRead === false) {

                let updatedProviderChat = await Moralis.Cloud.run("readWhoMessage", { bookingId: booking });
                setSelectedProviderChat(updatedProviderChat);

            }
        })();
    }, [providerChats, selectedProviderChat])


    useEffect(() => {

        if (selectedProviderChat) {
            var elem = document.getElementById('messages');
            elem.scrollTop = elem.scrollHeight;
        }

    }, [providerChats, selectedProviderChat])

    function truncate(str, n = 30) {
        return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
    };

    console.log("selectedProviderChat", selectedProviderChat);


    if (selectedProviderChat) {

        return (
            <Stack grow spacing="0" borderRadius="md" minHeight={["100vh", "400px", "", ""]} maxH={["100vh", "60vh", "", ""]} position="relative" >

                <Center flexSrink="1" pt={2} pr={1} bg="gray.5" align="center" px={["2", "4", "", ""]} py={["2", "3", "", ""]}>
                    <Center role="button" onClick={() => history.push(`/activity/who/bookings/${selectedProviderChat.attributes.booking.id}`)}>
                        <Avatar size="sm" name={selectedProviderChat.attributes.userPublic.attributes.username} src={selectedProviderChat.attributes.userPublic.attributes.profile_photo ? selectedProviderChat.attributes.userPublic.attributes.profile_photo._url : ""} />
                        <Box textAlign="left" px={3} maxHeight={["29vw", "120px", ""]} overflow="auto">
                            <Text fontWeight="500" textTransform="capitalize" fontSize="sm">{truncate(selectedProviderChat.attributes.service.attributes.title)}</Text>
                            <Text color={grayText} textTransform="capitalize" fontSize="xs">{truncate(selectedProviderChat.attributes.booking.id)}</Text>
                        </Box>

                    </Center>

                    <Spacer />
                    <IconButton icon={<Io5.IoArrowBack />} variant="link" size="sm" fontSize="24px" h="24px " w="24px" onClick={() => { setReloadPage(!reloadPage); history.push("/chat/who"); }} />
                </Center>
                <Stack id="messages" flexGrow="3" overflowY="auto" px="4" pb="2" bgImage="url(/media/logo/YouWhoLogoBwTransp.svg)" bgPos="center" bgSize="180px" bgRepeat="no-repeat" >

                    <Stack>
                        {selectedProviderChat.attributes.messages.map((x, i) =>
                            <>
                                {x.from === "provider" &&
                                    <Flex >
                                        <Spacer />
                                        <Box>
                                            <Flex >
                                                <Spacer />
                                                <Box px={2} py={1} bg="third.200" borderRadius="base" borderBottomRightRadius="none">
                                                    <Text key={x.time} color="third.700">{x.message}</Text>
                                                </Box>
                                            </Flex>
                                            <Flex>
                                                <Spacer />
                                                <Text color={grayText} opacity="0.5" fontSize="xs">{new Date(x.time).toLocaleString('en-GB', { hour12: true })}</Text>
                                            </Flex>
                                        </Box>
                                    </Flex>
                                }

                                {x.from === "user" &&
                                    <Flex >
                                        <Box>
                                            <Flex >
                                                <Box px={2} py={1} bg="secondary.100" borderRadius="base" borderBottomLeftRadius="none">
                                                    <Text key={x.time} color="secondary.500">{x.message}</Text>
                                                </Box>
                                                <Spacer />
                                            </Flex>
                                            <Flex>
                                                <Text color={grayText} opacity="0.5" fontSize="xs">{new Date(x.time).toLocaleString('en-GB', { hour12: true })}</Text>
                                                <Spacer />
                                            </Flex>
                                        </Box>
                                        <Spacer />
                                    </Flex>
                                }
                            </>

                        )}
                    </Stack>

                </Stack>

                <Flex flexSrink="1" >
                    <InputGroup bg="gray.5">
                        <Input as="textarea" bg="gray.5" variant="filled" borderBottomRadius="0px" borderTopRadius="5px" focusBorderColor="none" maxH="80px" height="80px" type="text" value={newProviderMessage} onChange={(e) => setNewProviderMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' ? e.shiftKey ? null : handleSendWhoMessage(booking) : null} px={2} resize="none" />
                        <InputRightAddon role="button" children={<Icon as={FaI.FaRegPaperPlane} fontSize="24px" color="primary.400" />} borderBottomRadius="0px" borderTopRadius="5px" maxH="80px" height="80px" bg={colorMode === "light" ? "gray.200" : "gray.800"} borderWidth="0px" onClick={() => handleSendWhoMessage(booking)} />
                    </InputGroup>
                </Flex>

            </Stack>
        )
    }

    return (
        <>
            {siteIsLoading2 ? (
                <YouWhoLoading />
            ) : (
                <Center minHeight="200px" >
                    <Stack role="button" onClick={() => history.push("/chat/who")}>
                        <Center mb={2}><Icon as={Io5.IoWarningOutline} fontSize="30px" color="secondary.300" /></Center>
                        <Text align="center">The chat room you are looking for does not exist.</Text>
                        <Text align="center">Please click here to <Text as="span" color="primary.500" fontWeight="600">go back</Text>.</Text>
                    </Stack>
                </Center>
            )}
        </>
    )
}
