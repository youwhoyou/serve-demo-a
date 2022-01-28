import React, { useContext, useEffect, useState } from 'react';
import { Text, Center, Stack, Spinner, Box, Flex, IconButton, Spacer, Button, useDisclosure, Icon, Image, Container, AspectRatio, useToast, useColorMode, Avatar, ModalFooter, ModalHeader, ModalCloseButton, ModalBody, Modal, ModalOverlay, ModalContent, Input, useRadioGroup, useRadio, HStack, RadioGroup, NumberInput, InputGroup, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputLeftElement } from "@chakra-ui/react";
import Web3 from 'web3';
import YouWhoDapp from '../../abis/YouWhoDapp.json';
import YouWho from '../../abis/YouWho.json';
import YouWhoUSD from '../../abis/YouWhoUSD.json';
import * as BsI from "react-icons/bs";
import * as Io5 from "react-icons/io5";
import * as FaI from "react-icons/fa";
import * as HiI from "react-icons/hi";
import * as FcI from "react-icons/fc";
import * as BiI from "react-icons/bi";
import * as RiI from "react-icons/ri";
import { SiteStateContext } from '../context/SiteStateContext';
import YouWhoLoading from '../misc/YouWhoLoading';
import ReactStars from "react-rating-stars-component";
import Moralis from "moralis";
import { useMoralis } from "react-moralis";




