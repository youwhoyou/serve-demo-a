import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams, Route, Switch as RouterSwitch, useLocation, Redirect } from 'react-router-dom';
import { Box, Button, Container, Text, Icon, useColorModeValue, Stack, useColorMode, Flex, Spacer, Input, IconButton, InputGroup, InputRightAddon, Center, Avatar } from "@chakra-ui/react";
import YouWhoLoading from '../misc/YouWhoLoading';
import * as Io5 from "react-icons/io5";
import * as FaI from "react-icons/fa";


export default function YouChat({ getYouChats, userChats, newUserMessage, setNewUserMessage, handleSendYouMessage, selectedUserChat, setSelectedUserChat, grayText, grayText2, siteIsLoading, setSiteIsLoading, siteIsLoading2, setSiteIsLoading2, reloadPage, setReloadPage }) {

    const { booking } = useParams();
    const { colorMode } = useColorMode();
    const history = useHistory();
    const [chatRoomFound, setChatRoomFound] = useState(false);

    useEffect(() => {

        (async () => {
            if (!selectedUserChat && !chatRoomFound) {
                setSiteIsLoading2(true);
                await getYouChats();
                console.log("booking", booking)
                const found = await userChats.find(e => e.attributes.bookingId === booking);
                console.log("found", found)
                if (found !== undefined) {
                    setSelectedUserChat(found);
                    setChatRoomFound(true);
                } else {
                    console.log("not found")
                    setChatRoomFound(true);
                    // history.push("/chat/you")
                }
                setSiteIsLoading2(false);
            }
            setSiteIsLoading2(false);
        })();

    }, [])


    useEffect(() => {
        (async () => {
            if (selectedUserChat && selectedUserChat.attributes.userRead === false) {
                selectedUserChat.set('userRead', true);

                await selectedUserChat.save().then(async (updatedUserChat) => {

                    setSelectedUserChat(updatedUserChat);
                });
            }
        })();
    }, [userChats, selectedUserChat])


    useEffect(() => {

        if (selectedUserChat) {
            var elem = document.getElementById('messages');
            elem.scrollTop = elem.scrollHeight;
        }

    }, [userChats, selectedUserChat])

    function truncate(str, n = 30) {
        return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
    };

    console.log("selectedUserChat", selectedUserChat);


    if (selectedUserChat) {

        return (
            <Stack grow spacing="0" borderRadius="md" minHeight={["100vh", "400px", "", ""]} maxH={["100vh", "60vh", "", ""]} position="relative" >

                <Center flexSrink="1" pt={2} pr={1} bg="gray.5" align="center" px={["2", "4", "", ""]} py={["2", "3", "", ""]}>
                    <Center role="button" onClick={() => history.push(`/activity/you/booked/${selectedUserChat.attributes.booking.id}`)}>
                        <Avatar size="sm" name={selectedUserChat.attributes.provider.attributes.username} src={selectedUserChat.attributes.provider.attributes.profile_photo ? selectedUserChat.attributes.provider.attributes.profile_photo._url : ""} />
                        <Box textAlign="left" px={3} maxHeight={["29vw", "120px", ""]} overflow="auto">
                            <Text fontWeight="500" textTransform="capitalize" fontSize="sm">{truncate(selectedUserChat.attributes.service.attributes.title)}</Text>
                            <Text color={grayText} textTransform="capitalize" fontSize="xs">{truncate(selectedUserChat.attributes.booking.id)}</Text>
                        </Box>

                    </Center>

                    <Spacer />
                    <IconButton icon={<Io5.IoArrowBack />} variant="link" size="sm" fontSize="24px" h="24px " w="24px" onClick={() => { setReloadPage(!reloadPage); history.push("/chat/you"); }} />
                </Center>
                <Stack id="messages" flexGrow="3" overflowY="auto" px="4" pb="2" bgImage="url(/media/logo/YouWhoLogoBwTransp.svg)" bgPos="center" bgSize="200px" bgRepeat="no-repeat" >

                    <Stack>
                        {selectedUserChat.attributes.messages.map((x, i) =>
                            <>
                                {x.from === "user" &&
                                    <Flex >
                                        <Spacer />
                                        <Box>
                                            <Flex >
                                                <Spacer />
                                                <Box px={2} py={1} bg="secondary.100" borderRadius="base" borderBottomRightRadius="none">
                                                    <Text key={x.time} color="secondary.500">{x.message}</Text>
                                                </Box>
                                            </Flex>
                                            <Flex>
                                                <Spacer />
                                                <Text color={grayText} opacity="0.5" fontSize="xs">{new Date(x.time).toLocaleString('en-GB', { hour12: true })}</Text>
                                            </Flex>
                                        </Box>
                                    </Flex>
                                }

                                {x.from === "provider" &&
                                    <Flex >
                                        <Box>
                                            <Flex >
                                                <Box px={2} py={1} bg="third.200" borderRadius="base" borderBottomLeftRadius="none">
                                                    <Text key={x.time} color="third.700">{x.message}</Text>
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
                        <Input as="textarea" bg="gray.5" variant="filled" borderBottomRadius="0px" borderTopRadius="5px" focusBorderColor="none" maxH="80px" height="80px" type="text" value={newUserMessage} onChange={(e) => setNewUserMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' ? e.shiftKey ? null : handleSendYouMessage(booking) : null} px={2} resize="none" />
                        <InputRightAddon role="button" children={<Icon as={FaI.FaRegPaperPlane} fontSize="24px" color="primary.400" />} borderBottomRadius="0px" borderTopRadius="5px" maxH="80px" height="80px" bg={colorMode === "light" ? "gray.200" : "gray.800"} borderWidth="0px" onClick={() => handleSendYouMessage(booking)} />
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
                    <Stack role="button" onClick={() => history.push("/chat/you")}>
                        <Center mb={2}><Icon as={Io5.IoWarningOutline} fontSize="30px" color="secondary.300" /></Center>
                        <Text align="center">The chat room you are looking for does not exist.</Text>
                        <Text align="center">Please click here to <Text as="span" color="primary.500" fontWeight="600">go back</Text>.</Text>
                    </Stack>
                </Center>
            )}
        </>
    )
}
