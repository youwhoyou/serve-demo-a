import React, { useContext, useEffect, useState } from 'react';
import { Text, Center, Stack, Icon, useColorMode } from "@chakra-ui/react";
import { useHistory, useParams, Switch, Route } from 'react-router-dom';
import { SiteStateContext } from "../context/SiteStateContext";
import { useMoralis } from "react-moralis";
import Web3 from 'web3';
import YouWhoDapp from '../../abis/YouWhoDapp.json';
import YouWho from '../../abis/YouWho.json';
import ErrorDialog from '../error/ErrorDialog';
import YouWhoLoading from '../misc/YouWhoLoading';
import ViewBookedService from "./ViewBookedService";
import ReviewUser from "./ReviewUser";
import ApproveBooking from "./ApproveBooking";
import * as BsI from "react-icons/bs";
import * as Io5 from "react-icons/io5";
// import * as FaI from "react-icons/fa";
// import * as HiI from "react-icons/hi";
// import * as TiI from "react-icons/ti";
// import * as RiI from "react-icons/ri";
// import * as MdI from "react-icons/md";


export default function Bookings({ grayText2, setReloadPage }) {

    const { user, Moralis, isAuthenticated, authenticate } = useMoralis();
    const { siteIsLoading, setSiteIsLoading, siteIsLoading2, setSiteIsLoading2, siteIsLoading3, setSiteIsLoading3 } = useContext(SiteStateContext);
    const { colorMode } = useColorMode();
    const { id: bookedId } = useParams();
    const [ethAddress, setEthAddress] = useState("");
    const [ethAddresses, setEthAddresses] = useState([]);
    const [dayTime, setDayTime] = useState([{ day: "", from: "", adjFrom: 0, to: "", adjTo: 0 }]);
    const [bookingStatus, setBookingStatus] = useState("pending");
    const [booking, setBooking] = useState("");
    const [bookingUser, setBookingUser] = useState("");
    const [bookingUsername, setBookingUsername] = useState("");
    const [bookingPublic, setBookingPublic] = useState("");
    const [bookingApproval, setBookingApproval] = useState("");
    const [description, setDescription] = useState("");
    const [durationHours, setDurationHours] = useState(1);
    const [serviceLocation, setServiceLocation] = useState("users");
    const [rate, setRate] = useState(1);
    const [reviewSuccess, setReviewSuccess] = useState(false);
    const [review, setReview] = useState("");
    const [reviewRating, setReviewRating] = useState(35);
    const [reviewDescription, setReviewDescription] = useState("");
    const [web3, setWeb3] = useState("");
    const [netId, setNetId] = useState("");
    const [account, setAccount] = useState("");
    const [youDapp, setYouDapp] = useState("");
    const [claimableAmount, setClaimableAmount] = useState("");
    const [newServiceError, setNewServiceError] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [bookSuccess, setBookSuccess] = useState(false);
    const history = useHistory();


    useEffect(() => {
        if (!user) {
            history.push("/activity/you/viewed");
        }
        // eslint-disable-next-line
    }, [])


    useEffect(() => {
        (async () => {

            setSiteIsLoading2(true);

            try {

                setEthAddresses(user.attributes.accounts);
                setEthAddress(user.attributes.accounts[0]);

                let Bookings = Moralis.Object.extend("Bookings");
                const queryBookings = new Moralis.Query(Bookings);
                queryBookings.equalTo("objectId", bookedId);
                queryBookings.include("userPublic");

                let bookingResult = await queryBookings.first();
                if (bookingResult) {
                    console.log("booking", bookingResult);
                    setBooking(bookingResult);
                    setDescription(bookingResult.attributes.bookingDescription !== "" ? bookingResult.attributes.bookingDescription : "No requirements provided.");
                    setRate(bookingResult.attributes.service.attributes.rate);
                    setDayTime(bookingResult.attributes.bookingDayTime);
                    setBookingUser(bookingResult.attributes.userPublic);
                    setBookingUsername(bookingResult.attributes.userPublic.attributes.username)
                }


                let BookingsApproval = Moralis.Object.extend("BookingsApproval");
                const queryBookingsApproval = new Moralis.Query(BookingsApproval);
                queryBookingsApproval.equalTo("bookings", bookingResult);

                let bookingApprovalResult = await queryBookingsApproval.first();

                if (bookingApprovalResult) {
                    setBookingStatus(bookingApprovalResult.attributes.approval);
                    setBookingApproval(bookingApprovalResult);
                    setRate(bookingApprovalResult.attributes.agreedRate);
                    setDayTime(bookingApprovalResult.attributes.agreedDayTime);
                    setDurationHours(bookingApprovalResult.attributes.agreedHours);
                    setServiceLocation(bookingApprovalResult.attributes.agreedLocation);
                    setEthAddress(bookingApprovalResult.attributes.providerEthAddress);

                    if (bookingApprovalResult.attributes.approval === "paid") {
                        await loadBlockchainData();
                    }
                }


                let BookingsPublic = Moralis.Object.extend("BookingsPublic");
                const queryBookingsPublic = new Moralis.Query(BookingsPublic);
                queryBookingsPublic.equalTo("booking", bookingResult);
                queryBookingsPublic.include("bookingPayment");

                let bookingPublicResult = await queryBookingsPublic.first();

                if (bookingPublicResult) {
                    setBookingPublic(bookingPublicResult);
                    console.log("bookingPublic", bookingPublicResult);
                }


                const ReviewedUser = Moralis.Object.extend("ReviewedUser");
                let queryReviewedUser = new Moralis.Query(ReviewedUser);
                queryReviewedUser.equalTo("booking", padRight(Web3.utils.asciiToHex(bookedId)));

                let reviewedUser = await queryReviewedUser.first();

                if (reviewedUser) {
                    console.log("reviewedUser", reviewedUser)
                    setReview(reviewedUser);
                    setReviewSuccess(true);
                }

                setSiteIsLoading2(false);




            } catch (error) {
                console.error(error);
                setSiteIsLoading2(false);

            }


        })();
    }, [reviewSuccess]);

    console.log(reviewSuccess ? true : false)

    let padRight = (str) => {

        let newStr = str;

        while (newStr.length < 66) {
            newStr += "0"
        }

        return newStr
    }



    let loadBlockchainData = async () => {

        if (typeof window.ethereum !== 'undefined') {

            setSiteIsLoading3(true);

            const web3 = new Web3(window.ethereum);
            const netId = await web3.eth.net.getId();
            const accounts = await web3.eth.getAccounts();

            setWeb3(web3);
            setNetId(netId)
            setAccount(accounts[0]);

            try {
                const youDappC = new web3.eth.Contract(YouWhoDapp.abi, YouWhoDapp.networks[netId].address);
                setYouDapp(youDappC);
                // console.log('youDapp contract: ', youDappC);

                const currClaimableAmount = await youDappC.methods.claimableAmount(web3.utils.asciiToHex(bookedId)).call({ from: accounts[0] });
                setClaimableAmount(currClaimableAmount);

                console.log("claimable success")

                setSiteIsLoading3(false);

            } catch (e) {
                console.log('Error', e);
                window.alert('Contract not deployed to the current network');
                setSiteIsLoading3(false);
            }

        } else {
            setEthAddress(user.attributes.ethAddress);
            // window.alert('Please install MetaMask');
        }

    }

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

    const grayText = colorMode === "light" ? "gray.500" : "gray.400";
    // const grayText2 = colorMode === "light" ? "gray.600" : "gray.100";

    if (booking) {
        return (
            <>
                {showAlert && (<ErrorDialog title={newServiceError[0]} message={newServiceError[1]} showAlert={showAlert} setShowAlert={setShowAlert} />)}
                {siteIsLoading2 ? (
                    <YouWhoLoading />
                ) : (
                    <>
                        <Switch>
                            <Route exact path="/activity/who/bookings/:id/review">
                                <ReviewUser
                                    Moralis={Moralis}
                                    grayText2={grayText2}
                                    grayText={grayText}
                                    history={history}
                                    bookedId={bookedId}
                                    booking={booking}
                                    netId={netId}
                                    web3={web3}
                                    user={user}
                                    account={account}
                                    youDapp={youDapp}
                                    siteIsLoading={siteIsLoading}
                                    setSiteIsLoading={setSiteIsLoading}
                                    siteIsLoading3={siteIsLoading3}
                                    setSiteIsLoading3={setSiteIsLoading3}
                                    reviewSuccess={reviewSuccess}
                                    setReviewSuccess={setReviewSuccess}
                                    reviewRating={reviewRating}
                                    setReviewRating={setReviewRating}
                                    ratingStart={ratingStars}
                                    reviewDescription={reviewDescription}
                                    setReviewDescription={setReviewDescription}
                                    bookingUser={bookingUser}
                                    claimableAmount={claimableAmount}
                                    ethAddress={ethAddress}

                                />
                            </Route>
                            <Route exact path="/activity/who/bookings/:id">
                                <ViewBookedService
                                    grayText={grayText}
                                    grayText2={grayText2}
                                    history={history}
                                    bookedId={bookedId}
                                    booking={booking}
                                    user={user}
                                    siteIsLoading={siteIsLoading}
                                    setSiteIsLoading={setSiteIsLoading}
                                    bookingApproval={bookingApproval}
                                    bookingPublic={bookingPublic}
                                    description={description}
                                    rate={rate}
                                    setRate={setRate}
                                    durationHours={durationHours}
                                    setDurationHours={setDurationHours}
                                    dayTime={dayTime}
                                    setDayTime={setDayTime}
                                    serviceLocation={serviceLocation}
                                    setServiceLocation={setServiceLocation}
                                    ethAddress={ethAddress}
                                    setEthAddress={setEthAddress}
                                    ethAddresses={ethAddresses}
                                    bookingStatus={bookingStatus}
                                    bookingUser={bookingUser}
                                    bookingUsername={bookingUsername}
                                    setBookingStatus={setBookingStatus}
                                    claimableAmount={claimableAmount}
                                    setReloadPage={setReloadPage}
                                />
                            </Route>
                        </Switch>
                    </>
                )}
            </>
        )
    }

    return (
        <>
            {siteIsLoading2 ? (
                <YouWhoLoading />
            ) : (
                <Center minHeight="200px" >
                    <Stack role="button" onClick={() => history.push("/activity/who/bookings")}>
                        <Center mb={2}><Icon as={Io5.IoWarningOutline} fontSize="30px" color="secondary.300" /></Center>
                        <Text align="center">The service you are looking for does not exist.</Text>
                        <Text align="center">Please click here to <Text as="span" color="primary.500" fontWeight="600">go back</Text>.</Text>
                    </Stack>
                </Center>
            )}
        </>
    )
}



