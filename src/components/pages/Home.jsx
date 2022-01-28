import React, { useContext, useEffect } from 'react';
import { Box, Center, Container, Text, Icon, useColorModeValue, Button, Stack, useDisclosure, Heading, Divider } from "@chakra-ui/react";
import Header from '../header/Header';
import { init } from 'ityped';
import * as FaI from 'react-icons/fa';
import * as FiI from 'react-icons/fi';
import { GiTap } from 'react-icons/gi';
import * as RiI from 'react-icons/ri';
import ModalLogin from '../login/ModalLogin';
import { useMoralis } from "react-moralis";
import { useHistory } from 'react-router';
import { SiteStateContext } from '../context/SiteStateContext';


export default function Home() {

    const { setYouWhoSwitch } = useContext(SiteStateContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = useMoralis();
    const history = useHistory();

    useEffect(() => {
        // history.push("/search");
        const myServices = document.querySelector('#services');
        init(myServices, { loop: true, typeSpeed: 100, backSpeed: 100, backDelay: 1500, strings: ['Electrician', 'Maid', 'Nurse', 'Cook', 'Tradesman', 'Engineer', 'Doctor', 'Plumber', 'Programmer', 'Architect', 'Craftsman', 'Technician', 'Gardener', 'Mechanic', 'Friend',] });
        // eslint-disable-next-line
    }, []);

    const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(249,249,249,0.07) 50%, rgba(249,249,249,0.0) 100%)";
    // const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(255,217,29,0.05) 50%, rgba(249,249,249,0.0) 100%)";
    // const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(255,217,29,0.05) 0%, rgba(0,201,153,0.07) 50%, rgba(249,249,249,0.0) 100%)";

    // const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(249,249,249,0.07) 50%, rgba(249,249,249,0.0) 100%)";

    const bgGradientDark = "radial-gradient(circle at 80vw -30vh, rgba(0,201,153, 0.25) 0%, rgba(13,110,253,0.15) 35%, rgba(19,19,19,0.5) 100%)";
    const bg = useColorModeValue(bgGradientLight, bgGradientDark);

    return (
        <Box w="100%" minH="100vh" minW="100vw" h="100%" p={0} bg={bg}>
            <Header displayFilter={"none"} bgSearch={"none"} />
            <Box p={[3, 4, 6, 8]} pt={["15%", "100px", "100px", "100px"]}>
                <Container minHeight="200px" maxW="lg" borderRadius="xl" p="0" overflow="hidden">
                    <Box px="6" pb="0" pb="4" pt="4" bg="gray.10" >
                        <Text fontSize={["6vw", "3xl", "3xl", "3xl"]} color="gray.500">Welcome to <Heading as="span" fontSize={["8vw", "4xl", "4xl", "4xl"]} fontWeight="500" color="primary.500">Serve</Heading><Icon as={FaI.FaHandSpock} fontSize={["lg", "2xl", "2xl", "2xl"]} mb="1" ml="2" color="cream.500" /></Text>
                        <Text align="center" fontSize={["4vw", "md", "md", "md"]}>a Decentralized Services Marketplace</Text>
                    </Box>
                    <Stack px="5" pt="4" pb="8" align="center" >
                        <Box pb="3">
                            <Text fontSize={["3.5vw", "sm", "sm", "sm"]}>Please choose whether you need a service or are a service provider.</Text>
                        </Box>
                        <Button onClick={() => history.push("/search?query=")} bg="secondary.100" _hover={{ bg: "secondary.200" }} _focus={{ bg: "secondary.100" }} _active={{ bg: "secondary.100" }} p="6">
                            <Text fontWeight="400" color="secondary.500" fontSize="xl" style={{ display: "flex", alignItems: "center" }}><Icon as={RiI.RiUserSearchLine} fontSize={["lg", "2xl", "2xl", "2xl"]} mr="1" pb="1" />I need a<Icon as={FiI.FiCornerRightDown} fontSize={["lg", "2xl", "2xl", "2xl"]} ml="1" /></Text>
                        </Button>
                        <Center minHeight="14" role="button" onClick={() => history.push("/search?query=")} >
                            <Text fontSize="4xl" id="services"></Text>
                        </Center>
                        <Button onClick={user ? () => { setYouWhoSwitch(true); window.localStorage.setItem("youWhoSwitch", true); history.push("/activity/who"); } : onOpen} bg="primary.100" _hover={{ bg: "primary.200" }} _focus={{ bg: "primary.100" }} _active={{ bg: "primary.100" }} p="6">
                            <Text fontWeight="400" color="primary.600" fontSize="xl" style={{ display: "flex", alignItems: "center" }}><Icon as={RiI.RiServiceLine} fontSize={["lg", "2xl", "2xl", "2xl"]} mr="1" pb="1" />I am a <Icon as={FiI.FiCornerRightUp} fontSize={["lg", "2xl", "2xl", "2xl"]} /></Text>
                        </Button>
                        <Box py="20px" w="90%" >
                            <Divider />
                        </Box>
                        <Button onClick={() => history.push("/faucet")} bg="blue.100" _hover={{ bg: "blue.200" }} _focus={{ bg: "blue.100" }} _active={{ bg: "blue.100" }} p={6}>
                            <Text fontWeight="400" color="blue.600" fontSize="xl" style={{ display: "flex", alignItems: "center" }}><Icon as={GiTap} fontSize={["lg", "2xl", "2xl", "2xl"]} mr="1" pb="1" />Get mock coins from Faucet</Text>
                        </Button>
                        <ModalLogin isOpen={isOpen} onClose={onClose} />
                    </Stack>
                </Container>
            </Box>
        </Box>
    )
}

// <Button onClick={() => { document.getElementById("main-search").focus(); document.getElementById("main-search-group").classList.add("focusSearch"); setTimeout(() => { document.getElementById("main-search-group").classList.remove("focusSearch") }, 1000) }} bg="secondary.100" _hover={{ bg: "secondary.200" }} _focus={{ bg: "secondary.100" }} _active={{ bg: "secondary.100" }} p="6">
