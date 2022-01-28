import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams, Route, Switch, useLocation } from 'react-router-dom';
import { useMoralis, useMoralisSubscription, useMoralisQuery } from "react-moralis";
import Web3 from "web3";
import Moralis from "moralis";
import { Button, Box, Container, Text, Icon, useColorModeValue, Stack, useColorMode, Tabs, TabList, Tab, TabPanels, TabPanel, Flex, useToast } from "@chakra-ui/react";
import Header from '../header/Header';
import FootNav from '../footnav/FootNav';
import WalletMain from '../wallet/WalletMain';
import TxHistory from '../wallet/TxHistory';
import Staking from '../wallet/Staking';
import * as Io5 from "react-icons/io5";
import * as AiI from "react-icons/ai";
import { SiteStateContext } from '../context/SiteStateContext';
import HDWalletProvider from '@truffle/hdwallet-provider';
import ErrorDialog from "../error/ErrorDialog";
import YouWhoLoading from '../misc/YouWhoLoading';


export default function Wallet() {

    const { user, setUserData } = useMoralis();
    const { siteIsLoading3, setSiteIsLoading3 } = useContext(SiteStateContext);
    const { tab, address, transType } = useParams();
    const { colorMode } = useColorMode();
    const [encryptedEthAccount, setEncryptedEthAccount] = useState({});
    const [web3, setWeb3] = useState("");
    const [ethAddress, setEthAddress] = useState(user.attributes.ethAddress);
    const [userBalances, setUserBalances] = useState("");
    const [userAvaxBalance, setUserAvaxBalance] = useState("");
    const [balance, setBalance] = useState("");
    const [errorContents, setErrorContents] = useState([]);
    const [updateBalance, setUpdateBalance] = useState(false);
    const [acceptedCryptosArray, setAcceptedCryptosArray] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const history = useHistory();
    const location = useLocation();
    const toast = useToast();
    const toastIdToken = "token-balance-updated";
    const toastIdAvax = "avax-balance-updated";

    // const pk = require("./secrets.json").pk;
    // const rinkebySpeedyNode = require("./secrets.json").rinkebySpeedyNode;

    // console.log("address", address)
    // console.log("transType", transType)
    // console.log("tab", tab)
    // console.log("address  transType ", (tab === undefined) ? true : false)
    // console.log("location", location)

    // useMoralisSubscription("AvaxBalance", q => q.equalTo("address", user.attributes.ethAddress), [], {
    //     onCreate: () => {
    //         setUpdateBalance(!updateBalance);
    //     },
    //     onUpdate: () => {
    //         setUpdateBalance(!updateBalance);
    //     },
    //     // enabled: user ? true : false,
    // });

    // useMoralisSubscription("AvaxTokenBalance", q => q.equalTo("address", user.attributes.ethAddress), [], {
    //     onCreate: () => {
    //         setUpdateBalance(!updateBalance);
    //     },
    //     onUpdate: () => {
    //         setUpdateBalance(!updateBalance);
    //     },
    //     // enabled: user ? true : false,
    // });

    const { data: tokenData } = useMoralisQuery(
        "AvaxTokenBalance",
        query =>
            query
                .equalTo("address", user.attributes.ethAddress),
        [],
        {
            live: true,
            onLiveUpdate: () => {
                setUpdateBalance(!updateBalance);
                console.log("updated token");
                if (!toast.isActive(toastIdToken)) {
                    toast({
                        id: toastIdToken,
                        position: "top",
                        title: "Token Balance Updated",
                        description: "Your token balances have been updated.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        render: () => (
                            <Box as="button" textAlign="left" onClick={() => history.push("/account/events")} w={["94vw", "512px", "", ""]} position="fixed" top="0" left="50%" p={4} pb={5} ml={["-47vw", "-251px", "", ""]} color="primary.600" bg="primary.100" borderBottomRadius="lg">
                                <Text fontWeight="600"><Icon as={AiI.AiOutlineExclamationCircle} mr={1} mb="4px" />Token Balance Updated</Text>
                                <Text>Your token balances have been updated.</Text>
                            </Box>
                        ),
                    });
                };
            },
        },
    );

    const { data: ethData } = useMoralisQuery(
        "AvaxBalance",
        query =>
            query
                .equalTo("address", user.attributes.ethAddress),
        [],
        {
            live: true,
            onLiveUpdate: () => {
                setUpdateBalance(!updateBalance);
                console.log("updated avax");
                if (!toast.isActive(toastIdAvax)) {
                    toast({
                        id: toastIdAvax,
                        position: "top",
                        title: "AVAX Balance Updated",
                        description: "Your AVAX balance has been updated.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        render: () => (
                            <Box as="button" textAlign="left" onClick={() => history.push("/account/events")} w={["94vw", "512px", "", ""]} position="fixed" top="0" left="50%" p={4} pb={5} ml={["-47vw", "-251px", "", ""]} color="green.600" bg="green.100" borderBottomRadius="lg">
                                <Text fontWeight="600"><Icon as={AiI.AiOutlineExclamationCircle} mr={1} mb="4px" />AVAX Balance Updated</Text>
                                <Text>Your AVAX balance has been updated.</Text>
                            </Box>
                        ),

                    });
                };
            },
        },
    );


    useEffect(() => {

        if (tab === undefined) {
            history.push(`/wallet/main/${user.attributes.ethAddress}`);
        }

        (async () => {

            setSiteIsLoading3(true);

            let queryYouWho = new Moralis.Query("YouWho");
            let acceptedCryptos = await queryYouWho.first();

            let acceptedCryptosAddresses = acceptedCryptos.attributes.acceptedCryptos.map(x => x.toLowerCase());
            setAcceptedCryptosArray(acceptedCryptosAddresses);

            const AvaxTokenBalance = Moralis.Object.extend("AvaxTokenBalance");
            let queryUserBalances = new Moralis.Query(AvaxTokenBalance);
            queryUserBalances.containedIn("token_address", acceptedCryptosAddresses);
            queryUserBalances.equalTo("address", user.attributes.ethAddress);
            queryUserBalances.descending("updatedAt");

            let userBalances1 = await queryUserBalances.find();
            // console.log("userBalances", userBalances1);
            setUserBalances(userBalances1);


            const AvaxBalance = Moralis.Object.extend("AvaxBalance");
            let queryUserAvaxBalance = new Moralis.Query(AvaxBalance);
            queryUserAvaxBalance.equalTo("address", user.attributes.ethAddress);

            let userAvaxBalance1 = await queryUserAvaxBalance.first();
            // console.log("userAvaxBalance", userAvaxBalance1);
            setUserAvaxBalance(userAvaxBalance1);


            await loadBlockchainData();

            setSiteIsLoading3(false);

        })();

        // let acceptedCryptos = [{ "name": "youwho", "ticker": "YOU", "address": "0xfDe24B1EaC568e2f963F026bEB494534E17741e4" }, { "name": "youwho USD", "ticker": "YOUUSD", "address": "0x7c875FCdf6728E16c51CFC542341110A9DD469cC" }]
        // let acceptedCryptos = ["0xfDe24B1EaC568e2f963F026bEB494534E17741e4" ,"0x7c875FCdf6728E16c51CFC542341110A9DD469cC"]

    }, [updateBalance])


    let loadBlockchainData = async () => {

        if (typeof window.ethereum !== 'undefined') {

            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            // console.log("accounts",accounts);
            // console.log("netId",netId);

            if (typeof accounts[0] !== 'undefined') {
                const balanceAvax = await web3.eth.getBalance(accounts[0]);
                setBalance(balanceAvax);

                setEthAddress(accounts[0]);
                // console.log("accounts[0]",accounts[0])
                setWeb3(web3);
                // console.log("web3",web3)
            } else {
                window.alert('Please login with MetaMask');
            }

        } else {
            setEthAddress(user.attributes.ethAddress);
            setErrorContents(["MetaMask Not Installed", "MetaMask is not installed on your device, please install it to be able to make payments with YouWho.io."]);
            setShowAlert(true);
            // window.alert('Please install MetaMask');
        }

    }

    // console.log(user.attributes.accounts);

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
                <Container minHeight={["91vh", "400px", "", ""]} maxW="lg" borderRadius={["0", "xl", "xl", "xl"]} px={[4, 6, "", ""]} pb={[4, 6, "", ""]} pt={[1, 5, "", ""]} mb={["60px", "0", "", ""]} >
                    {showAlert && (<ErrorDialog title={errorContents[0]} message={errorContents[1]} showAlert={showAlert} setShowAlert={setShowAlert} />)}

                    <Flex mb={3}>
                        <Text fontWeight="400" fontSize="3xl" ml={1} color={grayText2} style={{ display: "flex", alignItems: "center" }} ><Icon as={Io5.IoWalletOutline} color="primary.400" mr={2} />My Wallet</Text>
                    </Flex>
                    <Tabs isFitted variant="enclosed" defaultIndex={tab === "history" ? 1 : tab === "staking" ? 2 : 0}>

                        <TabList borderBottom="1px" borderColor="gray.10" mb={3} >
                            <Tab px={1} color="primary.400" _selected={{ fontWeight: "500", color: "primary.600", bg: "primary.100", borderTopRadius: "lg", }} onClick={() => history.push(`/wallet/main/${ethAddress}`)}> wallet</Tab>
                            <Tab px={1} color="primary.400" _selected={{ fontWeight: "500", color: "primary.600", bg: "primary.100", borderTopRadius: "lg", }} onClick={() => history.push(`/wallet/history/${ethAddress}`)}> history</Tab>
                            <Tab px={1} color="primary.400" _selected={{ fontWeight: "500", color: "primary.600", bg: "primary.100", borderTopRadius: "lg", }} onClick={() => history.push(`/wallet/staking/${ethAddress}`)}> staking</Tab>
                        </TabList>
                        {siteIsLoading3 ?
                            <YouWhoLoading />
                            :
                            <TabPanels >

                                <TabPanel align="start" borderBottomRadius="lg" borderTopRightRadius="lg" p={["0", "", "", ""]}>
                                    <WalletMain
                                        ethAddress={ethAddress}
                                        setEthAddress={setEthAddress}
                                        userBalances={userBalances}
                                        userAvaxBalance={userAvaxBalance}
                                    />
                                </TabPanel>

                                <TabPanel align="start" borderBottomRadius="lg" borderTopRightRadius="lg" p={["0", "", "", ""]}>
                                    <TxHistory
                                        ethAddress={ethAddress}
                                        userBalances={userBalances}
                                    />
                                </TabPanel>

                                <TabPanel align="start" borderBottomRadius="lg" borderTopRightRadius="lg" p={["0", "", "", ""]}>
                                    <Staking />
                                </TabPanel>

                            </TabPanels>
                        }
                    </Tabs >
                </Container>
            </Box>
            <FootNav />
            {showAlert && (<ErrorDialog title={errorContents[0]} message={errorContents[1]} showAlert={showAlert} setShowAlert={setShowAlert} />)}
        </Box>
    )
}