export default function Payment({ history, grayText2, grayText, bookingId, ethAddress, setEthAddress, bookingUser, setBookingUser, booking, setBooking, bookingPublic, setBookingPublic, bookingApproval, setBookingApproval, ethAddresses, setEthAddresses, bookingStatus, setBookingStatus, rateAgreed, setRateAgreed, durationHours, setDurationHours, serviceLocation, setServiceLocation, paidAmountUsd, setPaidAmountUsd, dayTime, setDayTime }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = useMoralis();
    const { colorMode } = useColorMode();
    const [web3, setWeb3] = useState('undefined');
    const [account, setAccount] = useState("");
    const [youusd, setYouusd] = useState({});
    const [youDapp, setYouDapp] = useState({});
    const [provider, setProvider] = useState("");
    const [providerName, setProviderName] = useState("");
    const [newPayment, setNewPayment] = useState("");
    const [myYouusdAllowance, setMyYouusdAllowance] = useState(0);
    const { siteIsLoading2, setSiteIsLoading2, siteIsLoading, setSiteIsLoading, siteIsLoading3, setSiteIsLoading3 } = useContext(SiteStateContext);
    const [crypto, setCrypto] = useState("ETH");
    const [cryptoPrice, setCryptoPrice] = useState("");
    const [cryptoDecimals, setCryptoDecimals] = useState(8);
    const [reviewRating, setReviewRating] = useState(35);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // console.log("booking", booking);
    // console.log("bookingPublic", bookingPublic.id);
    // console.log("bookingStatus", bookingStatus);
    // console.log("provider", provider);
    console.log("myYouusdAllowance", myYouusdAllowance);
    console.log("ethAddresse", ethAddress);


    useEffect(() => {
        (async () => {

            setSiteIsLoading3(true);

            await loadBlockchainData().catch((e) => {
                console.log(e);

            });
            // console.log("RESULTSLS")
            let Bookings = Moralis.Object.extend("Bookings");
            const queryBookings = new Moralis.Query(Bookings);
            queryBookings.equalTo("objectId", bookingId);
            queryBookings.include("provider");

            let queryBooking = await queryBookings.first()

            if (queryBooking) {
                console.log("booking", queryBooking)
                setBooking(queryBooking);
                setProvider(queryBooking.attributes.service.attributes.providerPublic);
                setProviderName(queryBooking.attributes.service.attributes.providerPublic.attributes.username);


            }


            let BookingsPublic = Moralis.Object.extend("BookingsPublic");
            const queryBookingsPublic = new Moralis.Query(BookingsPublic);
            queryBookingsPublic.equalTo("booking", queryBooking);

            let queryBookingPublic = await queryBookingsPublic.first()
            if (queryBookingPublic) {
                setBookingPublic(queryBookingPublic);
                setBookingStatus(queryBookingPublic.attributes.approval);
                console.log("bookingPublic", queryBookingPublic)
            }


            setSiteIsLoading3(false);



        })();
    }, [])

    const ratingStars = {
        size: 10,
        count: 5,
        color: "#718096",
        activeColor: "#ff7e4c",
        value: 3.5,
        a11y: true,
        isHalf: true,
        emptyIcon: <Icon w={8} h={8} as={BsI.BsStar} />,
        halfIcon: <Icon w={8} h={8} as={BsI.BsStarHalf} />,
        filledIcon: <Icon w={8} h={8} as={BsI.BsStarFill} />,
        onChange: newValue => { setReviewRating(newValue * 10); }
    };




    let loadBlockchainData = async () => {

        if (typeof window.ethereum !== 'undefined') {
            setSiteIsLoading3(true);

            const web3 = new Web3(window.ethereum);
            const netId = await web3.eth.net.getId();
            const accounts = await web3.eth.getAccounts();

            // console.log("accounts",accounts);
            // console.log("netId",netId);


            if (typeof accounts[0] !== 'undefined') {
                const balance = await web3.eth.getBalance(accounts[0]);
                setAccount(accounts[0]);
                setWeb3(web3);
                // console.log("web3",web3)
            } else {
                window.alert('Please login with MetaMask');
            }

            try {

                const youusdC = new web3.eth.Contract(YouWhoUSD.abi, YouWhoUSD.networks[netId].address);
                setYouusd(youusdC);

                const currYouusdAllowance = await youusdC.methods.allowance(accounts[0], YouWhoDapp.networks[netId].address).call({ from: accounts[0] });
                setMyYouusdAllowance(currYouusdAllowance);
                // console.log("myYouusdAllowance", currYouusdAllowance);

                const youDappC = new web3.eth.Contract(YouWhoDapp.abi, YouWhoDapp.networks[netId].address);
                setYouDapp(youDappC);
                // console.log('youDapp contract: ', youDappC);

                await youDappC.methods.tokenMapping(web3.utils.asciiToHex(crypto)).call({ from: account }).then(async (result) => {
                    setCryptoDecimals(result["manualOracleDecimals"]);
                    const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
                    const addr = result["oracleAddress"];
                    const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);
                    priceFeed.methods.latestRoundData().call()
                        .then((roundData) => {
                            console.log("Latest Price", roundData["answer"] / 10 ** cryptoDecimals);
                            setCryptoPrice(Number(roundData["answer"] / 10 ** cryptoDecimals).toFixed(2));
                            setSiteIsLoading3(false);
                        });
                });

            } catch (e) {
                console.log('Error', e);
                window.alert('Contract not deployed to the current network');
                setSiteIsLoading3(false);
            }

        } else {
            // setEthAddress(user.attributes.ethAddress);
            // window.alert('Please install MetaMask');
        }

    }


    const getTokenPrice = async () => {

        if (youDapp !== 'undefined') {
            try {
                await youDapp.methods.tokenMapping(web3.utils.asciiToHex(crypto)).call({ from: account }).then(async (result) => {
                    setCryptoDecimals(result["manualOracleDecimals"]);
                    const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
                    const addr = result["oracleAddress"];
                    const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);
                    priceFeed.methods.latestRoundData().call()
                        .then((roundData) => {
                            // console.log("Latest Price", roundData["answer"] / 10**cryptoDecimals);
                            setCryptoPrice(Number(roundData["answer"] / 10 ** cryptoDecimals).toFixed(2));
                        });

                });
                console.log("tokenMapping success");
            } catch (error) {
                // console.error('Error, tokenMapping: ', error);
            }
        }

    };


    const approveToken = async () => {
        if (youusd !== 'undefined') {

            setSiteIsLoading(true);

            let amount = String(paymentAmount / cryptoPrice);
            console.log("amount pay token", amount);

            try {

                await youusd.methods.approve(youDapp._address, web3.utils.toWei("9999999999999999999999999", "ether")).send({ from: account }).then(async () => {
                    const netId = await web3.eth.net.getId();
                    const currYouusdAllowance = await youusd.methods.allowance(account, YouWhoDapp.networks[netId].address).call({ from: account });
                    setMyYouusdAllowance(currYouusdAllowance);

                    console.log("approve youusd Success");
                    setSiteIsLoading(false);
                    // window.location.reload();
                });


            } catch (error) {
                console.error('Error, approval: ', error);
                setSiteIsLoading(false);
            }

        }
    }



    const payNow = async () => {

        if (youDapp !== 'undefined') {

            try {
                setSiteIsLoading(true);
                if (crypto === "ETH") {
                    let amount = String(paymentAmount / cryptoPrice);
                    console.log("amount pay eth", amount);
                    await youDapp.methods.makePaymentEth(ethAddress, web3.utils.asciiToHex(bookingId), reviewRating).send({ value: web3.utils.toWei(amount), from: account }).then(async (result) => {
                        await Moralis.Cloud.run("setPaymentAmount", { paymentAmount, bookingPublic: bookingPublic.id, crypto, paymentCrypto: paymentAmount / cryptoPrice, priceAtTime: cryptoPrice });
                        setNewPayment(result);
                        setPaymentSuccess(true);
                        setSiteIsLoading(false);
                        console.log("makePaymentEth success", result);
                    });
                } else {
                    let amount = String(paymentAmount / cryptoPrice);
                    console.log("amount pay token", amount);

                    if (myYouusdAllowance > amount) {

                        await youDapp.methods.makePayment(ethAddress, web3.utils.asciiToHex(bookingId), web3.utils.toWei(amount), web3.utils.asciiToHex(crypto), reviewRating).send({ from: account }).then(async (result) => {
                            await Moralis.Cloud.run("setPaymentAmount", { paymentAmount, bookingPublic: bookingPublic.id, crypto, paymentCrypto: paymentAmount / cryptoPrice, priceAtTime: cryptoPrice });
                            setNewPayment(result);
                            setPaymentSuccess(true);
                            setSiteIsLoading(false);
                            console.log("makePayment TOKEN success")

                        }).catch((error) => {
                            console.error('Error, pay with token: ', error);
                            setSiteIsLoading(false);
                        });


                    } else {
                        try {

                            await youusd.methods.approve(youDapp._address, web3.utils.toWei("9999999999999999999999999", "ether")).send({ from: account }).then(async () => {
                                const netId = await web3.eth.net.getId();
                                const currYouusdAllowance = await youusd.methods.allowance(account, YouWhoDapp.networks[netId].address).call({ from: account });
                                setMyYouusdAllowance(currYouusdAllowance);

                                console.log("approve youusd Success");
                                setSiteIsLoading3(false);
                                // window.location.reload();
                            });


                        } catch (error) {
                            console.error('Error, approval: ', error);
                            setSiteIsLoading(false);
                        }
                    }


                }
            } catch (error) {
                console.error('Error, payment: ', error);
                setSiteIsLoading(false);
            }

        }

    }

    useEffect(() => {
        try {
            getTokenPrice();
        } catch (error) {
            console.error(error);
        }
    }, [crypto])

    useEffect(() => {
        setPaymentAmount(rateAgreed * durationHours)
    }, [rateAgreed, durationHours])


    const options = ["ETH", "YOUUSD"]
    const icon = [<Icon as={FaI.FaEthereum} mb="4px" mr="4px" />, <Icon as={FaI.FaDollarSign} mb="4px" mr="2px" />]

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: "Crypto",
        defaultValue: "ETH",
        onChange: setCrypto,
        value: crypto,
    })

    const group = getRootProps()

    if (bookingStatus === "paid") {
        return (
            <>
                <Flex mb={3} mr={1} color={grayText2} align="center">
                    <Text fontWeight="400" fontSize="3xl" ml={1} style={{ display: "flex", alignItems: "center" }} ><Icon as={RiI.RiHandCoinLine} color="green.300" mr={2} />Pay Now</Text>
                    <Spacer />
                    <IconButton icon={<Io5.IoArrowBack />} size="sm" mr={2} variant="ghost" fontSize="24px" onClick={() => { history.goBack(); }} />
                </Flex>
                <Stack spacing="6" p={2}>
                    <Center>
                        <Text fontSize="xl" color="green.300" fontWeight="300">You have already <b>Paid</b> for this booking.</Text>
                    </Center>
                </Stack>
            </>
        )
    }

    if (bookingStatus === "declined") {
        return (
            <>
                <Flex mb={3} mr={1} color={grayText2} align="center">
                    <Text fontWeight="400" fontSize="3xl" ml={1} style={{ display: "flex", alignItems: "center" }} ><Icon as={RiI.RiHandCoinLine} color="green.300" mr={2} />Pay Now</Text>
                    <Spacer />
                    <IconButton icon={<Io5.IoArrowBack />} size="sm" mr={2} variant="ghost" fontSize="24px" onClick={() => { history.goBack(); }} />
                </Flex>
                <Stack spacing="6" p={2}>
                    <Center>
                        <Text fontSize="xl" color="crimson" fontWeight="300">This booking was <b>Declined</b> by the service provider.</Text>
                    </Center>
                </Stack>
            </>
        )
    }

    return (
        <>
            {siteIsLoading3 ? (
                <YouWhoLoading />
            ) : (
                <>
                    <Flex mb={3} mr={1} color={grayText2} align="center">
                        <Text fontWeight="400" fontSize="3xl" ml={1} style={{ display: "flex", alignItems: "center" }} ><Icon as={RiI.RiHandCoinLine} color="green.300" mr={2} />Pay Now</Text>
                        <Spacer />
                        <IconButton icon={<Io5.IoArrowBack />} size="sm" mr={2} variant="ghost" fontSize="24px" onClick={() => { history.goBack(); }} />
                    </Flex>

                    <Stack spacing="6" p={2}>

                        <Box borderBottom="1px" pb={3} borderColor="gray.10" >
                            <Text fontWeight="300" color={grayText} mb={1}>Amount To Pay in USD</Text>
                            <Center py={2}>
                                <Text color="primary.400" fontSize="30px" fontWeight="300">$<Text as="span" fontSize="40px" fontWeight="600">{Number(paymentAmount).toFixed(2)}</Text></Text>
                            </Center>
                        </Box>

                        <Box pb={0} >
                            <Text fontWeight="300" color={grayText} mb={1}>Hours Spent on Service</Text>
                            <Center py={2}>
                                <InputGroup width="45%">
                                    <NumberInput min={1} variant="flushed" value={durationHours} fontSize="lg" precision={2} isInvalid={durationHours.length > 10 ? true : false}>
                                        <NumberInputField id="hoursInput" pl={7} placeholder="1.0 min." fontSize="lg" onChange={(e) => setDurationHours(e.target.value)} />
                                        <NumberInputStepper >
                                            <NumberIncrementStepper color="gray.500" onClick={() => setDurationHours(String(Number(document.getElementById("hoursInput").value) + .5))} />
                                            <NumberDecrementStepper color="gray.500" onClick={() => setDurationHours(String(Number(document.getElementById("hoursInput").value) - .5))} />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </InputGroup>
                            </Center>
                        </Box>

                        <Box borderBottom="1px" pb={5} borderColor="gray.10"  >
                            <Text fontWeight="300" color={grayText} mb={1}>Agreed Hourly Rate in USD</Text>
                            <Center py={2}>
                                <InputGroup width="45%">
                                    <InputLeftElement pointerEvents="none" children="$" fontSize="sm" />
                                    <NumberInput min={1} variant="flushed" value={rateAgreed} fontSize="lg" precision={2} isInvalid={rateAgreed.length > 10 ? true : false}>
                                        <NumberInputField id="rateAgreed" pl={7} placeholder="1.0 min." fontSize="lg" onChange={(e) => setRateAgreed(e.target.value)} />
                                        <NumberInputStepper >
                                            <NumberIncrementStepper color="gray.500" onClick={() => setRateAgreed(String(Number(document.getElementById("rateAgreed").value) + .5))} />
                                            <NumberDecrementStepper color="gray.500" onClick={() => setRateAgreed(String(Number(document.getElementById("rateAgreed").value) - .5))} />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </InputGroup>
                            </Center>
                        </Box>

                        <Box borderBottom="1px" pb={5} borderColor="gray.10" >
                            <Text fontWeight="300" color={grayText} mb={1}>Choose Cryptocurrency</Text>
                            <Text as="i" fontWeight="300" color={grayText} mb={1} fontSize="sm">Crypto amount will be calculated automatically</Text>
                            <Center pt={5} pb={3}>
                                <Center {...group} >
                                    {options.map((value, i) => {
                                        const radio = getRadioProps({ value })
                                        return (
                                            <RadioCard key={value} {...radio}>
                                                {icon[i]}{value}
                                            </RadioCard>
                                        )
                                    })}
                                </Center>
                            </Center>
                            <Center >
                                <Text>Currently <b>${cryptoPrice}</b> for <b>1 {crypto}</b></Text>
                            </Center>
                        </Box>

                        <Box borderBottom="1px" pb={5} borderColor="gray.10" >
                            <Text fontWeight="300" color={grayText} mb={1}>Give <Text as="span" color="secondary.300" fontWeight="600">{providerName}</Text> a rating</Text>
                            <Center pt={3} pb={4}>
                                <ReactStars {...ratingStars} />
                            </Center>
                            <Text><Text as="span" color="secondary.300" fontWeight="600">{providerName}</Text> will not see your rating until after they have given you a rating.</Text>
                            <Text>You will be able to provide a more in-depth review after making payment.</Text>
                        </Box>

                        <Box pb={4}>
                            <Text fontWeight="300" color={grayText} mb={1}>Provider Address</Text>
                            <Text>{ethAddress}</Text>
                        </Box>

                        <PayNow siteIsLoading={siteIsLoading} paymentSuccess={paymentSuccess} grayText={grayText} history={history} bookingId={bookingId} payNow={payNow} booking={booking} bookingPublic={bookingPublic} newPayment={newPayment} provider={provider} bookingStatus={bookingStatus} ethAddress={ethAddress} providerName={providerName} myYouusdAllowance={myYouusdAllowance} paymentAmount={paymentAmount} cryptoPrice={cryptoPrice} crypto={crypto} account={account} approveToken={approveToken} />
                    </Stack>
                </>
            )}
        </>
    )
}


