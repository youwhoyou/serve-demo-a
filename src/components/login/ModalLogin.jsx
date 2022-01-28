import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { InputGroup, InputRightElement, Tabs, TabList, Tab, TabPanels, TabPanel, Text, Modal, FormControl, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Input, Button, Box, Center, IconButton, Spacer, AlertIcon, AlertTitle, Alert, AlertDescription, Icon, useColorMode } from '@chakra-ui/react';
import * as FaI from 'react-icons/fa';
import * as MdI from 'react-icons/md';
import * as BiI from 'react-icons/bi';
import * as BsI from 'react-icons/bs';
import * as FcI from 'react-icons/fc';
import { useMoralis } from "react-moralis";
import Moralis from "moralis";
import ErrorBox from "../error/ErrorBox";

export default function ModalLogin({ isOpen, onClose }) {

    const { authenticate, user, authError, isAuthenticating, signup, login, logout, setUserData } = useMoralis();
    const [show, setShow] = useState(false);
    const [showAlert, setShowAlert] = useState("flex");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { colorMode } = useColorMode();
    const [justAuthenticated, setJustAuthenticated] = useState(false);
    const [newSignUp, setNewSignUp] = useState(false);
    const [metaMask, setMetaMask] = useState(false);

    const history = useHistory();
    const location = useLocation();
    const handleShowPassword = () => setShow(!show);



    useEffect(() => {

        if (justAuthenticated && user) {

            setJustAuthenticated(false);

            (async () => {

                if (newSignUp) {

                    setNewSignUp(false);

                    const UserPublic = Moralis.Object.extend("UserPublic");
                    let publicProfile = new UserPublic();

                    const acl = new Moralis.ACL();
                    acl.setPublicReadAccess(true);
                    acl.setWriteAccess(user.id, true);

                    publicProfile.setACL(acl);
                    publicProfile.set('username', MdI.MdEmail);
                    publicProfile.set('user', user);

                    await publicProfile.save().then(async (publicProfile) => {

                        await setUserData({ userPublic: publicProfile }).then(() => {

                            history.push(`/account/profile`);
                            onClose();

                        }).catch(error => console.log(error))

                    }).catch(error => console.log(error));

                } else if (metaMask) {

                    setMetaMask(false);

                    const UserPublic = Moralis.Object.extend("UserPublic");
                    const query = new Moralis.Query(UserPublic);
                    query.equalTo("user", user);
                    let publicProfile = await query.first();

                    if (!publicProfile) {

                        publicProfile = new UserPublic();

                        const acl = new Moralis.ACL();
                        acl.setPublicReadAccess(true);
                        acl.setWriteAccess(user.id, true);

                        publicProfile.setACL(acl);
                        publicProfile.set('username', email);
                        publicProfile.set('user', user);

                        await publicProfile.save().then(async (publicProfile) => {

                            await setUserData({ userPublic: publicProfile }).then(() => {

                                if (location.pathname === "/") {
                                    history.push(`/account`);
                                }
                                onClose();

                            }).catch(error => console.log(error))

                        }).catch(error => console.log(error));

                    } else {
                        if (location.pathname === "/") {
                            history.push(`/account`);
                        }
                        onClose();
                    }

                } else {

                    if (location.pathname === "/") {
                        history.push(`/account`);
                    }
                    onClose();
                }

            })();


        }
    }, [justAuthenticated, newSignUp])

    const handleSignUp = async () => {
        await signup(email, password, email).then(() => {
            setNewSignUp(true);
            setJustAuthenticated(true);
        }).catch((error) => console.log(error));

    }

    const handleLogin = async () => {
        await login(email, password);
        setJustAuthenticated(true);
    }

    const handleMetaMaskLogin = async () => {
        await authenticate();
        setMetaMask(true);
        setJustAuthenticated(true);
    }

    const grayText = colorMode === "light" ? "gray.500" : "white";

    return (
        <>
            <Modal isOpen={isOpen} size="sm" onClose={onClose} >
                <ModalOverlay />
                <ModalContent minHeight="200px" borderRadius="xl" p={2} mx={3} mt="10%" className="bgBlurModal">
                    <ModalHeader p={4} fontSize="lg">Sign Up / Login</ModalHeader>
                    <ModalCloseButton m={3} />
                    <ModalBody p={4} >
                        <Tabs isFitted variant="enclosed">
                            <TabList borderBottom="1px" borderColor="gray.10">
                                <Tab color="secondary.200" _selected={{ fontWeight: "500", color: "white", bg: "secondary.200", borderTopRadius: "lg", }}>Sign Up</Tab>
                                <Tab color="primary.400" _selected={{ fontWeight: "500", color: "primary.600", bg: "primary.100", borderTopRadius: "lg", }}>Login</Tab>
                            </TabList>
                            <TabPanels >
                                <TabPanel align="start" border="0px" borderColor="gray.10" borderBottomRadius="lg" borderTopRightRadius="lg" p={4}>
                                    {authError && (
                                        <ErrorBox title="Sign Up Failed" message={authError.message} />
                                    )}
                                    {user ? (
                                        <Alert display={showAlert} status="success" borderRadius="md" mb={2}>
                                            <AlertIcon />
                                            <Box flex="1" textAlign="left">
                                                <AlertTitle>Sign Up Success!</AlertTitle>
                                                <AlertDescription display="block">
                                                    Welcome {email}
                                                </AlertDescription>
                                            </Box>
                                            <IconButton icon={<MdI.MdClose />} variant="ghost" position="absolute" right="8px" top="8px" onClick={() => { setShowAlert("none"); onClose() }} />
                                        </Alert>
                                    )
                                        : ""
                                    }
                                    <FormControl mt={3}>
                                        <Text color={grayText}>Email Address</Text>
                                        <Input placeholder="Enter email" variant="flushed" value={email} onChange={event => setEmail(event.target.value)} onKeyPress={e => e.key === 'Enter' ? handleSignUp() : null} />
                                    </FormControl>
                                    <FormControl mt={6}>
                                        <Text color={grayText}>Password</Text>
                                        <InputGroup>
                                            <Input pr="4.5rem" type={show ? "text" : "password"} variant="flushed" placeholder="Enter password" value={password} onChange={event => setPassword(event.target.value)} onKeyPress={e => e.key === 'Enter' ? handleSignUp() : null} />
                                            <InputRightElement mr={2}>
                                                <IconButton aria-label="Show password" variant="ghost" icon={show ? <FaI.FaRegEyeSlash /> : <FaI.FaRegEye />} onClick={handleShowPassword} />
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                    <Center mt={5}>
                                        <Spacer />
                                        <Button color="secondary.500" isLoading={isAuthenticating} bg="secondary.100" _hover={{ bg: "secondary.200" }} _focus={{ bg: "secondary.100" }} _active={{ bg: "secondary.100" }} mr={3} onClick={handleSignUp}>Sign Up<Icon as={BsI.BsPencilSquare} height="18px" width="18px" ml={2} /></Button>
                                        <Button onClick={onClose} isLoading={isAuthenticating}>Cancel<Icon as={FcI.FcCancel} height="22px" width="22px" ml={2} /></Button>
                                    </Center>
                                </TabPanel>
                                <TabPanel align="start" border="0px" borderColor="gray.10" borderBottomRadius="lg" borderTopRightRadius="lg" p={4}>
                                    {authError && (
                                        <ErrorBox title="Login Failed" message={authError.message} />
                                    )}
                                    <Box align="center">
                                        <Button colorScheme="yellow" color="yellow.700" size="lg" maxWidth="100%" mt={1} isLoading={isAuthenticating} onClick={() => { if (user) { logout(); } else { handleMetaMaskLogin(); } }} ><Text textAlign="left" overflow="hidden" >{user ? "Logout " + user.attributes.username : "Login with MetaMask"}</Text></Button>
                                        <Text my={3}>or login with email & password below</Text>
                                    </Box>
                                    <FormControl mt={6}>
                                        <Text color={grayText}>Email Address</Text>
                                        <Input placeholder="Enter email" variant="flushed" value={email} onChange={event => setEmail(event.target.value)} onKeyPress={e => e.key === 'Enter' ? handleLogin() : null} />
                                    </FormControl>
                                    <FormControl mt={6}>
                                        <Text color={grayText}>Password</Text>
                                        <InputGroup>
                                            <Input pr="4.5rem" variant="flushed" type={show ? "text" : "password"} placeholder="Enter password" value={password} onChange={event => setPassword(event.target.value)} onKeyPress={e => e.key === 'Enter' ? handleLogin() : null} />
                                            <InputRightElement mr={2}>
                                                <IconButton aria-label="Show password" variant="ghost" icon={show ? <FaI.FaRegEyeSlash /> : <FaI.FaRegEye />} onClick={handleShowPassword} />
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                    <Center mt={5} >
                                        <Spacer />
                                        <Button colorScheme="primary" mr={3} isLoading={isAuthenticating} onClick={handleLogin}>Login<Icon as={BiI.BiLogIn} height="22px" width="22px" ml={2} /></Button>
                                        <Button onClick={onClose} isLoading={isAuthenticating}>Cancel<Icon as={FcI.FcCancel} height="22px" width="22px" ml={2} /></Button>
                                    </Center>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
