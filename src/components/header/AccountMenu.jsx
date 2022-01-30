import React, { useEffect, useState, useContext } from 'react';
import { Flex, Menu, MenuList, MenuItem, MenuButton, Avatar, useDisclosure, Icon, Center, Box, Text, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Button, AvatarBadge, Heading } from "@chakra-ui/react";
import { useMoralis } from "react-moralis";
import ModalLogin from '../login/ModalLogin';
import * as BiI from "react-icons/bi";
import { GiTap } from "react-icons/gi";
import * as HiI from "react-icons/hi";
import * as Io5 from "react-icons/io5";
import * as CgI from "react-icons/cg";
import md5 from 'md5';
import axios from 'axios';
import { NavLink, useHistory } from 'react-router-dom';
import ThemeToggler from '../misc/ThemeToggler';
import TimezoneSelect from 'react-timezone-select';
import { SiteStateContext } from '../context/SiteStateContext';


export default function AccountMenu(props) {

    const { user, logout, setUserData, isAuthUndefined, isAuthenticated, authenticate, auth } = useMoralis();
    // const user = Moralis.User.current();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [gravatar, setGravatar] = useState(user ? user.attributes.gravatar : "none");
    const { selectedTimezone, setSelectedTimezone, setYouWhoSwitch, newEvent, setNewEvent, acceptDemo, setAcceptDemo } = useContext(SiteStateContext);
    const history = useHistory();

    // useEffect(() => {
    //     if (!user && !acceptDemo) {
    //         return (<ConfirmDemo />)
    //     }
    // }, [user, acceptDemo])

    const connectWallet = async () => {
        await authenticate();
    }

    useEffect(() => {
        if (user && user.attributes.timezone) {
            try {
                setSelectedTimezone(JSON.parse(user.attributes.timezone));
            } catch (error) {
                console.log(error);
            }
        }

        (async () => {
            try {
                if (user && !user.attributes.timezone && isAuthUndefined) {
                    await setUserData({ timezone: { "value": Intl.DateTimeFormat().resolvedOptions().timeZone, "offset": (new Date().getTimezoneOffset()) / (-60) } });
                }
            } catch (error) {
                console.log(error);
            }
        })();

        // eslint-disable-next-line
    }, [isAuthUndefined])

    useEffect(() => {
        (async () => {
            try {
                if (user) {
                    await setUserData({ timezone: JSON.stringify(selectedTimezone, null, 2) });
                }
            } catch (error) {
                console.log(error);
            }
        })();
        // eslint-disable-next-line
    }, [selectedTimezone]
    )

    useEffect(() => {
        (async () => {
            try {
                if (user && user.attributes.gravatar === "unchecked" && user.attributes.email !== "") {
                    await axios.get(`https://en.gravatar.com/${md5(user.attributes.email)}.json`)
                        .then(async (data) => { console.log(data); console.log(`https://secure.gravatar.com/avatar/${md5(user.attributes.email)}`); setGravatar(`https://secure.gravatar.com/avatar/${md5(user.attributes.email)}`); await setUserData({ gravatar: `https://secure.gravatar.com/avatar/${md5(user.attributes.email)}` }); })
                        .catch(async (error) => { console.log(error); setGravatar("none"); await setUserData({ gravatar: "none" }); });
                }
            } catch (error) {
                console.log(error);
            }
        })();
        // eslint-disable-next-line
    }, [user]
    )

    return (
        <Menu closeOnSelect={true}>
            {(!user && !acceptDemo) ? <ConfirmDemo setAcceptDemo={setAcceptDemo} /> : ""}
            <MenuButton>
                <Flex opacity={props.colorMode === "light" ? "1" : "0.85"} ml={["2", "3", "3"]} >
                    <Avatar bg={user ? "primary.300" : "gray.300"} name={user ? user.attributes.username : ""} src={user ? (user.attributes.profile_photo ? user.attributes.profile_photo._url : gravatar !== "none" && gravatar !== "unchecked" ? `${gravatar}` : "") : ""} w={["42px", "48px", "48px"]} h={["42px", "48px", "48px"]} fontSize={["24px", "28px", "28px"]} ><AvatarBadge display={newEvent ? "block" : "none"} boxSize="0.8em" bg="red.400" borderWidth="3px" /></Avatar>
                </Flex>
            </MenuButton>
            <MenuList borderWidth="0" minWidth="250px" className="bgBlur" py={6}>
                <Center>
                    <Box id="timeZoneBox" w="150px" mr={2} mb={2}>
                        <TimezoneSelect value={selectedTimezone} onChange={setSelectedTimezone} />
                    </Box>
                    <ThemeToggler mb={2} minWidth={["40px", "40px", "40px"]} h={["40px", "40px", "40px"]} borderRadius={["md", "md", "md"]} fontSize={["24px", "24px", "24px"]} />
                </Center>
                {user ? (
                    <>
                        {newEvent &&
                            <MenuItem justifyContent="flex-end" mt="2" px={6} >
                                <NavLink to="/account/events" activeStyle={{ fontWeight: "bold", color: "#3182CE" }} style={{ display: "flex", alignItems: "center" }}>
                                    {newEvent ? <b>New Events</b> : "My Events"}<Icon as={newEvent ? BiI.BiCommentError : BiI.BiCommentDetail} color={newEvent ? "red.400" : "primary.400"} height="22px" width="22px" ml={2} />
                                </NavLink>
                            </MenuItem>
                        }
                        <MenuItem justifyContent="flex-end" mt="2" px={6} >
                            <NavLink className="nav-link" to={`/faucet`} fontWeight="bold" activeStyle={{ fontWeight: "bold", color: "#ff7e4c" }} style={{ display: "flex", alignItems: "center" }}>
                                Mock YOU & USD Faucet<Icon as={GiTap} color="blue.500" height="22px" width="22px" ml={2} />
                            </NavLink>
                        </MenuItem>
                        <MenuItem justifyContent="flex-end" mt="2" px={6} >
                            <NavLink className="nav-link" to={`/account/profile`} fontWeight="bold" activeStyle={{ fontWeight: "bold", color: "#ff7e4c" }} style={{ display: "flex", alignItems: "center" }}>
                                {user ? user.attributes.username : ""}<Icon as={BiI.BiUserCircle} color="blue.500" height="22px" width="22px" ml={2} />
                            </NavLink>
                        </MenuItem>
                        <MenuItem justifyContent="flex-end" mt="2" px={6} >
                            <Text as="button" className="nav-link" onClick={connectWallet} style={{ display: "flex", alignItems: "center" }}>
                                Connect Wallet<Icon as={CgI.CgPlug} color="green.300" height="22px" width="22px" ml={2} />
                            </Text>
                        </MenuItem>
                        <Box display={[(history.location.pathname === "/" ? "block" : "none"), "block", "", ""]}>
                            <MenuItem mt="2" px={6} justifyContent="flex-end" >
                                <NavLink to="/newservice" activeStyle={{ fontWeight: "bold", color: "#3182CE" }} style={{ display: "flex", alignItems: "center" }}>
                                    Add New Service<Icon as={HiI.HiOutlinePencilAlt} color="secondary.200" height="22px" width="22px" ml={2} />
                                </NavLink>
                            </MenuItem>
                            <MenuItem mt="2" px={6} justifyContent="flex-end" >
                                <NavLink to="/activity" activeStyle={{ fontWeight: "bold", color: "#ff7e4c" }} style={{ display: "flex", alignItems: "center" }}>
                                    Activity<Icon as={Io5.IoReaderOutline} color="primary.300" height="22px" width="22px" ml={2} />
                                </NavLink>
                            </MenuItem>
                            <MenuItem mt="2" px={6} justifyContent="flex-end" >
                                <NavLink to="/chat" activeStyle={{ fontWeight: "bold", color: "#3182CE" }} style={{ display: "flex", alignItems: "center" }}>
                                    Chat<Icon as={Io5.IoChatboxEllipsesOutline} color="teal.300" height="22px" width="22px" ml={2} />
                                </NavLink>
                            </MenuItem>
                            <MenuItem mt="2" px={6} justifyContent="flex-end" >
                                <NavLink to="/wallet" activeClassName="activeFooterLink" activeStyle={{ fontWeight: "bold", color: "#ff7e4c" }} style={{ display: "flex", alignItems: "center" }}>
                                    Wallet<Icon as={Io5.IoWalletOutline} color="primary.400" height="22px" width="22px" ml={2} />
                                </NavLink>
                            </MenuItem>
                        </Box>
                        <ConfirmLogout logout={logout} setYouWhoSwitch={setYouWhoSwitch} history={history} />
                    </>
                ) : (
                    <>
                        <MenuItem justifyContent="flex-end" mt="2" px={6} >
                            <NavLink className="nav-link" to={`/faucet`} fontWeight="bold" activeStyle={{ fontWeight: "bold", color: "#ff7e4c" }} style={{ display: "flex", alignItems: "center" }}>
                                Mock YOU & USD Faucet<Icon as={GiTap} color="blue.500" height="22px" width="22px" ml={2} />
                            </NavLink>
                        </MenuItem>
                        <MenuItem mt="2" px={6} justifyContent="flex-end" >
                            <NavLink to="/activity/you/viewed" activeStyle={{ fontWeight: "bold", color: "#ff7e4c" }} style={{ display: "flex", alignItems: "center" }}>
                                Activity<Icon as={Io5.IoReaderOutline} color="primary.300" height="22px" width="22px" ml={2} />
                            </NavLink>
                        </MenuItem>
                        <MenuItem justifyContent="flex-end" mt={2} px={6} onClick={onOpen} style={{ display: "flex", alignItems: "center" }}>
                            Sign Up / Login<Icon as={BiI.BiLogIn} color="green.500" height="22px" width="22px" ml={2} />
                        </MenuItem>
                    </>
                )}
            </MenuList>
            <ModalLogin isOpen={isOpen} onClose={onClose} />
        </Menu >
    )
}

