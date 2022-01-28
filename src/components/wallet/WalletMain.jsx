import React, { useEffect, useState } from 'react';
import { Button, Box, Center, Container, Text, Spacer, Icon, IconButton, useColorModeValue, Stack, useColorMode, Tabs, TabList, Tab, TabPanels, TabPanel, Flex } from "@chakra-ui/react";
import Moralis from "moralis";
import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';
import * as HiI from "react-icons/hi";
import * as RiI from "react-icons/ri";
import * as Io5 from "react-icons/io5";
import * as BsI from "react-icons/bs";
import * as FaI from "react-icons/fa";
import * as BiI from "react-icons/bi";
import { useHistory, useParams } from 'react-router-dom';
import { useMoralis } from 'react-moralis';
import Transactions from './Transactions';


export default function WalletMain({ ethAddress, setEthAddress, userBalances, userEthBalance }) {

    const { user, setUserData, web3 } = useMoralis();
    const { colorMode } = useColorMode();
    const [swapFrom, setSwapFrom] = useState(<Text><Icon as={FaI.FaEthereum} mr={1} mb="4px" />Ether</Text>);
    const [swapTo, setSwapTo] = useState(<Text><Icon as={BiI.BiDollar} w={5} h={5} mb="4px" />YouWho USD</Text>);

    // const { tab, address, transType } = useParams();
    // const [encryptedEthAccount, setEncryptedEthAccount] = useState({});
    // const [uweb3, setUweb3] = useState(web3);
    // const [errorContents, setErrorContents] = useState([]);
    // const [showAlert, setShowAlert] = useState(false);
    const history = useHistory();


    const handleSwapSwap = () => {

        let oldSwapFrom = swapFrom;

        setSwapFrom(swapTo);
        setSwapTo(oldSwapFrom);
    }


    const grayText = colorMode === "light" ? "gray.500" : "gray.400";
    const grayText2 = colorMode === "light" ? "gray.600" : "gray.100";

    if (userBalances && userEthBalance) {

        return (
            <Stack spacing="4">
                <Box borderBottom="1px" pb={5} pt={3} borderColor="gray.10" >
                    <Text px={1} color={grayText2} fontWeight="400">Wallet Address</Text>
                    <Text as="a" target="_blank" href={`https://testnet.snowtrace.io/address/${ethAddress}`} px={1} fontWeight="500" color={colorMode === "light" ? "primary.600" : "primary.200"}>{ethAddress}</Text>
                </Box>

                <Box borderBottom="1px" pb={5} borderColor="gray.10" >
                    <Text px={1} color={grayText2} fontWeight="400">Token Balances</Text>
                    <Text px={2} mb={2} color={grayText} fontWeight="300" fontSize="xs">Note: Clicking on a token balance will take you to Etherscan.io which contains more detailed information.</Text>
                    <Stack spacing="3" px={["0", "6", "", ""]}>
                        <Flex bg="gray.10" borderRadius="md" p={["2", "4", "", ""]} as="a" target="_blank" href={`https://testnet.snowtrace.io/address/${ethAddress}`}>
                            <Text fontWeight="500" color="secondary.300">Ether<Icon as={HiI.HiOutlineExternalLink} ml={1} mb="3px" w={4} h={4} /></Text>
                            <Spacer />
                            <Text fontWeight="600">{Number(userEthBalance.attributes.balance / (10 ** 18)).toFixed(2)}</Text>
                            <Text ml={1}>ETH</Text>
                        </Flex>
                        {userBalances.map((x, i) =>
                            <Flex bg="gray.10" key={i + "flex"} borderRadius="md" p={["2", "4", "", ""]} as="a" target="_blank" href={`https://testnet.snowtrace.io/token/${x.attributes.token_address}?a=${ethAddress}`}>
                                <Text fontWeight="500" color="primary.400">{x.attributes.name}<Icon as={HiI.HiOutlineExternalLink} ml={1} mb="3px" w={4} h={4} /></Text>
                                <Spacer />
                                <Text fontWeight="600">{Number(x.attributes.balance / (10 ** x.attributes.decimals)).toFixed(2)}</Text>
                                <Text ml={1}>{x.attributes.symbol}</Text>
                            </Flex>
                        )}
                    </Stack>
                </Box>

                <Box >
                    <Text px={1} color={grayText2} fontWeight="400">Swap Tokens</Text>
                    <Text px={2} mb={2} color={grayText} fontWeight="300" fontSize="xs">Note: uses 1inch.exchange protocol</Text>
                    <Box mx="auto" w={["100%", "80%", "", ""]} p={6} borderRadius="lg" borderWidth="1px" borderColor="gray.10" align="center">
                        <Center p={["2", "4", "", ""]} w="80%" bg="gray.10" borderRadius="md" >
                            <Text fontWeight="600" color="secondary.300" fontSize="lg">{swapFrom}</Text>
                        </Center>
                        <Center p={["2", "4", "", ""]}>
                            <IconButton icon={<RiI.RiArrowUpDownLine />} fontSize="18px" variant="ghost" w={6} h={6} onClick={handleSwapSwap} />
                        </Center>
                        <Center p={["2", "4", "", ""]} w="80%" bg="gray.10" borderRadius="md" >
                            <Text fontWeight="600" color="primary.400" fontSize="lg">{swapTo}</Text>
                        </Center >
                        <Center mt={5}>
                            <Button px={["8", "8", "", ""]} color="secondary.500" bg="secondary.100" _hover={{ bg: "secondary.200" }} _focus={{ bg: "secondary.100" }} _active={{ bg: "secondary.100" }}><Icon as={BsI.BsArrowRepeat} mr={2} h={5} w={5} />Swap Now</Button>
                        </Center>
                    </Box>
                </Box>
            </Stack>
        )

    }

    return (
        <>
        </>
    )
}

