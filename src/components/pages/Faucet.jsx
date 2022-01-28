import React, { useState } from 'react';
import { Box, Container, Text, Icon, useColorModeValue, Button, Stack, Input, InputGroup, useToast } from "@chakra-ui/react";
import Header from '../header/Header';
import { GiTap } from 'react-icons/gi';
import { useMoralis } from "react-moralis";



export default function Faucet() {
    const toast = useToast()
    const { Moralis } = useMoralis();
    const [address, setAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const optionsYou = {
        address: '0x10c505be55b249d83a093e99cb2ff78965651009',
        symbol: 'YOU',
        decimals: 18,
        image: 'https://you.youwho.io/static/logos/svg/youwho-teal_logo-pill.svg',
    };
    const optionsYouusd = {
        address: '0x2fac624899a844e0628bfdcc70efcd25f6e90b95',
        symbol: 'YOUUSD',
        decimals: 18,
        image: 'https://assets.coingecko.com/coins/images/325/small/Tether-logo.png',
    }


    const mintTokens = async (amount, token) => {

        setIsLoading(true)
        try {
            const res = await Moralis.Cloud.run("mintTokens", { amount, token, address })
            if (res) {
                toast({
                    position: 'top',
                    title: "Mint Success",
                    description: `${amount} $${token.toUpperCase()} tokens minted to ${address}`,
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                    containerStyle: {
                        width: '400px',
                        maxWidth: '100%',
                    },
                });

                if (token === "you") {
                    window.ethereum
                        .request({
                            method: 'wallet_watchAsset',
                            params: {
                                type: 'ERC20',
                                options: optionsYou,
                            },
                        })
                        .then((success) => {
                            if (success) {
                                console.log('YOU successfully added to wallet!');
                            } else {
                                throw new Error('Something went wrong.');
                            }
                        })
                        .catch(console.error);
                }

                if (token === "usd") {
                    window.ethereum
                        .request({
                            method: 'wallet_watchAsset',
                            params: {
                                type: 'ERC20',
                                options: optionsYouusd,
                            },
                        })
                        .then((success) => {
                            if (success) {
                                console.log('YOUUSD successfully added to wallet!');
                            } else {
                                throw new Error('Something went wrong.');
                            }
                        })
                        .catch(console.error);
                }
            }
            setAddress("");
            setIsLoading(false);
        } catch (error) {
            console.log(error); setIsLoading(false);
            toast({
                position: 'top',
                title: "Mint Error",
                description: `Failed to mint ${amount} $${token.toUpperCase()} tokens to ${address}`,
                status: 'error',
                duration: 9000,
                isClosable: true,
                containerStyle: {
                    width: '400px',
                    maxWidth: '100%',
                },
            });
        }
    }

    const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(249,249,249,0.07) 50%, rgba(249,249,249,0.0) 100%)";
    // const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(255,217,29,0.05) 50%, rgba(249,249,249,0.0) 100%)";
    // const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(255,217,29,0.05) 0%, rgba(0,201,153,0.07) 50%, rgba(249,249,249,0.0) 100%)";

    // const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(249,249,249,0.07) 50%, rgba(249,249,249,0.0) 100%)";

    const bgGradientDark = "radial-gradient(circle at 80vw -30vh, rgba(0,201,153, 0.25) 0%, rgba(13,110,253,0.15) 35%, rgba(19,19,19,0.5) 100%)";
    const bg = useColorModeValue(bgGradientLight, bgGradientDark);

    return (
        <Box w="100%" minH="100vh" minW="100vw" h="100%" p={0} bg={bg}>
            <Header displayFilter={"none"} bgSearch={"none"} />
            <Box p={[3, 4, 6, 8]} pt={["15%", "60px", ,]}>
                <Container minHeight="200px" maxW="lg" borderRadius="xl" p="0" overflow="hidden">
                    <Box px="6" pb="0" pb="4" pt="4" bg="gray.10" >
                        <Text fontSize={["8vw", "4xl", "4xl", "4xl"]} fontWeight="500" color="blue.500" style={{ display: "flex", alignItems: "center" }}><Icon as={GiTap} fontSize={["xl", "3xl", "3xl", "3xl"]} mr="1" pb="1" />Faucet</Text>
                        <Text fontSize={["4vw", "md", "md", "md"]}>Send mock $YOU and $USD tokens to your Avalanche C-Chain wallet address for use with the <Text as="span" fontSize={["6vw", "2xl", "2xl", "2xl"]} color="gray.700">Serve Demo</Text></Text>
                    </Box>
                    <Stack px="5" pt="4" pb="8" align="center" spacing="6" w="100%" >
                        <Stack pb="3" spacing="2" w="100%">
                            <Text>If you do not have testnet AVAX in your wallet, click on the button below to head to the official testnet Avax faucet page.</Text>
                            <Button isLoading={isLoading} as="a" size="lg" colorScheme="red" href="https://faucet.avax-test.network/" target="blank">Avax Testnet Faucet</Button>
                        </Stack>
                        <Stack pb="3" spacing="2" w="100%">
                            <InputGroup size='lg'>
                                <Input isDisabled={isLoading} placeholder='enter your Avalanche Fuji C-Chain address' onChange={e => setAddress(e.target.value)} />
                            </InputGroup>
                            <Button isLoading={isLoading} size="lg" colorScheme="primary" onClick={() => mintTokens("100", "you")}>Send 100 $YOU</Button>
                        </Stack>
                        <Stack pb="3" spacing="2" w="100%">
                            <InputGroup size='lg'>
                                <Input isDisabled={isLoading} placeholder='enter your Avalanche Fuji C-Chain address' onChange={e => setAddress(e.target.value)} />
                            </InputGroup>
                            <Button isLoading={isLoading} size="lg" colorScheme="secondary" onClick={() => mintTokens("100", "usd")}>Send 100 $USD</Button>
                        </Stack>

                    </Stack>
                </Container>
            </Box>
        </Box>
    )
}

// <Button onClick={() => { document.getElementById("main-search").focus(); document.getElementById("main-search-group").classList.add("focusSearch"); setTimeout(() => { document.getElementById("main-search-group").classList.remove("focusSearch") }, 1000) }} bg="secondary.100" _hover={{ bg: "secondary.200" }} _focus={{ bg: "secondary.100" }} _active={{ bg: "secondary.100" }} p="6">
