import React, { useContext, useEffect, useState } from 'react';
import { Text, Center, Stack, Icon, useToast, useColorMode } from "@chakra-ui/react";
import { useHistory, useParams, Switch, Route } from 'react-router-dom';
import { SiteStateContext } from "../context/SiteStateContext";
import { useMoralis } from "react-moralis";

import ErrorDialog from '../error/ErrorDialog';
import YouWhoLoading from '../misc/YouWhoLoading';
import Payment from './Payment';
import ViewBooking from "./ViewBooking";
import * as Io5 from "react-icons/io5";



export default function BookedService({ bookedService, setBookedService, grayText2, setReloadPage }) {

    useEffect(() => {
        if (!user) {
            history.push("/activity/you/viewed");
        }
        // eslint-disable-next-line
    }, [])

    const { user, Moralis, setUserData } = useMoralis();
    const { siteIsLoading, setSiteIsLoading, siteIsLoading2, setSiteIsLoading2, selectedTimezone } = useContext(SiteStateContext);
    const { colorMode } = useColorMode();
    const { id: bookedId } = useParams();
    const [bookingId, setBookingId] = useState("");
    const [provider, setProvider] = useState("");
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [rate, setRate] = useState("");
    const [rating, setRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [serviceLocationChoice, setServiceLocationChoice] = useState("mine");
    const [myLat, setMyLat] = useState("");
    const [myLong, setMyLong] = useState("");
    const [dayTime, setDayTime] = useState([{ day: "", from: "", adjFrom: 0, to: "", adjTo: 0 }]);
    const [imagesArray, setImagesArray] = useState([]);
    const [lightboxArray, setLightboxArray] = useState([]);
    const [showLightbox, setShowLightbox] = useState(false);
    const [newServiceError, setNewServiceError] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [bookSuccess, setBookSuccess] = useState(false);
    const [newBooking, setNewBooking] = useState("");
    const [amountYou, setAmountYou] = useState("");
    const [ethAddress, setEthAddress] = useState("");
    const [bookingUser, setBookingUser] = useState("");
    const [booking, setBooking] = useState("");
    const [bookingPublic, setBookingPublic] = useState("");
    const [bookingApproval, setBookingApproval] = useState("");
    const [ethAddresses, setEthAddresses] = useState([]);
    const [bookingStatus, setBookingStatus] = useState("pending");
    const [rateAgreed, setRateAgreed] = useState("");
    const [durationHours, setDurationHours] = useState(1);
    const [serviceLocation, setServiceLocation] = useState("users");
    const [paidAmountUsd, setPaidAmountUsd] = useState("");



    const toast = useToast();
    const history = useHistory();



    // useEffect(() => {

    //     setSiteIsLoading2(true);

    //     if (!bookedService) {

    //         (async () => {
    //             let Bookings = Moralis.Object.extend("Bookings");
    //             const queryBookings = new Moralis.Query(Bookings);
    //             queryBookings.equalTo("objectId", bookedId);

    //             await queryBookings.first()
    //                 .then((result) => {
    //                     // console.log("RESULTSLS", result)
    //                     if (result) {

    //                         setBookingId(result.id);
    //                         setProvider(result.attributes.service.attributes.providerPublic);
    //                         setCategory(result.attributes.service.attributes.category);
    //                         setSubCategory(result.attributes.service.attributes.subCategory);
    //                         setTitle(result.attributes.service.attributes.title);
    //                         setRating(result.attributes.service.attributes.rating);
    //                         setReviewCount(result.attributes.service.attributes.reviewCount);
    //                         setRate(result.attributes.service.attributes.rate);
    //                         setDescription(result.attributes.service.attributes.description);
    //                         setServiceLocationChoice(result.attributes.service.attributes.serviceLocationChoice);
    //                         setMyLat(result.attributes.service.attributes.myLat);
    //                         setMyLong(result.attributes.service.attributes.myLong);
    //                         setDayTime(result.attributes.service.attributes.dayTime);
    //                         setImagesArray([result.attributes.service.attributes.service_img1, result.attributes.service.attributes.service_img2, result.attributes.service.attributes.service_img3, result.attributes.service.attributes.service_img4, result.attributes.service.attributes.service_img5, result.attributes.service.attributes.service_img6]);

    //                         let imgArr = [result.attributes.service.attributes.service_img1, result.attributes.service.attributes.service_img2, result.attributes.service.attributes.service_img3, result.attributes.service.attributes.service_img4, result.attributes.service.attributes.service_img5, result.attributes.service.attributes.service_img6];
    //                         let lbArr = [];
    //                         for (let i = 0; i < imgArr.length; i++) {
    //                             if (imgArr[i]) {
    //                                 lbArr.push({ url: imgArr[i]._url, title: i < 3 ? `Service Image ${i + 1}` : `Service Certificate ${i - 2}` });
    //                             }
    //                         }

    //                         setLightboxArray(lbArr);
    //                         setReloadPage(true);
    //                         setBookedService(result.attributes.service);
    //                         setSiteIsLoading2(false);
    //                     }
    //                 })
    //                 .catch((error) => {
    //                     setNewServiceError(["Service Not Found", error.message]);
    //                     setShowAlert(true);
    //                     setSiteIsLoading2(false);
    //                 });
    //         })();

    //     } else {

    //         try {

    //             setBookingId(bookedId);
    //             setProvider(bookedService.attributes.providerPublic);
    //             setCategory(bookedService.attributes.category);
    //             setSubCategory(bookedService.attributes.subCategory);
    //             setTitle(bookedService.attributes.title);
    //             setRate(bookedService.attributes.rate);
    //             setRating(bookedService.attributes.rating);
    //             setReviewCount(bookedService.attributes.reviewCount);
    //             setDescription(bookedService.attributes.description);
    //             setServiceLocationChoice(bookedService.attributes.serviceLocationChoice);
    //             setMyLat(bookedService.attributes.myLat);
    //             setMyLong(bookedService.attributes.myLong);
    //             setDayTime(bookedService.attributes.dayTime);
    //             setImagesArray([bookedService.attributes.service_img1, bookedService.attributes.service_img2, bookedService.attributes.service_img3, bookedService.attributes.service_img4, bookedService.attributes.service_img5, bookedService.attributes.service_img6]);

    //             let imgArr = [bookedService.attributes.service_img1, bookedService.attributes.service_img2, bookedService.attributes.service_img3, bookedService.attributes.service_img4, bookedService.attributes.service_img5, bookedService.attributes.service_img6];
    //             let lbArr = [];
    //             for (let i = 0; i < imgArr.length; i++) {
    //                 if (imgArr[i]) {
    //                     lbArr.push({ url: imgArr[i]._url, title: i < 3 ? `Service Image ${i + 1}` : `Service Certificate ${i - 2}` });
    //                 }
    //             }
    //             setLightboxArray(lbArr);
    //             setSiteIsLoading2(false);
    //         } catch (error) {
    //             setNewServiceError(["Service Not Found", error.message]);
    //             setShowAlert(true);
    //             setSiteIsLoading2(false);
    //         }

    //     }
    //     // eslint-disable-next-line
    // }, [siteIsLoading2]);


    useEffect(() => {
        (async () => {

            setSiteIsLoading(true);

            try {

                setEthAddresses(user.attributes.accounts);

                let Bookings = Moralis.Object.extend("Bookings");
                const queryBookings = new Moralis.Query(Bookings);
                queryBookings.equalTo("objectId", bookedId);
                queryBookings.include("service");

                let bookingResult = await queryBookings.first();
                if (bookingResult) {
                    // console.log("booking", bookingResult);



                    setBookingId(bookingResult.id);
                    setProvider(bookingResult.attributes.service.attributes.providerPublic);
                    setCategory(bookingResult.attributes.service.attributes.category);
                    setSubCategory(bookingResult.attributes.service.attributes.subCategory);
                    setTitle(bookingResult.attributes.service.attributes.title);
                    setRating(bookingResult.attributes.service.attributes.rating);
                    setReviewCount(bookingResult.attributes.service.attributes.reviewCount);
                    setServiceLocationChoice(bookingResult.attributes.service.attributes.serviceLocationChoice);
                    setMyLat(bookingResult.attributes.service.attributes.myLat);
                    setMyLong(bookingResult.attributes.service.attributes.myLong);
                    // setDayTime(bookingResult.attributes.service.attributes.dayTime);
                    setImagesArray([bookingResult.attributes.service.attributes.service_img1, bookingResult.attributes.service.attributes.service_img2, bookingResult.attributes.service.attributes.service_img3, bookingResult.attributes.service.attributes.service_img4, bookingResult.attributes.service.attributes.service_img5, bookingResult.attributes.service.attributes.service_img6]);

                    let imgArr = [bookingResult.attributes.service.attributes.service_img1, bookingResult.attributes.service.attributes.service_img2, bookingResult.attributes.service.attributes.service_img3, bookingResult.attributes.service.attributes.service_img4, bookingResult.attributes.service.attributes.service_img5, bookingResult.attributes.service.attributes.service_img6];
                    let lbArr = [];
                    for (let i = 0; i < imgArr.length; i++) {
                        if (imgArr[i]) {
                            lbArr.push({ url: imgArr[i]._url, title: i < 3 ? `Service Image ${i + 1}` : `Service Certificate ${i - 2}` });
                        }
                    }

                    setLightboxArray(lbArr);
                    setBookedService(bookingResult.attributes.service);




                    setBooking(bookingResult);
                    setDescription(bookingResult.attributes.bookingDescription !== "" ? bookingResult.attributes.bookingDescription : "No requirements provided.");
                    setRate(bookingResult.attributes.service.attributes.rate);
                    setDayTime(bookingResult.attributes.bookingDayTime);
                    setBookingUser(bookingResult.attributes.userPublic);
                }


                let BookingsApproval = Moralis.Object.extend("BookingsApproval");
                const queryBookingsApproval = new Moralis.Query(BookingsApproval);
                queryBookingsApproval.equalTo("bookings", bookingResult);

                let bookingApprovalResult = await queryBookingsApproval.first();

                if (bookingApprovalResult) {
                    setBookingStatus(bookingApprovalResult.attributes.approval);
                    setBookingApproval(bookingApprovalResult);
                    setRateAgreed(bookingApprovalResult.attributes.agreedRate);
                    setDayTime(bookingApprovalResult.attributes.agreedDayTime);
                    setDurationHours(bookingApprovalResult.attributes.agreedHours);
                    setServiceLocation(bookingApprovalResult.attributes.agreedLocation);
                    setEthAddress(bookingApprovalResult.attributes.providerEthAddress);


                }


                let BookingsPublic = Moralis.Object.extend("BookingsPublic");
                const queryBookingsPublic = new Moralis.Query(BookingsPublic);
                queryBookingsPublic.equalTo("booking", bookingResult);
                queryBookingsPublic.include("bookingPayment");

                let bookingPublicResult = await queryBookingsPublic.first();

                if (bookingPublicResult) {
                    setBookingPublic(bookingPublicResult);
                    setPaidAmountUsd(Number(bookingPublicResult.attributes.paidAmountUsd).toFixed(2));
                    setAmountYou(bookingPublicResult.attributes.userUhu);
                    // console.log("bookingPublic", bookingPublicResult);
                    if (!bookingApprovalResult) setBookingStatus(bookingPublicResult.attributes.approval);

                }

                setSiteIsLoading(false);




            } catch (error) {
                console.error(error);
                setSiteIsLoading(false);

            }


        })();
    }, []);


    const grayText = colorMode === "light" ? "gray.500" : "gray.400";
    // const grayText2 = colorMode === "light" ? "gray.600" : "gray.100";

    if (title !== "" && rate !== "" && bookedService) {
        return (
            <>
                {showAlert && (<ErrorDialog title={newServiceError[0]} message={newServiceError[1]} showAlert={showAlert} setShowAlert={setShowAlert} />)}
                <Switch>
                    <Route exact path="/activity/you/booked/:id/payment">
                        <Payment
                            grayText2={grayText2}
                            siteIsLoading={siteIsLoading}
                            bookSuccess={bookSuccess}
                            history={history}
                            bookingId={bookedId}
                            provider={provider}

                            ethAddress={ethAddress}
                            setEthAddress={setEthAddress}
                            bookingUser={bookingUser}
                            setBookingUser={setBookingUser}
                            booking={booking}
                            setBooking={setBooking}
                            bookingPublic={bookingPublic}
                            setBookingPublic={setBookingPublic}
                            bookingApproval={bookingApproval}
                            setBookingApproval={setBookingApproval}
                            ethAddresses={ethAddresses}
                            setEthAddresses={setEthAddresses}
                            bookingStatus={bookingStatus}
                            setBookingStatus={setBookingStatus}
                            rateAgreed={rateAgreed}
                            setRateAgreed={setRateAgreed}
                            durationHours={durationHours}
                            setDurationHours={setDurationHours}
                            serviceLocation={serviceLocation}
                            setServiceLocation={setServiceLocation}
                            paidAmountUsd={paidAmountUsd}
                            setPaidAmountUsd={setPaidAmountUsd}
                            dayTime={dayTime}
                            setDayTime={setDayTime}

                        />
                    </Route>
                    <Route exact path="/activity/you/booked/:id">
                        <ViewBooking
                            grayText={grayText}
                            grayText2={grayText2}
                            history={history}
                            bookedService={bookedService}
                            bookingId={bookedId}
                            provider={provider}
                            rate={rate}
                            setRate={setRate}
                            description={description}
                            setDescription={setDescription}
                            selectedTimezone={selectedTimezone}
                            user={user}
                            lightboxArray={lightboxArray}
                            showLightbox={showLightbox}
                            setShowLightbox={setShowLightbox}

                            ethAddress={ethAddress}
                            setEthAddress={setEthAddress}
                            bookingUser={bookingUser}
                            setBookingUser={setBookingUser}
                            booking={booking}
                            setBooking={setBooking}
                            bookingPublic={bookingPublic}
                            setBookingPublic={setBookingPublic}
                            bookingApproval={bookingApproval}
                            setBookingApproval={setBookingApproval}
                            ethAddresses={ethAddresses}
                            setEthAddresses={setEthAddresses}
                            bookingStatus={bookingStatus}
                            setBookingStatus={setBookingStatus}
                            rateAgreed={rateAgreed}
                            setRateAgreed={setRateAgreed}
                            durationHours={durationHours}
                            setDurationHours={setDurationHours}
                            serviceLocation={serviceLocation}
                            setServiceLocation={setServiceLocation}
                            paidAmountUsd={paidAmountUsd}
                            setPaidAmountUsd={setPaidAmountUsd}
                            dayTime={dayTime}
                            setDayTime={setDayTime}
                            amountYou={amountYou}

                        />
                    </Route>
                </Switch>
            </>
        )
    }

    return (
        <>
            {siteIsLoading ? (
                <YouWhoLoading />
            ) : (
                <Center minHeight="200px" >
                    <Stack role="button" onClick={() => history.goBack()}>
                        <Center mb={2}><Icon as={Io5.IoWarningOutline} fontSize="30px" color="secondary.300" /></Center>
                        <Text align="center">The service you are looking for does not exist.</Text>
                        <Text align="center">Please click here to <Text as="span" color="primary.500" fontWeight="600">go back</Text>.</Text>
                    </Stack>
                </Center>
            )}
        </>
    )
}




