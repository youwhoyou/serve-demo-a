import React, { useContext, useEffect, useState, useRef } from 'react';
import { useMoralis } from "react-moralis";
import Moralis from 'moralis';
import { Box, Container, useColorModeValue, useColorMode } from "@chakra-ui/react";
import Header from '../header/Header';
import FootNav from '../footnav/FootNav';
import ActivityTabs from '../services/ActivityTabs';
import EditService from '../services/EditService';
import ViewService from '../search/ViewService';
import BookedService from '../services/BookedService';
import Bookings from '../services/Bookings';
import { useHistory, Switch, Route, useParams, Redirect } from 'react-router-dom';
import { SiteStateContext } from '../context/SiteStateContext';

export default function Activity() {

    const { user, isAuthenticated, web3 } = useMoralis();
    const { userHistory, siteIsLoading2, setSiteIsLoading2, youWhoSwitch, setYouWhoSwitch } = useContext(SiteStateContext);
    const { colorMode } = useColorMode();
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [rate, setRate] = useState("");
    const [serviceLocationChoice, setServiceLocationChoice] = useState("mine");
    const [myLat, setMyLat] = useState("");
    const [myLong, setMyLong] = useState("");
    const [dayTime, setDayTime] = useState([{ day: "", from: "", adjFrom: 0, to: "", adjTo: 0 }]);
    const [myServices, setMyServices] = useState([]);
    const [servicesCounter, setServicesCounter] = useState("");
    const [objectDeleted, setObjectDeleted] = useState(false);
    const [selectedService, setSelectedService] = useState("");
    const [viewedServices, setViewedServices] = useState([]);
    const [bookedServices, setBookedServices] = useState([]);
    const [bookedServices2, setBookedServices2] = useState("");
    const [bookedService2, setBookedService2] = useState("");
    const [bookings, setBookings] = useState("");
    const [bookings2, setBookings2] = useState("");
    const [reloadPage, setReloadPage] = useState(false);
    const [deleted, setDeleted] = useState([]);
    const [myFavServices, setMyFavServices] = useState([]);
    const [myFavourites, setMyFavourites] = useState(user && user.attributes.myFavourites ? user.attributes.myFavourites : []);
    const { id: serviceId, side } = useParams();
    const history = useHistory();
    // const prevBookings = useRef(bookings);
    // const prevBookedServices = useRef(bookedServices);

    const checkMyServicesCount = async () => {
        await Moralis.Cloud.run("getMyServicesCount")
            .then((results) => {
                setServicesCounter(results);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {

        (async () => {
            setSiteIsLoading2(true);
            // console.log("THIS RANNNN")
            checkMyServicesCount();
            const query = new Moralis.Query('Services');
            query.equalTo("provider", user);
            query.descending("updatedAt");
            await query.find().then((results) => {
                if (results.length > 0) {
                    setMyServices(results);
                }
                setSiteIsLoading2(false);
            }).catch((error) => {
                console.log(error);
                setSiteIsLoading2(false);
            });
        })();
        // eslint-disable-next-line
    }, [objectDeleted, user]);

    useEffect(() => {
        if (user) {
            (async () => {
                setSiteIsLoading2(true);
                // console.log("THIS RAN IN BOOKINMGS")

                let queryBookingsPublic = new Moralis.Query("BookingsPublic");
                let queryUserPublic = new Moralis.Query("UserPublic");
                queryUserPublic.equalTo("user", user);
                queryBookingsPublic.matchesQuery("providerPublic", queryUserPublic);
                queryBookingsPublic.include("booking");
                queryBookingsPublic.descending("updatedAt");

                await queryBookingsPublic.find()
                    .then(function (results) {

                        // console.log("SFDJfd33555DKLSFJS", results)

                        let bookingsArray = results.map((x) => {
                            return x.attributes.service;
                        })

                        setBookings(bookingsArray);
                        setBookings2(results);
                        // console.log("bookingspublic323", results);

                        setSiteIsLoading2(false);
                    })
                    .catch(function (error) {
                        console.log(error);
                        setSiteIsLoading2(false);
                    });

            })();
        }
        // eslint-disable-next-line
    }, [user])

    // for services I am providing
    useEffect(() => {
        if (reloadPage) {
            setReloadPage(false);
            if (user) {
                (async () => {
                    setSiteIsLoading2(true);
                    // console.log("THIS RAN IN BOOKINMGS")

                    let queryBookingsPublic = new Moralis.Query("BookingsPublic");
                    let queryUserPublic = new Moralis.Query("UserPublic");
                    queryUserPublic.equalTo("user", user);
                    queryBookingsPublic.matchesQuery("providerPublic", queryUserPublic);
                    queryBookingsPublic.include("booking");
                    queryBookingsPublic.descending("updatedAt");

                    await queryBookingsPublic.find()
                        .then(function (results) {
                            // console.log("SFDJDKLSFJS", results)

                            let bookingsArray = results.map((x) => {
                                return x.attributes.service;
                            })

                            setBookings(bookingsArray);
                            setBookings2(results);
                            console.log("bookingspublic111", results);

                            setSiteIsLoading2(false);
                        })
                        .catch(function (error) {
                            console.log(error);
                            setSiteIsLoading2(false);
                        });

                })();
            }
        }
    }, [user, reloadPage])

    // for services I have booked
    useEffect(() => {
        if (user) {
            (async () => {
                setSiteIsLoading2(true);
                // console.log("THIS RAN IN BOOKED")

                let queryBookingsPublic = new Moralis.Query("BookingsPublic");
                let queryUserPublic = new Moralis.Query("UserPublic");
                queryUserPublic.equalTo("user", user);
                queryBookingsPublic.matchesQuery("userPublic", queryUserPublic);
                queryBookingsPublic.include("booking");
                queryBookingsPublic.descending("updatedAt");

                await queryBookingsPublic.find()
                    .then(function (results) {

                        let bookedArray = results.map((x) => {
                            return x.attributes.service;
                        })
                        setBookedServices(bookedArray);
                        setBookedServices2(results);
                        setSiteIsLoading2(false);
                    })
                    .catch(function (error) {
                        console.log(error);
                        setSiteIsLoading2(false);
                    });

            })();

        }
        // eslint-disable-next-line
    }, [user, reloadPage])

    useEffect(() => {
        if (myFavourites.length > 0 && user) {
            (async () => {
                // console.log("THIS RAN IN FAVORUITES")

                let Services = Moralis.Object.extend("Services");
                let queryFavourites = new Moralis.Query(Services);
                queryFavourites.containedIn("objectId", myFavourites);
                queryFavourites.include("providerPublic");
                queryFavourites.descending("updatedAt");

                await queryFavourites.find()
                    .then(function (results) {
                        setMyFavServices(results);
                        setSiteIsLoading2(false);
                    })
                    .catch(function (error) {
                        console.log(error);
                        setSiteIsLoading2(false);
                    });

            })();
        } else {
            setMyFavServices([]);
        }
        // eslint-disable-next-line
    }, [myFavourites, user])

    useEffect(() => {
        (async () => {
            setSiteIsLoading2(true);
            // console.log("THIS RAN IN USERHISTORY")
            let viewedServicesIds = [];

            if (user && user.attributes.userHistory) {
                viewedServicesIds = user.attributes.userHistory.viewHistory;
            } else {
                viewedServicesIds = userHistory.viewHistory;
            };

            let Services = Moralis.Object.extend("Services");
            let queryHistory = new Moralis.Query(Services);
            queryHistory.containedIn("objectId", viewedServicesIds);
            queryHistory.include("providerPublic");

            await queryHistory.find()
                .then(function (results) {
                    setViewedServices(results);
                    setSiteIsLoading2(false);
                })
                .catch(function (error) {
                    console.log(error);
                    setSiteIsLoading2(false);
                });

        })();
        // eslint-disable-next-line
    }, [userHistory, user])

    const destroyMyObject = async (id) => {
        const classServices = Moralis.Object.extend("Services");
        const query = new Moralis.Query(classServices);
        let myObject = await query.get(id).catch((error) => {
            console.log("errrorss:", error);
        });
        if (myObject) {
            await myObject.destroy().then((myObject) => {
                console.log("deleted:", myObject);
                setObjectDeleted(!objectDeleted);
                setSelectedService("");
                history.goBack();
                setReloadPage(true);
                // The object was deleted from the Moralis Cloud.
            }).catch((error) => {
                console.log("errrorss:", error);
                // The delete failed.
                // error is a Moralis.Error with an error code and message.
            });
        };
    };

    const grayText = colorMode === "light" ? "gray.500" : "gray.400";
    const grayText2 = colorMode === "light" ? "gray.600" : "gray.100";
    const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(249,249,249,0.07) 50%, rgba(249,249,249,0.0) 100%)";

    // const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(249,249,249,0.07) 50%, rgba(249,249,249,0.0) 100%)";

    const bgGradientDark = "radial-gradient(circle at 80vw -30vh, rgba(0,201,153, 0.25) 0%, rgba(13,110,253,0.15) 35%, rgba(19,19,19,0.5) 100%)";
    const bg = useColorModeValue(bgGradientLight, bgGradientDark);

    return (
        <Box w="100%" minH="100vh" minW="100vw" h="100%" p={0} bg={bg} border={0}>
            {isAuthenticated ? (
                <Switch>
                    <Route exact path="/activity/who/myservices/:id">
                        <Box display={["none", "block", "", ""]} position="relative" zIndex="2">
                            <Header bgSearch={[colorMode === "light" ? "gray.50" : "gray.900", "none", "", ""]} />
                        </Box>
                        <Box p={[0, 4, 6, 8]} minH="100%">
                            <Container minHeight={["91vh", "400px", "", ""]} maxW="lg" borderRadius={["0", "xl", "xl", "xl"]} px={[4, 6, "", ""]} pb={[4, 6, "", ""]} pt={[2, 5, "", ""]} mb={["60px", "0", "", ""]} >
                                <EditService user={user}
                                    history={history}
                                    destroyMyObject={destroyMyObject}
                                    siteIsLoading2={siteIsLoading2}
                                    setSiteIsLoading2={setSiteIsLoading2}
                                    grayText={grayText}
                                    setSelectedService={setSelectedService}
                                    selectedService={selectedService}
                                    category={category}
                                    setCategory={setCategory}
                                    subCategory={subCategory}
                                    setSubCategory={setSubCategory}
                                    title={title}
                                    setTitle={setTitle}
                                    rate={rate}
                                    setRate={setRate}
                                    description={description}
                                    setDescription={setDescription}
                                    myLat={myLat}
                                    setMyLat={setMyLat}
                                    myLong={myLong}
                                    setMyLong={setMyLong}
                                    serviceLocationChoice={serviceLocationChoice}
                                    setServiceLocationChoice={setServiceLocationChoice}
                                    dayTime={dayTime}
                                    setDayTime={setDayTime}
                                    setYouWhoSwitch={setYouWhoSwitch}
                                />
                            </Container>
                        </Box>
                    </Route>
                    <Route exact path="/activity/you/viewed/:id">
                        <ViewService
                            viewService={selectedService}
                            setViewService={setSelectedService}
                            myFavourites={myFavourites}
                            setMyFavourites={setMyFavourites}
                            setReloadPage={setReloadPage}
                        />
                    </Route>
                    <Route exact path="/activity/you/booked/:id/:payment?">
                        <Box display={["none", "block", "", ""]} position="relative" zIndex="2">
                            <Header bgSearch={[colorMode === "light" ? "gray.50" : "gray.900", "none", "", ""]} />
                        </Box>
                        <Box p={[0, 4, 6, 8]} minH="100%">
                            <Container minHeight={["91vh", "400px", "", ""]} maxW="lg" borderRadius={["0", "xl", "xl", "xl"]} px={[4, 6, "", ""]} pb={[4, 6, "", ""]} pt={[2, 5, "", ""]} mb={["60px", "", "", ""]} >
                                <BookedService
                                    bookedService={selectedService}
                                    setBookedService={setSelectedService}
                                    bookedService2={bookedService2}
                                    setBookedService2={setBookedService2}
                                    myFavourites={myFavourites}
                                    setMyFavourites={setMyFavourites}
                                    grayText2={grayText2}
                                    setReloadPage={setReloadPage}
                                />
                            </Container>
                        </Box>
                    </Route>
                    <Route path="/activity/who/bookings/:id">
                        <Box display={["none", "block", "", ""]} position="relative" zIndex="2">
                            <Header bgSearch={[colorMode === "light" ? "gray.50" : "gray.900", "none", "", ""]} />
                        </Box>
                        <Box p={[0, 4, 6, 8]} minH="100%">
                            <Container minHeight={["91vh", "400px", "", ""]} maxW="lg" borderRadius={["0", "xl", "xl", "xl"]} px={[4, 6, "", ""]} pb={[4, 6, "", ""]} pt={[2, 5, "", ""]} mb={["60px", "", "", ""]} >
                                <Bookings
                                    bookedService={selectedService}
                                    setBookedService={setSelectedService}
                                    bookedService2={bookedService2}
                                    setBookedService2={setBookedService2}
                                    grayText2={grayText2}
                                    setReloadPage={setReloadPage}
                                />
                            </Container>
                        </Box>
                    </Route>
                    <Route path="/activity/:side?/:tab?">
                        <Header bgSearch={[colorMode === "light" ? "gray.50" : "gray.900", "none", "", ""]} />
                        <Box p={[0, 4, 6, 8]} minH="100%">
                            <Container minHeight={["91vh", "400px", "", ""]} maxW="lg" borderRadius={["0", "xl", "xl", "xl"]} px={[4, 6, "", ""]} pb={[4, 6, "", ""]} pt={[1, 5, "", ""]} mb={["60px", "0", "", ""]} >
                                <ActivityTabs
                                    user={user}
                                    servicesCounter={servicesCounter}
                                    history={history}
                                    side={side}
                                    grayText2={grayText2}
                                    destroyMyObject={destroyMyObject}
                                    siteIsLoading2={siteIsLoading2}
                                    setSiteIsLoading2={setSiteIsLoading2}
                                    grayText={grayText}
                                    myServices={myServices}
                                    setSelectedService={setSelectedService}
                                    youWhoSwitch={youWhoSwitch}
                                    setYouWhoSwitch={setYouWhoSwitch}
                                    bookings={bookings}
                                    bookings2={bookings2}
                                    deleted={deleted}
                                    myFavourites={myFavourites}
                                    bookedServices={bookedServices}
                                    setBookedServices={setBookedServices}
                                    setBookedService2={setBookedService2}
                                    bookedServices2={bookedServices2}
                                    viewedServices={viewedServices}
                                    setViewedServices={setViewedServices}
                                    myFavServices={myFavServices}
                                />
                            </Container>
                        </Box>
                        <FootNav />
                    </Route>
                </Switch>
            ) : (
                <>
                    {!user &&
                        <Switch>
                            <Route path="/activity/you/viewed">
                                <Header bgSearch={[colorMode === "light" ? "gray.50" : "gray.900", "none", "", ""]} />
                                <Box p={[0, 4, 6, 8]} minH="100%">
                                    <Container minHeight={["91vh", "400px", "", ""]} maxW="lg" borderRadius={["0", "xl", "xl", "xl"]} px={[4, 6, "", ""]} pb={[4, 6, "", ""]} pt={[1, 5, "", ""]} mb={["60px", "0", "", ""]} >
                                        <ActivityTabs user={user}
                                            servicesCounter={servicesCounter}
                                            history={history}
                                            side={side}
                                            grayText2={grayText2}
                                            destroyMyObject={destroyMyObject}
                                            siteIsLoading2={siteIsLoading2}
                                            setSiteIsLoading2={setSiteIsLoading2}
                                            grayText={grayText}
                                            myServices={myServices}
                                            setSelectedService={setSelectedService}
                                            youWhoSwitch={youWhoSwitch}
                                            setYouWhoSwitch={setYouWhoSwitch}
                                            bookings={bookings}
                                            bookings2={bookings2}
                                            deleted={deleted}
                                            myFavourites={myFavourites}
                                            bookedServices={bookedServices}
                                            setBookedServices={setBookedServices}
                                            setBookedService2={setBookedService2}
                                            bookedServices2={bookedServices2}
                                            viewedServices={viewedServices}
                                            setViewedServices={setViewedServices}
                                            myFavServices={myFavServices}
                                        />
                                    </Container>
                                </Box>
                                <FootNav />
                            </Route>
                            <Route path="/activity" >
                                <Redirect to="/activity/you/viewed" />
                            </Route>
                        </Switch>
                    }
                </>
            )}
        </Box>
    )
}


