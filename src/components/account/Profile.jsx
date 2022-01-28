import React, { useContext, useEffect, useState } from 'react';
import Moralis from "moralis";
import { useMoralis, useMoralisFile } from "react-moralis";
import { Button, Box, Center, Container, Text, Icon, IconButton, useColorModeValue, Stack, useDisclosure, Flex, Avatar, Input, Spacer, AvatarBadge, Spinner, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton, InputRightElement, InputGroup, useColorMode, Switch } from "@chakra-ui/react";
import Header from '../header/Header';
import FootNav from '../footnav/FootNav';
import ErrorBox from "../error/ErrorBox";
import SuccessBox from "../error/SuccessBox";
import * as BiI from "react-icons/bi";
import * as BsI from "react-icons/bs";
import * as Io5 from "react-icons/io5";
import * as VsC from "react-icons/vsc";
import * as FaI from 'react-icons/fa';
import { SiteStateContext } from "../context/SiteStateContext";
import { NavLink, useHistory } from 'react-router-dom';



export default function Profile() {

    const { user, setUserData, userError, isUserUpdating } = useMoralis();
    const { error: fileError = null, isUploading, moralisFile, saveFile } = useMoralisFile();
    const [username, setUsername] = useState("_");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [name, setName] = useState("");
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [profilePhotoUploaded, setProfilePhotoUploaded] = useState(false);
    const [photoUploadName, setPhotoUploadName] = useState("");
    const [show, setShow] = useState(false);
    const gravatar = user ? user.attributes.gravatar : "none";
    const { colorMode } = useColorMode();
    const { youWhoSwitch, setYouWhoSwitch } = useContext(SiteStateContext);
    const history = useHistory();

    const handleShowPassword = () => setShow(!show);

    const handleSave = async () => {

        const UserPublic = Moralis.Object.extend("UserPublic");
        const query = new Moralis.Query(UserPublic);
        query.equalTo("user", user);
        let publicProfile = await query.first();

        if (!publicProfile) publicProfile = new UserPublic();

        const acl = new Moralis.ACL();
        acl.setPublicReadAccess(true);
        acl.setWriteAccess(user.id, true);

        publicProfile.setACL(acl);
        publicProfile.set('username', username);
        publicProfile.set('profile_photo', document.getElementById("profilePhotoFileUpload").files.length > 0 ? moralisFile : undefined);
        publicProfile.set('user', user);

        // try {
        await publicProfile.save().then(async (userPublic) => {

            await setUserData({
                username,
                email,
                password: password === "" ? undefined : password,
                mobile,
                name,
                service: null,
                profile_photo: document.getElementById("profilePhotoFileUpload").files.length > 0 ? moralisFile : undefined,
                userPublic,
            });

            if (!userError) {
                setUpdateSuccess(true)
                setProfilePhotoUploaded(false);
            }

        }).catch((error) => {
            console.log(error)
        });
    }

    const handleProfilePhotoUpload = () => {
        const fileUploadControl = document.getElementById("profilePhotoFileUpload");
        const file = fileUploadControl.files[0];
        const name = "profile_picture.jpg";
        const metadata = { createdById: "youwho_profile" };
        const tags = { groupId: "profile_photo" };
        saveFile(name, file, { metadata, tags, });
        setPhotoUploadName(file.name);
        setProfilePhotoUploaded(true);
    }

    // const handleRevert = () => {
    //     setUsername(user.attributes.username ? user.attributes.username : "");
    //     setEmail(user.attributes.email ? user.attributes.email : "");
    //     setName(user.attributes.name ? user.attributes.name : "");
    //     setMobile(user.attributes.mobile ? user.attributes.mobile : "");
    //     setPassword("");
    //     setPhotoUploadName("");
    //     setProfilePhotoUploaded(false);
    //     saveFile("", null);
    // }

    useEffect(() => {
        if (user) {
            setUsername(user.attributes.username ? user.attributes.username : "");
            setEmail(user.attributes.email ? user.attributes.email : "");
            setName(user.attributes.name ? user.attributes.name : "");
            setMobile(user.attributes.mobile ? user.attributes.mobile : "");

            (async () => {
                const UserPublic = Moralis.Object.extend("UserPublic");
                const query = new Moralis.Query(UserPublic);
                query.equalTo("user", user);
                let publicProfile = await query.first();

                if (!publicProfile) {
                    console.log("THIS RAN IN PROFILE")
                    publicProfile = new UserPublic();
                    const acl = new Moralis.ACL();
                    acl.setPublicReadAccess(true);
                    acl.setWriteAccess(user.id, true);

                    publicProfile.setACL(acl);
                    publicProfile.set('username', user.attributes.username ? user.attributes.username : "");
                    publicProfile.set('user', user);

                    await publicProfile.save().then(async (userPublic) => {

                        await setUserData({
                            userPublic,
                        });

                    }).catch((error) => {
                        console.log(error)
                    });

                }
            })();
        }
    }, [user]
    )

    const grayText = colorMode === "light" ? "gray.500" : "gray.400";
    const grayText2 = colorMode === "light" ? "gray.600" : "gray.100";
    const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(249,249,249,0.07) 50%, rgba(249,249,249,0.0) 100%)";

    // const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(249,249,249,0.07) 50%, rgba(249,249,249,0.0) 100%)";

    const bgGradientDark = "radial-gradient(circle at 80vw -30vh, rgba(0,201,153, 0.25) 0%, rgba(13,110,253,0.15) 35%, rgba(19,19,19,0.5) 100%)";
    const bg = useColorModeValue(bgGradientLight, bgGradientDark);

    return (
        <Box w="100%" minH="100vh" minW="100vw" h="100%" p={0} bg={bg} border={0}>
            <Header bgSearch={[colorMode === "light" ? "gray.50" : "gray.900", "none", "", ""]} />
            <Box p={[0, 4, 6, 8]} minH="100%">
                <Container minHeight={["91vh", "200px", "200px", "200px"]} maxW="lg" borderRadius={["0", "xl", "xl", "xl"]} px={[4, 6, "", ""]} pb={[4, 6, "", ""]} pt={[1, 5, "", ""]} mb={["60px", "0", "", ""]} >
                    <Center mb={3} mr={1} color={grayText2}>
                        <Text fontWeight="400" fontSize="3xl" ml={1} color={grayText2}><Icon as={BiI.BiUserCircle} color="blue.400" mb="5px" mr={2} />My Profile</Text>
                        <Spacer />
                        <Flex color={grayText} fontSize="xl">
                            <Button variant="ghost" color="primary.400" onClick={() => { history.push("/account/events") }}>My Events</Button>
                        </Flex>
                    </Center>
                    <Flex m={2} align="center" overflow="hidden">
                        <Input type="file" variant="unstyled" name="profilePhotoFileUpload" id="profilePhotoFileUpload" width="0.1px" height="0.1px" opacity="0" overflow="hidden" position="absolute" zIndex="-1" onChange={handleProfilePhotoUpload} />
                        <Button color="white" as="label" htmlFor="profilePhotoFileUpload" variant="unstyled" w={["70px", "80px", "80px"]} h={["70px", "80px", "80px"]} >
                            {!isUploading ? (
                                profilePhotoUploaded ?
                                    <Avatar role="button" bg="primary.300" _hover={{ opacity: "0.8" }} name={user ? user.attributes.username : ""} src={URL.createObjectURL(document.getElementById("profilePhotoFileUpload").files[0])} w={["70px", "80px", "80px"]} h={["70px", "80px", "80px"]} fontSize={["24px", "28px", "28px"]} ><AvatarBadge boxSize="1.25em" border="0"><Icon as={BiI.BiPencil} ml={2} w="20px" color="gray.400" /></AvatarBadge></Avatar>
                                    :
                                    <Avatar role="button" bg="primary.300" _hover={{ opacity: "0.8" }} name={user ? user.attributes.username : ""} src={user ? (user.attributes.profile_photo ? user.attributes.profile_photo._url : gravatar !== "none" && gravatar !== "unchecked" ? `${gravatar}` : "") : ""} w={["70px", "80px", "80px"]} h={["70px", "80px", "80px"]} fontSize={["24px", "28px", "28px"]} ><AvatarBadge boxSize="1.25em" border="0"><Icon as={BiI.BiPencil} ml={2} w="20px" color="gray.400" /></AvatarBadge></Avatar>

                            ) : (
                                <Center w={["70px", "80px", "80px"]} h={["70px", "80px", "80px"]} ><Spinner size="xl" borderWidth="4px" color="primary.200" /></Center>
                            )}
                        </Button>
                        <Container ml={3}>
                            <Text ml="2" fontWeight="500" color="gray.500" style={{ display: "flex", alignItems: "center" }}>Username<Icon as={BsI.BsPerson} ml={1} /></Text>
                            <Input ml="1" size="lg" type="text" variant="filled" fontWeight="700" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </Container>
                    </Flex>
                    <Stack border="0px" pt={4} borderRadius="lg" borderColor="gray.10" spacing="6">
                        {profilePhotoUploaded && (<SuccessBox status={`warning`} title={`${photoUploadName} Uploaded Successfully`} message={`Please click Save to save changes.`} setUpdateSuccess={setProfilePhotoUploaded} />)}
                        {fileError && (<ErrorBox title="Profile photo change failed" message={fileError.message} />)}
                        {userError && (<ErrorBox title="User profile change failed" message={userError.message} />)}
                        {updateSuccess && (<SuccessBox status={`success`} title="Profile Update Successful" message="Congratulations, you have successfully updated your profile." setUpdateSuccess={setUpdateSuccess} />)}

                        <Stack spacing={4} p={4}>
                            <Box>
                                <Text fontWeight="500" color="gray.500">Name</Text>
                                <Input variant="flushed" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            </Box>
                            <Box>
                                <Text fontWeight="500" color="gray.500">Mobile Number</Text>
                                <Input variant="flushed" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                            </Box>
                            <Box>
                                <Text fontWeight="500" color="gray.500">Email Address</Text>
                                <Input variant="flushed" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Box>
                            <Box>
                                <Text fontWeight="500" color="gray.500">Update Password</Text>
                                <InputGroup>
                                    <Input variant="flushed" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <InputRightElement mr={2}>
                                        <IconButton aria-label="Show password" variant="ghost" icon={show ? <FaI.FaRegEyeSlash /> : <FaI.FaRegEye />} onClick={handleShowPassword} />
                                    </InputRightElement>
                                </InputGroup>
                            </Box>
                        </Stack>
                        <Flex px={3} pb={3}>
                            <Spacer />
                            <SaveChanges handleSave={handleSave} isUserUpdating={isUserUpdating} isUploading={isUploading} />
                            <Button ml={4} onClick={() => window.location.reload()} isLoading={isUserUpdating} >Reset<Icon as={VsC.VscClearAll} w={6} h={6} ml={2} /></Button>
                        </Flex>
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