// <Button onClick={createEthWallet}>Create New Eth Wallet</Button>
// <Button onClick={getEncryptedWallet}>Get Eth Wallet</Button>
// <Button onClick={decryptEthWallet}>Decrypt Eth Wallet</Button>
// <Button onClick={deleteEthWallet}>Delete Eth Wallet</Button>


// let provider;

//     const createEthWallet = async () => {
//         try {
//             let newEthAccount = uweb3.eth.accounts.create();
//             const encryptedEthAccount = uweb3.eth.accounts.encrypt(newEthAccount.privateKey, window.prompt("Please enter your wallet password"));
//             await setUserData({
//                 encryptedEthAccount: { address: newEthAccount.address, file: encryptedEthAccount },
//             });

//             setEncryptedEthAccount(encryptedEthAccount);

//             console.log("unenc", newEthAccount.address);
//             console.log("user", user);
//             newEthAccount = null;

//             // console.log(web3.utils.fromWei(balance, "ether"))
//         } catch (error) {
//             console.log(error);
//         }
//     };

    // console.log("enc", encryptedEthAccount);
    // console.log("eth", ethAddress);


    // const getEncryptedWallet = async () => {
    //     setEncryptedEthAccount(user.attributes.encryptedEthAccount ? user.attributes.encryptedEthAccount : {})
    // };


    // const decryptEthWallet = async () => {
    //     try {
    //         let decryptedAccount = uweb3.eth.accounts.decrypt(encryptedEthAccount.file, window.prompt("Please enter your wallet password"));
    //         console.log("dec", decryptedAccount);
    //         setEthAddress(decryptedAccount.address);
    //         console.log("g1")
    //         console.log(process.env.REACT_APP_RINKEBY_SPEEDY_NODE)
    //         provider = new HDWalletProvider(decryptedAccount.privateKey, process.env.REACT_APP_RINKEBY_SPEEDY_NODE);
    //         console.log("gah")
    //         var uWeb3 = new Web3(provider);
    //         setUweb3(uWeb3);
    //         provider.engine.stop();

    //         uWeb3.eth.getAccounts(console.log);
    //         try {
    //             console.log("uweb3 Eth:", await uWeb3.eth.getBalance(decryptedAccount.address));
    //         } catch (error) {
    //             setErrorContents(["Error getting wallet info", error.message]);
    //             setShowAlert(true);
    //         }

    //         decryptedAccount = null;

    //     } catch (error) {
    //         console.log(error);
    //         alert("wrong wallet password");
    //     }
    // }

    // const deleteEthWallet = async () => {
    //     user.unset("encryptedEthAccount");
    //     await user.save();
    //     setEthAddress("");
    //     console.log('delete');
    // }