function ConfirmLogout({ logout, setYouWhoSwitch, history }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    return (
        <>
            <MenuItem as="button" justifyContent="flex-end" mt="2" px={6} onClick={onOpen} style={{ display: "flex", alignItems: "center" }}>
                Logout<Icon as={BiI.BiLogOut} color="red.300" height="22px" width="22px" ml={2} />
            </MenuItem>
            <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen} isCentered >
                <AlertDialogOverlay />

                <AlertDialogContent m={3} borderRadius="lg" p={2} className="bgBlurModal" style={{ display: "flex", alignItems: "center" }}>
                    <AlertDialogHeader p={4}><Icon as={BiI.BiLogOut} w={6} h={6} mr={2} />Confirm Logout</AlertDialogHeader>
                    <AlertDialogCloseButton m={2} />
                    <AlertDialogBody px={6}>
                        Do you want to logout?
                    </AlertDialogBody>
                    <AlertDialogFooter p={4}>
                        <Button colorScheme="primary" ref={cancelRef} onClick={() => { setYouWhoSwitch(false); localStorage.setItem('youWhoSwitch', false); onClose(); logout(); }}>
                            Yes
                        </Button>
                        <Button ml={3} onClick={onClose}>
                            No
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

function ConfirmDemo({ setAcceptDemo }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        onOpen();
    }, [])

    return (
        <>
            <AlertDialog motionPreset="slideInBottom" isOpen={isOpen} isCentered >
                <AlertDialogOverlay />

                <AlertDialogContent m={3} borderRadius="lg" p={2} className="bgBlurModal" >
                    <AlertDialogHeader p={4} style={{ display: "flex", alignItems: "center" }}><Icon as={BiI.BiLogIn} w={6} h={6} mr={2} />Accept Demo</AlertDialogHeader>
                    <AlertDialogBody px={6}>
                        Please click <Text as="span" color="primary.500" fontWeight="500">Accept</Text> to confirm your understanding that this site is an early demo of <Text as="span" >youwho</Text>'s <Heading as="span" fontSize="large" fontWeight="400" >Serve</Heading> app running on the <Text as="span" color="primary.500" fontWeight="400">Avalanche Fuji Testnet</Text>, and is by no means a representation of the finished product.<br /><br />This demo exists only to provide an early visualization of the concept of <Text as="span" fontSize="large" >youwho</Text>'s <Heading as="span" fontSize="large" fontWeight="400" >Serve</Heading> app, which is one of many apps that will be available as part of the <Text as="span" fontSize="large" >youwho</Text> <Text as="span" color="primary.500">On Demand</Text> Services Ecosystem.
                    </AlertDialogBody>
                    <AlertDialogFooter p={4}>
                        <Button colorScheme="primary" onClick={() => { setAcceptDemo(true); localStorage.setItem('demo', true); onClose(); }}>
                            Accept
                        </Button>
                        <Button ml={3} as="a" href="https://why.youwho.io">
                            Take me back
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
