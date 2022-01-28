import React, { useContext, useEffect, useState, useRef } from 'react';
import { useHistory, useParams, Link as RouterLink, BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import { useMoralis } from "react-moralis";
import Moralis from "moralis";
import { Box, Container, useColorModeValue, useColorMode, Text, Center, Stack, Spinner, Flex, Icon } from "@chakra-ui/react";
import { SiteStateContext } from "../context/SiteStateContext";
import Header from '../header/Header';
import ViewService from '../search/ViewService';
import SearchResults from '../search/SearchResults';
import FootNav from '../footnav/FootNav';
import * as FaI from "react-icons/fa";
// import * as BiI from "react-icons/bi";
// import * as MdI from "react-icons/md";

export default function Search(props) {

    const { user, setUserData, userError } = useMoralis();
    const { siteIsLoading, setSiteIsLoading, userHistory, setUserHistory, userLoc } = useContext(SiteStateContext);
    const { colorMode } = useColorMode();
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const query = searchParams.get('query') || "";
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');
    const title = searchParams.get('title');
    const who = searchParams.get('who');
    const [newServiceError, setNewServiceError] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [checkedLoc, setCheckedLoc] = useState(false); // change to false if needed
    const [viewService, setViewService] = useState("");
    const [queryResults, setQueryResults] = useState("");
    const [sortResults, setSortResults] = useState("");
    const [noSearchResults, setNoSearchResults] = useState((<Center h="50vw"><Spinner size="xl" color="primary.300" /></Center>));
    const [filterSwitch, setFilterSwitch] = useState(false);
    const [myFavourites, setMyFavourites] = useState(user && user.attributes.myFavourites ? user.attributes.myFavourites : []);
    const [reloadPage, setReloadPage] = useState(false);
    const history = useHistory();
    const queryRef = useRef();
    const filterSwitchRef = useRef();
    const sortResultsRef = useRef();
    const currLocRef = useRef(userLoc);

    useEffect(() => {
        setUserHistory(JSON.parse(window.localStorage.getItem("anonUser")));
        handleLocation();
        setCheckedLoc(true);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {

        (async () => {

            let anonUserObj;

            if (user && user.attributes.userHistory) {
                anonUserObj = user.attributes.userHistory;
            } else if (userHistory && userHistory !== { viewHistory: [], searchHistory: [] }) {
                anonUserObj = userHistory;
            } else {
                anonUserObj = { viewHistory: [], searchHistory: [] };
            }

            if (viewService.id) {
                if (anonUserObj.viewHistory && anonUserObj.viewHistory.length >= 30) {
                    anonUserObj.viewHistory.pop();
                };
                if (anonUserObj.viewHistory && anonUserObj.viewHistory.indexOf(viewService.id) <= -1) anonUserObj.viewHistory.unshift(viewService.id);
            }

            if (query) {
                if (anonUserObj.searchHistory && anonUserObj.searchHistory.length >= 30) {
                    anonUserObj.searchHistory.pop();
                };
                if (anonUserObj.searchHistory && anonUserObj.searchHistory.indexOf(query) <= -1) anonUserObj.searchHistory.unshift(query);
            }

            setUserHistory(anonUserObj);

            if (user) {
                await setUserData({
                    userHistory: anonUserObj
                });
            } else {
                window.localStorage.setItem('anonUser', JSON.stringify(anonUserObj));
            }

        })();
    }, [viewService, query])

    useEffect(() => {
        if (query !== queryRef.current || filterSwitch !== filterSwitchRef.current || sortResults !== sortResultsRef.current) {
            setSiteIsLoading(true);
            if (query || query === "" || category || subCategory || title) {
                (async () => {
                    await handleLocation();
                    await searchResults();
                    queryRef.current = query;
                    filterSwitchRef.current = filterSwitch;
                    sortResultsRef.current = sortResults;
                    setSiteIsLoading(false);
                })();

            } else {
                setQueryResults("");
                setNoSearchResults(noResults);
                setSiteIsLoading(false);
            }
        } else {
            setSiteIsLoading(false);
        }
        // eslint-disable-next-line
    }, [queryRef.current, filterSwitch, sortResults, siteIsLoading])


    const searchResults = async () => {
        await handleLocation();
        let geoPoint = new Moralis.GeoPoint(currLocRef.current);

        let Services = Moralis.Object.extend("Services");

        let queryTitle = new Moralis.Query(Services);
        queryTitle.matches("title", query);

        let queryCategory = new Moralis.Query(Services);
        queryCategory.matches("category", query);

        let querySubCategory = new Moralis.Query(Services);
        querySubCategory.matches("subCategory", query);

        let queryDescription = new Moralis.Query(Services);
        queryDescription.matches("description", query);

        let queryServices;

        if (query !== "" && query !== null) {

            await handleLocation();
            geoPoint = new Moralis.GeoPoint(currLocRef.current);

            queryServices = Moralis.Query.or(queryTitle, queryCategory, querySubCategory, queryDescription);

            queryServices.include("providerPublic");

            if (sortResults) {
                if (sortResults === "nearest") {
                    if (currLocRef.current[0] === 13.37 && currLocRef.current[1] === 13.37) {
                        setSortResults("rateDesc");
                        setNewServiceError(["Geolocation Failed", "Please allow location or GPS in your web-browser or device."]);
                        setShowAlert(true);
                        return;
                    } else {
                        try {
                            queryServices.near("location", geoPoint);
                        } catch (error) {
                            console.log(error)
                        }
                    }
                }

                if (sortResults === "rateDesc") {
                    queryServices.descending("rate");
                }

                if (sortResults === "rateAsc") {
                    queryServices.ascending("rate");
                }

                if (sortResults === "reviewDesc") {
                    queryServices.descending("updatedAt");
                }

                if (sortResults === "reviewAsc") {
                    queryServices.ascending("updatedAt");
                }

                if (sortResults === "newest") {
                    queryServices.descending("updatedAt");
                }

                if (sortResults === "oldest") {
                    queryServices.ascending("updatedAt");
                }
            };

            await queryServices.find()
                .then(async function (results) {

                    if (currLocRef.current[0] !== 13.37 && currLocRef.current[1] !== 13.37) {
                        for (let i = 0; i < results.length; ++i) {
                            results[i].distance = results[i].attributes.location.kilometersTo(geoPoint).toFixed(1);
                        }
                    };

                    setQueryResults(results);

                    if (results.length === 0) {

                        await handleLocation();
                        geoPoint = new Moralis.GeoPoint(currLocRef.current);

                        let queryCategoryText = new Moralis.Query(Services);
                        queryCategoryText.fullText("category", query);
                        queryCategoryText.include("providerPublic");

                        if (sortResults) {
                            if (sortResults === "nearest") {
                                if (currLocRef.current[0] === 13.37 && currLocRef.current[1] === 13.37) {
                                    setSortResults("rateDesc");
                                    setNewServiceError(["Geolocation Failed", "Please allow location or GPS in your web-browser or device."]);
                                    setShowAlert(true);
                                    return;
                                } else {
                                    try {
                                        queryServices.near("location", geoPoint);
                                    } catch (error) {
                                        console.log(error)
                                    }
                                }
                            }

                            if (sortResults === "rateDesc") {
                                queryCategoryText.descending("rate");
                            }

                            if (sortResults === "rateAsc") {
                                queryCategoryText.ascending("rate");
                            }

                            if (sortResults === "reviewDesc") {
                                queryCategoryText.descending("updatedAt");
                            }

                            if (sortResults === "reviewAsc") {
                                queryCategoryText.ascending("updatedAt");
                            }

                            if (sortResults === "newest") {
                                queryCategoryText.descending("updatedAt");
                            }

                            if (sortResults === "oldest") {
                                queryCategoryText.ascending("updatedAt");
                            }
                        };

                        await queryCategoryText.find()
                            .then(async function (results) {

                                if (currLocRef.current[0] !== 13.37 && currLocRef.current[1] !== 13.37) {
                                    for (let i = 0; i < results.length; ++i) {
                                        results[i].distance = results[i].attributes.location.kilometersTo(geoPoint).toFixed(1);
                                    }
                                };

                                setQueryResults(results);

                                if (results.length === 0) {

                                    await handleLocation();
                                    geoPoint = new Moralis.GeoPoint(currLocRef.current);

                                    let queryTitleText = new Moralis.Query(Services);
                                    queryTitleText.fullText("title", query);
                                    queryTitleText.include("providerPublic");

                                    if (sortResults) {
                                        if (sortResults === "nearest") {
                                            if (currLocRef.current[0] === 13.37 && currLocRef.current[1] === 13.37) {
                                                setSortResults("rateDesc");
                                                setNewServiceError(["Geolocation Failed", "Please allow location or GPS in your web-browser or device."]);
                                                setShowAlert(true);
                                                return;
                                            } else {
                                                try {
                                                    queryServices.near("location", geoPoint);
                                                } catch (error) {
                                                    console.log(error)
                                                }
                                            }
                                        }

                                        if (sortResults === "rateDesc") {
                                            queryTitleText.descending("rate");
                                        }

                                        if (sortResults === "rateAsc") {
                                            queryTitleText.ascending("rate");
                                        }

                                        if (sortResults === "reviewDesc") {
                                            queryTitleText.descending("updatedAt");
                                        }

                                        if (sortResults === "reviewAsc") {
                                            queryTitleText.ascending("updatedAt");
                                        }

                                        if (sortResults === "newest") {
                                            queryTitleText.descending("updatedAt");
                                        }

                                        if (sortResults === "oldest") {
                                            queryTitleText.ascending("updatedAt");
                                        }
                                    };

                                    await queryTitleText.find()
                                        .then(function (results) {

                                            if (currLocRef.current[0] !== 13.37 && currLocRef.current[1] !== 13.37) {
                                                for (let i = 0; i < results.length; ++i) {
                                                    results[i].distance = results[i].attributes.location.kilometersTo(geoPoint).toFixed(1);
                                                }
                                            };

                                            setQueryResults(results);

                                            if (results.length === 0) {

                                                setNoSearchResults(noResults);

                                            }
                                        })
                                }
                            })
                    }
                })
                .catch(function (error) {
                    // There was an error.
                    setNewServiceError(["Search Failed", error.message]);
                    setShowAlert(true);
                });

        } else {

            queryServices = new Moralis.Query(Services);

            await handleLocation();
            geoPoint = new Moralis.GeoPoint(currLocRef.current);

            if (sortResults) {
                if (sortResults === "nearest") {
                    if (currLocRef.current[0] === 13.37 && currLocRef.current[1] === 13.37) {
                        setSortResults("rateDesc");
                        setNewServiceError(["Geolocation Failed", "Please allow location or GPS in your web-browser or device."]);
                        setShowAlert(true);
                        return;
                    } else {
                        queryServices.near("location", geoPoint);
                    }
                }

                if (sortResults === "rateDesc") {
                    queryServices.descending("rate");
                }

                if (sortResults === "rateAsc") {
                    queryServices.ascending("rate");
                }

                if (sortResults === "reviewDesc") {
                    queryServices.descending("updatedAt");
                }

                if (sortResults === "reviewAsc") {
                    queryServices.ascending("updatedAt");
                }

                if (sortResults === "newest") {
                    queryServices.descending("updatedAt");
                }

                if (sortResults === "oldest") {
                    queryServices.ascending("updatedAt");
                }
            };

            if (who !== "" && who !== null) {
                const providerObject = Moralis.Object.extend("UserPublic");
                const queryProvider = new Moralis.Query(providerObject);
                queryProvider.equalTo("username", String(who))
                const userProvider = await queryProvider.first();
                queryServices.equalTo("providerPublic", userProvider);

            }

            queryServices.limit(50);
            queryServices.include("providerPublic");


            await queryServices.find().then(function (results) {
                // results contains a weight / rank in result.get('score')
                if (results.length === 0) {
                    setNoSearchResults(noResults);
                } else {
                    if (currLocRef.current[0] !== 13.37 && currLocRef.current[1] !== 13.37) {
                        for (let i = 0; i < results.length; ++i) {
                            results[i].distance = results[i].attributes.location.kilometersTo(geoPoint).toFixed(1);
                        }
                    };
                    setQueryResults(results);
                }
            })
                .catch(function (error) {
                    // There was an error.
                    setNewServiceError(["Search Failed", error.message]);
                    setShowAlert(true);
                });
        }

    }

    async function handleLocation() {

        await getLocation();

        async function getLocation() {
            if (navigator.geolocation) {
                await navigator.geolocation.getCurrentPosition(showPosition, showError);
            } else {
                setNewServiceError(["Geolocation Failed", "Geolocation is not supported by this browser."]);
                setShowAlert(true);
            }
        }

        async function showPosition(position) {
            currLocRef.current = [Number(position.coords.latitude), Number(position.coords.longitude)];
        }

        function showError(error) {
            if (document.getElementById("sortSelect")) document.getElementById("sortSelect").value = "rateDesc";
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    setNewServiceError(["Geolocation Failed", "Please allow location or GPS in your web-browser or device."]);
                    if (checkedLoc === false) setShowAlert(true);
                    break;
                case error.POSITION_UNAVAILABLE:
                    setNewServiceError(["Geolocation Failed", "Location information is unavailable."]);
                    setShowAlert(true);
                    break;
                case error.TIMEOUT:
                    setNewServiceError(["Geolocation Failed", "The request to get user location timed out."]);
                    setShowAlert(true);
                    break;
                case error.UNKNOWN_ERROR:
                    setNewServiceError(["Geolocation Failed", "An unknown error occurred."]);
                    setShowAlert(true);
                    break;
                default:
                    setNewServiceError(["Geolocation Failed", "Please allow location/GPS in your web-browser/app."]);
                    setShowAlert(true);
                    break;
            }
        }

    }

    const grayText = colorMode === "light" ? "gray.500" : "gray.400";
    const grayText2 = colorMode === "light" ? "gray.600" : "gray.300";
    const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(249,249,249,0.07) 50%, rgba(249,249,249,0.0) 100%)";

    // const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(249,249,249,0.07) 50%, rgba(249,249,249,0.0) 100%)";

    const bgGradientDark = "radial-gradient(circle at 80vw -30vh, rgba(0,201,153, 0.25) 0%, rgba(13,110,253,0.15) 35%, rgba(19,19,19,0.5) 100%)";
    const bg = useColorModeValue(bgGradientLight, bgGradientDark);

    const noResults = (
        <Center minHeight="200px" mt="0px !important">
            <Stack textAlign="center" role="button" onClick={() => { document.getElementById("main-search").focus(); document.getElementById("main-search-group").classList.add("focusSearch"); setTimeout(() => { document.getElementById("main-search-group").classList.remove("focusSearch") }, 1000) }}>
                <Center mb={2}><Icon as={FaI.FaSearchMinus} fontSize="30px" color="secondary.300" /></Center>
                <Text >We could not find any services that matched your search.</Text>
                <Text >Please try search for another service.</Text>
            </Stack>
        </Center>
    );

    return (
        <Box w="100%" minH="100vh" minW="100vw" h="100%" p={0} bg={["", bg, bg, bg]} border={0}>
            <Switch>
                <Route exact path="/search/view/:id">
                    <ViewService user={user}
                        viewService={viewService}
                        setViewService={setViewService}
                        myFavourites={myFavourites}
                        setMyFavourites={setMyFavourites}
                        setReloadPage={setReloadPage}
                    />
                </Route>
                <Route path="/search">
                    <SearchResults user={user}
                        who={who}
                        history={history}
                        siteIsLoading={siteIsLoading}
                        query={query}
                        category={category}
                        title={title}
                        queryResults={queryResults}
                        grayText={grayText}
                        grayText2={grayText2}
                        noSearchResults={noSearchResults}
                        setViewService={setViewService}
                        setSortResults={setSortResults}
                        newServiceError={newServiceError}
                        showAlert={showAlert}
                        setShowAlert={setShowAlert}
                        colorMode={colorMode}
                    />
                    <FootNav />
                </Route>
            </Switch>
        </Box>
    )
}