function PayNow({ siteIsLoading, paymentSuccess, grayText, history, bookingId, payNow, booking, bookingPublic, newPayment, provider, bookingStatus, ethAddress, providerName, myYouusdAllowance, paymentAmount, cryptoPrice, crypto, account, approveToken }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode } = useColorMode();
    const [confirmBooking, setConfirmBooking] = useState(false);


    return (
        <>
            <Button minWidth="50%" color="secondary.500" bg="secondary.100" _hover={{ bg: "secondary.200" }} _focus={{ bg: "secondary.100" }} _active={{ bg: "secondary.100" }} borderRadius="md" onClick={onOpen} isDisabled={false} size="lg" ><Icon as={HiI.HiOutlineBadgeCheck} mr={2} fontSize="24px" />Pay Now</Button>

            <Modal isOpen={isOpen} size="lg" onClose={paymentSuccess ? () => { onClose(); history.push(`/activity/you/booked/${bookingId}`); window.location.reload(); } : () => { onClose(); }} >
                <ModalOverlay />
                <ModalContent minHeight="200px" borderRadius="xl" mx={3} mt="10%" bg={colorMode === "light" ? "white" : "gray.900"} overflow="hidden">
                    {paymentSuccess ? (
                        <>
                            <ModalHeader py={6} px={["4", "6", "", ""]} fontWeight="400" style={{ display: "flex", alignItems: "center" }}><Icon as={HiI.HiOutlineBadgeCheck} color="secondary.300" mr={1} h="24px" w="24px" />Payment Success!</ModalHeader>
                            <ModalCloseButton m={3} onClick={() => { onClose(); history.push(`/activity/you/booked/${bookingId}`); window.location.reload(); }} />
                            <ModalBody px={["4", "6", "", ""]} id="categoryButtons">
                                <Text>Click <Text as="span" color="primary.400" fontWeight="600">OK</Text> to go back to your booking overview.</Text>
                            </ModalBody>
                            <ModalFooter pb={6} px={6}>
                                <Button colorScheme="primary" onClick={() => { onClose(); history.push(`/activity/you/booked/${bookingId}`); window.location.reload(); }}>OK</Button>
                            </ModalFooter>
                        </>
                    ) : ((myYouusdAllowance > (paymentAmount / cryptoPrice) || crypto === "ETH") ?
                        <>
                            <ModalHeader px={["4", "6", "", ""]} pt={6} pb={4} fontWeight="400" bg="gray.10"><Icon as={RiI.RiHandCoinLine} color="secondary.300" mb="5px" mr={2} h="24px" w="24px" />Confirm Payment Details</ModalHeader>
                            <ModalCloseButton m={3} onClick={() => { onClose(); }} />
                            <ModalBody px={["4", "6", "", ""]} pt={4}>
                                {siteIsLoading ?
                                    <YouWhoLoading />
                                    :
                                    <Stack spacing="3">

                                        <Box pb={5} borderBottomWidth="1px" borderColor="gray.10">
                                            <Text fontWeight="500" color={grayText}>Pay From</Text>
                                            <Flex pt="2">
                                                <Box w="100%">
                                                    <Text >{account}</Text>
                                                </Box>
                                            </Flex>
                                        </Box>

                                        <Box pb={5} borderBottomWidth="1px" borderColor="gray.10">
                                            <Text fontWeight="500" color={grayText}>Pay To</Text>
                                            <Flex pt="2">
                                                <Box w="100%">
                                                    <Text >{ethAddress}</Text>
                                                </Box>
                                            </Flex>
                                        </Box>

                                        <Box pb={5} borderBottomWidth="1px" borderColor="gray.10">
                                            <Text fontWeight="500" color={grayText}>Amount USD</Text>
                                            <Flex pt="2">
                                                <Box w="100%">
                                                    <Text >{Number(paymentAmount).toFixed(2)}</Text>
                                                </Box>
                                            </Flex>
                                        </Box>

                                        <Box pb={5} borderBottomWidth="1px" borderColor="gray.10">
                                            <Text fontWeight="500" color={grayText}>Amount {crypto}</Text>
                                            <Flex pt="2">
                                                <Box w="100%">
                                                    <Text >{paymentAmount / cryptoPrice}</Text>
                                                </Box>
                                            </Flex>
                                        </Box>

                                        <Box pb={3}>
                                            <Text fontWeight="500" color={grayText}>Approximate YOU Token rewards received</Text>
                                            <Flex pt="2">
                                                <Box w="100%">
                                                    <Text ><b>{paymentAmount / 10} YOU</b></Text>
                                                </Box>
                                            </Flex>
                                        </Box>

                                    </Stack>

                                }

                            </ModalBody>
                            <ModalFooter pb={6} px={6} bg="gray.10" >
                                <Stack spacing="3">
                                    <Text>Press Confirm below, to send payment to <Text as="span" color="secondary.300" fontWeight="600">{providerName}</Text>.</Text>
                                    <Text as="i" color={grayText} fontSize="sm">Note that it may take up to a few minutes for your transaction to be processed depending on how congested the Ethereum network is, please be patient, you payment will be processed in time.</Text>
                                    {!confirmBooking ?
                                        <>
                                            <Button colorScheme="primary" onClick={() => setConfirmBooking(true)} mr={2} isLoading={siteIsLoading}><Icon as={Io5.IoRocketOutline} mr={1} h="20px" w="20px" /> Confirm?</Button>
                                            <Flex>
                                                <Spacer />
                                                <Button w="40%" onClick={() => { onClose(); }} isLoading={siteIsLoading}>Cancel<Icon as={FcI.FcCancel} height="22px" width="22px" ml={2} /></Button>
                                            </Flex>
                                        </>
                                        :
                                        <>
                                            <Button colorScheme="green" onClick={payNow} mr={2} isLoading={siteIsLoading}><Icon as={Io5.IoRocketOutline} mr={1} h="20px" w="20px" /> Yes I Confirm Payment!</Button>
                                            <Flex>
                                                <Spacer />
                                                <Button w="40%" onClick={() => setConfirmBooking(false)} isLoading={siteIsLoading}  >Cancel<Icon as={FcI.FcCancel} height="22px" width="22px" ml={2} /></Button>
                                            </Flex>
                                        </>
                                    }
                                </Stack>
                            </ModalFooter>
                        </>
                        :
                        <>
                            <ModalHeader px={["4", "6", "", ""]} pt={6} pb={4} fontWeight="400" bg="gray.10"><Icon as={HiI.HiOutlineBadgeCheck} color="secondary.300" mb="5px" mr={2} h="24px" w="24px" />Approve Token Allowance</ModalHeader>
                            <ModalCloseButton m={3} onClick={() => { onClose(); }} />
                            <ModalBody px={["4", "6", "", ""]} pt={4}>
                                {siteIsLoading ?
                                    <YouWhoLoading />
                                    :
                                    <Stack spacing="3">

                                        <Box pb={3} >
                                            <Flex pt="2">
                                                <Box w="100%">
                                                    <Text color={grayText} >As this is your first time paying with <Text as="span" color="primary.500" fontWeight="600">YOUUSD</Text> at <Text as="span" color="secondary.300" fontWeight="600">youwho.io</Text>, you must first allow <Text as="span" color="secondary.300" fontWeight="600">youwho.io</Text> to make payments using your <Text as="span" color="primary.500" fontWeight="600">YOUUSD</Text> tokens. Please click on the <Text as="span" color="primary.500" fontWeight="600">Approve</Text> button below.</Text>
                                                </Box>
                                            </Flex>
                                        </Box>

                                    </Stack>
                                }
                            </ModalBody>
                            <ModalFooter pb={6} px={6} >
                                <Stack spacing="3" w="100%">
                                    <Button color="secondary.500" bg="secondary.100" _hover={{ bg: "secondary.200" }} _focus={{ bg: "secondary.100" }} _active={{ bg: "secondary.100" }} onClick={approveToken} isLoading={siteIsLoading}><Icon as={HiI.HiOutlineBadgeCheck} mr={1} h="20px" w="20px" />Approve</Button>
                                    <Flex>
                                        <Spacer />
                                        <Button w="40%" isLoading={siteIsLoading} onClick={onClose} ><Icon as={FcI.FcCancel} height="22px" width="22px" mr={2} />Cancel</Button>
                                    </Flex>
                                </Stack>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

function RadioCard(props) {
    const { getInputProps, getCheckboxProps } = useRadio(props)

    const input = getInputProps()
    const checkbox = getCheckboxProps()

    return (
        <Box as="label">
            <input {...input} />
            <Box
                {...checkbox}
                cursor="pointer"
                bg="gray.10"
                borderRadius="md"
                _checked={{
                    bg: "primary.400",
                    color: "white",
                }}
                px={5}
                py={3}
                mx={2}
            >
                {props.children}
            </Box>
        </Box>
    )
}
