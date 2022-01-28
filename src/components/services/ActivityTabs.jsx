import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Center, Text, Icon, Stack, Flex, Spinner, Tabs, TabList, Tab, TabPanels, TabPanel, Image, Switch, Spacer, useToast } from "@chakra-ui/react";
import YouWhoLogo from "../../media/logo/YouWhoLogo.jsx";
import * as FaI from "react-icons/fa";
import * as Io5 from "react-icons/io5";
import * as HiI from "react-icons/hi";
import YouWhoLoading from '../misc/YouWhoLoading';



export default function ActivityTabs({ user, servicesCounter, history, siteIsLoading2, grayText, grayText2, myServices, setSelectedService, side, youWhoSwitch, setYouWhoSwitch, bookings, bookings2, deleted, myFavourites, bookedServices, bookedServices2, setBookedService2, viewedServices, myFavServices }) {

    const toast = useToast();
    const { tab } = useParams();

    useEffect(() => {
        if (user) {
            if (side !== "you" || side !== "who") history.push(`/activity/${youWhoSwitch ? "who" : "you"}`);
        } else {
            history.push("/activity/you/viewed");
        }
        // eslint-disable-next-line
    }, [side])


    return (
        <>
            <Flex mb={3} mr={1} color={grayText2}>
                <Text fontWeight="400" fontSize="3xl" ml={1} style={{ display: "flex", alignItems: "center" }} ><Icon as={Io5.IoReaderOutline} color={youWhoSwitch ? "primary.300" : "secondary.300"} mr={2} />My Activity</Text>
                <Spacer />
                {user &&
                    <Flex color={grayText} fontSize="xl">
                        {youWhoSwitch ? (
                            <><Text color="third.500" fontWeight="300">w</Text><Text fontWeight="300">ho</Text></>
                        ) : (
                            <><Text color="secondary.400">y</Text><Text>ou</Text></>
                        )}
                        <Box id="youWhoSwitch" className={youWhoSwitch ? "who" : "you"} ><Switch ml={2} size="md" isChecked={youWhoSwitch} onChange={() => { setYouWhoSwitch(!youWhoSwitch); window.localStorage.setItem("youWhoSwitch", !youWhoSwitch); history.push(`/activity/${!youWhoSwitch ? "who" : "you"}`); }} /></Box>
                    </Flex>
                }
            </Flex>

            {
                youWhoSwitch ? (

                    <Tabs isFitted variant="enclosed" defaultIndex={tab === "bookings" ? 1 : tab === "deleted" ? 2 : 0}>

                        <TabList borderBottom="1px" borderColor="gray.10" mb={3} >
                            <Tab visibility={user ? "visible" : "hidden"} px={1} color="third.600" _selected={{ fontWeight: "500", color: "third.700", bg: "third.200", borderTopRadius: "lg", }} onClick={() => history.push("/activity/who/services")}>{servicesCounter ? servicesCounter : "0"} services</Tab>
                            <Tab visibility={user ? "visible" : "hidden"} px={1} color="third.600" _selected={{ fontWeight: "500", color: "third.700", bg: "third.200", borderTopRadius: "lg", }} onClick={() => history.push("/activity/who/bookings")}>{bookings.length > 0 ? bookings.length : "0"} bookings</Tab>
                            <Tab visibility={user ? "visible" : "hidden"} px={1} color="third.600" _selected={{ fontWeight: "500", color: "third.700", bg: "third.200", borderTopRadius: "lg", }} onClick={() => history.push("/activity/who/deleted")}>{deleted.length > 0 ? deleted.length : "0"} deleted</Tab>
                        </TabList>

                        <TabPanels >
                            <TabPanel align="start" borderBottomRadius="lg" borderTopRightRadius="lg" p={["0", "", "", ""]}>
                                <Box align="center">
                                    <Stack spacing="3">
                                        {siteIsLoading2 ? (
                                            <YouWhoLoading />
                                        ) : (
                                            <>
                                                {myServices.length > 0 ? (
                                                    myServices.map((x, i) => {
                                                        return (
                                                            <Flex role="button" onClick={() => { setSelectedService(x); history.push(`/activity/who/myservices/${x.id}`); window.scrollTo(0, 0); }} id={x.id} key={"Box" + i} bg="gray.5" borderRadius="md" overflow="hidden" align="center">
                                                                <Box id={"flex1" + i} key={"flex1" + i} minWidth={["29vw", "120px", ""]} minHeight={["29vw", "120px", ""]} >
                                                                    {x.attributes.service_img1 ? (
                                                                        <Image id={"img1" + i} key={"img1" + i} w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} objectFit="cover" src={x.attributes.service_img1._url} fallback={<Center w={["29vw", "120px", ""]} h={["29vw", "120px", ""]}><Spinner /></Center>} borderLeftRadius="md" />
                                                                    ) : (
                                                                        <Center filter="grayscale(1)" bg="gray.5" key={"logo" + i} w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} >
                                                                            <YouWhoLogo opacity="0.2" wdth={["68%", "", ""]} />
                                                                        </Center>
                                                                    )}
                                                                </Box>
                                                                <Box textAlign="left" px={3} maxHeight={["29vw", "120px", ""]} overflow="auto">
                                                                    {/* <Text id={"id" + i} key={"id" + i}>ID: {x.id}</Text> */}
                                                                    <Text id={"title" + i} key={"title" + i} fontWeight="500" textTransform="capitalize" fontSize="sm">{x.attributes.title}</Text>
                                                                    <Text id={"category" + i} key={"category" + i} color={grayText} textTransform="capitalize" fontSize="xs">{x.attributes.category} {x.attributes.subCategory ? <Text as="span">&bull;</Text> : ""} {x.attributes.subCategory}</Text>
                                                                    <Text id={"rate" + i} key={"rate" + i} color="primary.500" textTransform="capitalize" fontSize="xl" fontWeight="500"><Text as="span" fontSize="md">$</Text>{x.attributes.rate}<Text as="span" fontSize="xs" color={grayText}> USD/hr.</Text></Text>
                                                                </Box>
                                                            </Flex>
                                                        )
                                                    })
                                                ) : (
                                                    <Center minHeight="200px" >
                                                        <Stack role="button" onClick={() => history.push("/newservice")}>
                                                            <Center mb={2}><Icon as={FaI.FaSeedling} fontSize="30px" color="secondary.300" /></Center>
                                                            <Text >You have not posted any services.</Text>
                                                            <Text >Please click here to create a <Text as="span" color="primary.500" fontWeight="600">New Service</Text>.</Text>
                                                        </Stack>
                                                    </Center>
                                                )}
                                            </>
                                        )}
                                    </Stack>
                                </Box>
                            </TabPanel>

                            <TabPanel align="start" borderBottomRadius="lg" borderTopRightRadius="lg" p={["0", "", "", ""]} >
                                <Box align="center">
                                    <Stack spacing="3">
                                        {siteIsLoading2 ? (
                                            <YouWhoLoading />
                                        ) : (
                                            <>
                                                {(bookings.length > 0 && bookings2.length > 0) ? (
                                                    bookings.map((x, i) => {
                                                        return (
                                                            <Flex role="button" onClick={() => { setSelectedService(x); setBookedService2(bookings2[i].attributes.booking); history.push(`/activity/who/bookings/${bookings2[i].attributes.booking.id}`); window.scrollTo(0, 0); }} id={x.id} key={"Box" + i} bg="gray.5" borderRadius="md" overflow="hidden" align="center">
                                                                <Box id={"flex1" + i} key={"flex1" + i} minWidth={["29vw", "120px", ""]} minHeight={["29vw", "120px", ""]} >
                                                                    {x.attributes.service_img1 ? (
                                                                        <Image id={"img1" + i} key={"img1" + i} w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} objectFit="cover" src={x.attributes.service_img1._url} fallback={<Center w={["29vw", "120px", ""]} h={["29vw", "120px", ""]}><Spinner /></Center>} borderLeftRadius="md" />
                                                                    ) : (
                                                                        <Center filter="grayscale(1)" bg="gray.5" key={"logo" + i} w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} >
                                                                            <YouWhoLogo opacity="0.2" wdth={["68%", "", ""]} />
                                                                        </Center>
                                                                    )}
                                                                </Box>
                                                                <Box textAlign="left" px={3} maxHeight={["29vw", "120px", ""]} overflow="auto">
                                                                    {/* <Text id={"id" + i} key={"id" + i}>ID: {x.id}</Text> */}
                                                                    <Text id={"title" + i} key={"title" + i} fontWeight="500" textTransform="capitalize" fontSize="sm">{x.attributes.title}</Text>
                                                                    <Text id={"category" + i} key={"category" + i} color={grayText} textTransform="capitalize" fontSize="xs">{bookings2[i].attributes.booking.id}</Text>
                                                                    {bookings2[i].attributes.approval === "paid" ?
                                                                        <Text id={"rate" + i} key={"rate" + i} color="green.400" textTransform="capitalize" fontSize="xl" fontWeight="500">PAID</Text>
                                                                        :
                                                                        bookings2[i].attributes.approval === "approved" ?
                                                                            <Text id={"rate" + i} key={"rate" + i} color="primary.500" textTransform="capitalize" fontSize="xl" fontWeight="500">APPROVED</Text>
                                                                            :
                                                                            bookings2[i].attributes.approval === "declined" ?
                                                                                <Text id={"rate" + i} key={"rate" + i} color="crimson" textTransform="capitalize" fontSize="xl" fontWeight="500">DECLINED</Text>
                                                                                :
                                                                                <Text id={"rate" + i} key={"rate" + i} color="primary.500" textTransform="capitalize" fontSize="xl" fontWeight="500"><Text as="span" fontSize="md">$</Text>{x.attributes.rate}<Text as="span" fontSize="xs" color={grayText}> USD/hr.</Text></Text>
                                                                    }
                                                                </Box>
                                                            </Flex>
                                                        )
                                                    })
                                                ) : (
                                                    <Center minHeight="200px" >
                                                        <Stack role="button" onClick={() => {
                                                            var aux = document.createElement("input");
                                                            aux.setAttribute("value", document.getElementById("whoLink").innerHTML);
                                                            document.body.appendChild(aux);
                                                            aux.select();
                                                            document.execCommand("copy");
                                                            document.body.removeChild(aux);
                                                            toast({
                                                                title: "Link copied.",
                                                                description: `Your personal link: https://servedemo.youwho.io/search?who=${user.attributes.username} has been copied to your clipboard.`,
                                                                status: "info",
                                                                duration: 4000,
                                                                isClosable: true,
                                                                render: () => (
                                                                    <Box w={["94vw", "512px", "", ""]} position="fixed" bottom="0" left="50%" p={4} pb={5} ml={["-47vw", "-251px", "", ""]} color="primary.600" bg="primary.100" borderTopRadius="lg">
                                                                        Your personal link:<br /><b>https://servedemo.youwho.io/search?who={user.attributes.username}</b><br />has been copied to your clipboard.
                                                                    </Box>
                                                                ),
                                                            });
                                                        }}>
                                                            <Center mb={2}><Icon as={HiI.HiOutlineSpeakerphone} fontSize="30px" color="secondary.300" /></Center>
                                                            <Text >You do not have any bookings for your services.</Text>
                                                            <Text >Pro tip: click this link to copy it: <Text id="whoLink" as="span" color="primary.500" fontWeight="600">{`https://servedemo.youwho.io/search?who=${user.attributes.username}`}</Text> then post it to various social media sites to advertise your services.</Text>
                                                        </Stack>
                                                    </Center>
                                                )}
                                            </>
                                        )}
                                    </Stack>
                                </Box>
                            </TabPanel>

                            <TabPanel align="start" borderBottomRadius="lg" borderTopRightRadius="lg" p={["0", "", "", ""]} >
                                <Box align="center">
                                    <Stack spacing="3">
                                        {siteIsLoading2 ? (
                                            <YouWhoLoading />
                                        ) : (
                                            <>
                                                {deleted.length > 0 ? (
                                                    deleted.map((x, i) => {
                                                        return (
                                                            <Flex role="button" onClick={() => { setSelectedService(x); history.push(`/activity/who/deleted/${x.id}`); window.scrollTo(0, 0); }} id={x.id} key={"Box" + i} bg="gray.5" borderRadius="md" overflow="hidden" align="center">
                                                                <Box id={"flex1" + i} key={"flex1" + i} minWidth={["29vw", "120px", ""]} minHeight={["29vw", "120px", ""]} >
                                                                    {x.attributes.service_img1 ? (
                                                                        <Image id={"img1" + i} key={"img1" + i} w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} objectFit="cover" src={x.attributes.service_img1._url} fallback={<Center w={["29vw", "120px", ""]} h={["29vw", "120px", ""]}><Spinner /></Center>} borderLeftRadius="md" />
                                                                    ) : (
                                                                        <Center filter="grayscale(1)" bg="gray.5" key={"logo" + i} w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} >
                                                                            <YouWhoLogo opacity="0.2" wdth={["68%", "", ""]} />
                                                                        </Center>
                                                                    )}
                                                                </Box>
                                                                <Box textAlign="left" px={3} maxHeight={["29vw", "120px", ""]} overflow="auto">
                                                                    {/* <Text id={"id" + i} key={"id" + i}>ID: {x.id}</Text> */}
                                                                    <Text id={"title" + i} key={"title" + i} fontWeight="500" textTransform="capitalize" fontSize="sm">{x.attributes.title}</Text>
                                                                    <Text id={"category" + i} key={"category" + i} color={grayText} textTransform="capitalize" fontSize="xs">{x.attributes.category} {x.attributes.subCategory ? <Text as="span">&bull;</Text> : ""} {x.attributes.subCategory}</Text>
                                                                    <Text id={"rate" + i} key={"rate" + i} color="primary.500" textTransform="capitalize" fontSize="xl" fontWeight="500"><Text as="span" fontSize="md">$</Text>{x.attributes.rate}<Text as="span" fontSize="xs" color={grayText}> USD/hr.</Text></Text>
                                                                </Box>
                                                            </Flex>
                                                        )
                                                    })
                                                ) : (
                                                    <Center minHeight="200px" >
                                                        <Stack>
                                                            <Center mb={2}><Icon as={Io5.IoTrashBinOutline} fontSize="30px" color="secondary.300" /></Center>
                                                            <Text >You do not have any deleted services.</Text>
                                                            <Text >Note: Deleted services will be permanently deleted if inactive for <Text as="span" color="primary.500" fontWeight="600">60 days or more</Text>.</Text>
                                                        </Stack>
                                                    </Center>
                                                )}
                                            </>
                                        )}
                                    </Stack>
                                </Box>
                            </TabPanel>

                        </TabPanels>
                    </Tabs >

                ) :
                    <>
                        {user ?
                            <Tabs isFitted variant="enclosed" defaultIndex={tab === "booked" ? 1 : tab === "viewed" ? 2 : 0}>

                                <TabList borderBottom="1px" borderColor="gray.10" mb={3}>
                                    <Tab px={1} color="secondary.200" _selected={{ fontWeight: "500", color: "secondary.500", bg: "secondary.100", borderTopRadius: "lg", }} onClick={() => history.push("/activity/you/favourites")}>{myFavourites.length > 0 ? myFavourites.length : "0"}&nbsp;<Icon as={Io5.IoHeartSharp} fontSize="21px" /></Tab>
                                    <Tab px={1} color="secondary.200" _selected={{ fontWeight: "500", color: "secondary.500", bg: "secondary.100", borderTopRadius: "lg", }} onClick={() => history.push("/activity/you/booked")}>{bookedServices.length > 0 ? bookedServices.length : "0"} booked</Tab>
                                    <Tab px={1} color="secondary.200" _selected={{ fontWeight: "500", color: "secondary.500", bg: "secondary.100", borderTopRadius: "lg", }} onClick={() => history.push("/activity/you/viewed")}>{viewedServices.length > 0 ? viewedServices.length : "0"} viewed</Tab>
                                </TabList>

                                <TabPanels >

                                    <TabPanel align="start" borderBottomRadius="lg" borderTopRightRadius="lg" p={["0", "", "", ""]} >
                                        <Box align="center">
                                            <Stack spacing="3">
                                                {siteIsLoading2 ? (
                                                    <YouWhoLoading />
                                                ) : (
                                                    <>
                                                        {myFavServices.length > 0 ? (
                                                            myFavServices.map((x, i) => {
                                                                return (
                                                                    <Flex role="button" onClick={() => { setSelectedService(x); history.push(`/activity/you/viewed/${x.id}`); window.scrollTo(0, 0); }} id={x.id} key={"Box" + i} bg="gray.5" borderRadius="md" overflow="hidden" align="center">
                                                                        <Box id={"flex1" + i} key={"flex1" + i} minWidth={["29vw", "120px", ""]} minHeight={["29vw", "120px", ""]} >
                                                                            {x.attributes.service_img1 ? (
                                                                                <Image id={"img1" + i} key={"img1" + i} w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} objectFit="cover" src={x.attributes.service_img1._url} fallback={<Center w={["29vw", "120px", ""]} h={["29vw", "120px", ""]}><Spinner /></Center>} borderLeftRadius="md" />
                                                                            ) : (
                                                                                <Center filter="grayscale(1)" bg="gray.5" key={"logo" + i} w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} >
                                                                                    <YouWhoLogo opacity="0.2" wdth={["68%", "", ""]} />
                                                                                </Center>
                                                                            )}
                                                                        </Box>
                                                                        <Box textAlign="left" px={3} maxHeight={["29vw", "120px", ""]} overflow="auto">
                                                                            {/* <Text id={"id" + i} key={"id" + i}>ID: {x.id}</Text> */}
                                                                            <Text id={"title" + i} key={"title" + i} fontWeight="500" textTransform="capitalize" fontSize="sm">{x.attributes.title}</Text>
                                                                            <Text id={"category" + i} key={"category" + i} color={grayText} textTransform="capitalize" fontSize="xs">{x.attributes.category} {x.attributes.subCategory ? <Text as="span">&bull;</Text> : ""} {x.attributes.subCategory}</Text>
                                                                            <Text id={"rate" + i} key={"rate" + i} color="primary.500" textTransform="capitalize" fontSize="xl" fontWeight="500"><Text as="span" fontSize="md">$</Text>{x.attributes.rate}<Text as="span" fontSize="xs" color={grayText}> USD/hr.</Text></Text>
                                                                        </Box>
                                                                    </Flex>
                                                                )
                                                            })
                                                        ) : (
                                                            <Center minHeight="200px" >
                                                                <Stack role="button" onClick={() => { document.getElementById("main-search").focus(); document.getElementById("main-search-group").classList.add("focusSearch"); setTimeout(() => { document.getElementById("main-search-group").classList.remove("focusSearch") }, 1000) }}>
                                                                    <Center mb={2}><Icon as={FaI.FaHeartBroken} fontSize="30px" color="secondary.300" /></Center>
                                                                    <Text >You do not have any favourite services.</Text>
                                                                    <Text >Please use the <Text as="span" color="primary.500" fontWeight="600">Search Bar</Text> above to find a service.</Text>
                                                                </Stack>
                                                            </Center>
                                                        )}
                                                    </>
                                                )}
                                            </Stack>
                                        </Box>
                                    </TabPanel>

                                    <TabPanel align="start" borderBottomRadius="lg" borderTopRightRadius="lg" p={["0", "", "", ""]} >
                                        <Box align="center">
                                            <Stack spacing="3">
                                                {siteIsLoading2 ? (
                                                    <YouWhoLoading />
                                                ) : (
                                                    <>
                                                        {(bookedServices.length > 0 && bookedServices2.length > 0 && bookedServices) ? (
                                                            bookedServices.map((x, i) => {
                                                                return (
                                                                    <Flex role="button" onClick={() => { setSelectedService(x); setBookedService2(bookedServices2[i].attributes.booking); history.push(`/activity/you/booked/${bookedServices2[i].attributes.booking.id}`); window.scrollTo(0, 0); }} id={x.id} key={"Box" + i} bg="gray.5" borderRadius="md" overflow="hidden" align="center">
                                                                        <Box id={"flex1" + i} key={"flex1" + i} minWidth={["29vw", "120px", ""]} minHeight={["29vw", "120px", ""]} >
                                                                            {x.attributes.service_img1 ? (
                                                                                <Image id={"img1" + i} key={"img1" + i} w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} objectFit="cover" src={x.attributes.service_img1._url} fallback={<Center w={["29vw", "120px", ""]} h={["29vw", "120px", ""]}><Spinner /></Center>} borderLeftRadius="md" />
                                                                            ) : (
                                                                                <Center filter="grayscale(1)" bg="gray.5" key={"logo" + i} w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} >
                                                                                    <YouWhoLogo opacity="0.2" wdth={["68%", "", ""]} />
                                                                                </Center>
                                                                            )}
                                                                        </Box>
                                                                        <Box textAlign="left" px={3} maxHeight={["29vw", "120px", ""]} overflow="auto">
                                                                            <Text id={"title" + i} key={"title" + i} fontWeight="500" textTransform="capitalize" fontSize="sm">{x.attributes.title}</Text>
                                                                            <Text id={"category" + i} key={"category" + i} color={grayText} textTransform="capitalize" fontSize="xs">{bookedServices2[i].attributes.booking.id}</Text>
                                                                            {bookedServices2[i].attributes.approval === "paid" ?
                                                                                <Text id={"rate" + i} key={"rate" + i} color="green.400" textTransform="capitalize" fontSize="xl" fontWeight="500">PAID</Text>
                                                                                :
                                                                                bookedServices2[i].attributes.approval === "approved" ?
                                                                                    <Text id={"rate" + i} key={"rate" + i} color="primary.500" textTransform="capitalize" fontSize="xl" fontWeight="500">APPROVED</Text>
                                                                                    :
                                                                                    bookedServices2[i].attributes.approval === "declined" ?
                                                                                        <Text id={"rate" + i} key={"rate" + i} color="crimson" textTransform="capitalize" fontSize="xl" fontWeight="500">DECLINED</Text>
                                                                                        :
                                                                                        <Text id={"rate" + i} key={"rate" + i} color="primary.500" textTransform="capitalize" fontSize="xl" fontWeight="500"><Text as="span" fontSize="md">$</Text>{x.attributes.rate}<Text as="span" fontSize="xs" color={grayText}> USD/hr.</Text></Text>
                                                                            }

                                                                        </Box>
                                                                    </Flex>
                                                                )
                                                            })
                                                        ) : (
                                                            <Center minHeight="200px" >
                                                                <Stack role="button" onClick={() => { document.getElementById("main-search").focus(); document.getElementById("main-search-group").classList.add("focusSearch"); setTimeout(() => { document.getElementById("main-search-group").classList.remove("focusSearch") }, 1000) }}>
                                                                    <Center mb={2}><Icon as={HiI.HiOutlineUserAdd} fontSize="30px" color="secondary.300" /></Center>
                                                                    <Text >You have not booked any services.</Text>
                                                                    <Text >Please use the <Text as="span" color="primary.500" fontWeight="600">Search Bar</Text> above to find a service.</Text>
                                                                </Stack>
                                                            </Center>
                                                        )}
                                                    </>
                                                )}
                                            </Stack>
                                        </Box>
                                    </TabPanel>

                                    <TabPanel align="start" borderBottomRadius="lg" borderTopRightRadius="lg" p={["0", "", "", ""]}>
                                        <Box align="center">
                                            <Stack spacing="3">
                                                {siteIsLoading2 ? (
                                                    <YouWhoLoading />
                                                ) : (
                                                    <>
                                                        {viewedServices.length > 0 ? (
                                                            viewedServices.map((x, i) => {
                                                                return (
                                                                    <Flex role="button" onClick={() => { setSelectedService(x); history.push(`/activity/you/viewed/${x.id}`); window.scrollTo(0, 0); }} id={x.id} key={"Box" + i} bg="gray.5" borderRadius="md" overflow="hidden" align="center">
                                                                        <Box id={"flex1" + i} key={"flex1" + i} minWidth={["29vw", "120px", ""]} minHeight={["29vw", "120px", ""]} >
                                                                            {x.attributes.service_img1 ? (
                                                                                <Image id={"img1" + i} key={"img1" + i} w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} objectFit="cover" src={x.attributes.service_img1._url} fallback={<Center w={["29vw", "120px", ""]} h={["29vw", "120px", ""]}><Spinner /></Center>} borderLeftRadius="md" />
                                                                            ) : (
                                                                                <Center filter="grayscale(1)" bg="gray.5" key={"logo" + i} w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} >
                                                                                    <YouWhoLogo opacity="0.2" wdth={["68%", "", ""]} />
                                                                                </Center>
                                                                            )}
                                                                        </Box>
                                                                        <Box textAlign="left" px={3} maxHeight={["29vw", "120px", ""]} overflow="auto">
                                                                            {/* <Text id={"id" + i} key={"id" + i}>ID: {x.id}</Text> */}
                                                                            <Text id={"title" + i} key={"title" + i} fontWeight="500" textTransform="capitalize" fontSize="sm">{x.attributes.title}</Text>
                                                                            <Text id={"category" + i} key={"category" + i} color={grayText} textTransform="capitalize" fontSize="xs">{x.attributes.category} {x.attributes.subCategory ? <Text as="span">&bull;</Text> : ""} {x.attributes.subCategory}</Text>
                                                                            <Text id={"rate" + i} key={"rate" + i} color="primary.500" textTransform="capitalize" fontSize="xl" fontWeight="500"><Text as="span" fontSize="md">$</Text>{x.attributes.rate}<Text as="span" fontSize="xs" color={grayText}> USD/hr.</Text></Text>
                                                                        </Box>
                                                                    </Flex>
                                                                )
                                                            })
                                                        ) : (
                                                            <Center minHeight="200px" >
                                                                <Stack role="button" onClick={() => { document.getElementById("main-search").focus(); document.getElementById("main-search-group").classList.add("focusSearch"); setTimeout(() => { document.getElementById("main-search-group").classList.remove("focusSearch") }, 1000) }}>
                                                                    <Center mb={2}><Icon as={HiI.HiOutlineCursorClick} fontSize="30px" color="secondary.300" /></Center>
                                                                    <Text >You have not viewed any services.</Text>
                                                                    <Text >Please use the <Text as="span" color="primary.500" fontWeight="600">Search Bar</Text> above to find a service.</Text>
                                                                </Stack>
                                                            </Center>
                                                        )}
                                                    </>
                                                )}
                                            </Stack>
                                        </Box>
                                    </TabPanel>

                                </TabPanels>
                            </Tabs>

                            :

                            <Tabs isFitted variant="enclosed" defaultIndex={0}>

                                <TabList borderBottom="1px" borderColor="gray.10" mb={3}>
                                    <Tab px={1} color="secondary.200" _selected={{ fontWeight: "500", color: "secondary.500", bg: "secondary.100", borderTopRadius: "lg", }} onClick={() => history.push("/activity/you/viewed")}>{viewedServices.length > 0 ? viewedServices.length : "0"} viewed</Tab>
                                    <Tab px={1} visibility="hidden" ></Tab>
                                    <Tab px={1} visibility="hidden" ></Tab>
                                </TabList>

                                <TabPanels >

                                    <TabPanel align="start" borderBottomRadius="lg" borderTopRightRadius="lg" p={["0", "", "", ""]}>
                                        <Box align="center">
                                            <Stack spacing="3">
                                                {siteIsLoading2 ? (
                                                    <YouWhoLoading />
                                                ) : (
                                                    <>
                                                        {viewedServices.length > 0 ? (
                                                            viewedServices.map((x, i) => {
                                                                return (
                                                                    <Flex role="button" onClick={() => { setSelectedService(x); history.push(`/search/view/${x.id}`); window.scrollTo(0, 0); }} id={x.id} key={"Box" + i} bg="gray.5" borderRadius="md" overflow="hidden" align="center">
                                                                        <Box id={"flex1" + i} key={"flex1" + i} minWidth={["29vw", "120px", ""]} minHeight={["29vw", "120px", ""]} >
                                                                            {x.attributes.service_img1 ? (
                                                                                <Image id={"img1" + i} key={"img1" + i} w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} objectFit="cover" src={x.attributes.service_img1._url} fallback={<Center w={["29vw", "120px", ""]} h={["29vw", "120px", ""]}><Spinner /></Center>} borderLeftRadius="md" />
                                                                            ) : (
                                                                                <Center filter="grayscale(1)" bg="gray.5" key={"logo" + i} w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} >
                                                                                    <YouWhoLogo opacity="0.2" wdth={["68%", "", ""]} />
                                                                                </Center>
                                                                            )}
                                                                        </Box>
                                                                        <Box textAlign="left" px={3} maxHeight={["29vw", "120px", ""]} overflow="auto">
                                                                            {/* <Text id={"id" + i} key={"id" + i}>ID: {x.id}</Text> */}
                                                                            <Text id={"title" + i} key={"title" + i} fontWeight="500" textTransform="capitalize" fontSize="sm">{x.attributes.title}</Text>
                                                                            <Text id={"category" + i} key={"category" + i} color={grayText} textTransform="capitalize" fontSize="xs">{x.attributes.category} {x.attributes.subCategory ? <Text as="span">&bull;</Text> : ""} {x.attributes.subCategory}</Text>
                                                                            <Text id={"rate" + i} key={"rate" + i} color="primary.500" textTransform="capitalize" fontSize="xl" fontWeight="500"><Text as="span" fontSize="md">$</Text>{x.attributes.rate}<Text as="span" fontSize="xs" color={grayText}> USD/hr.</Text></Text>
                                                                        </Box>
                                                                    </Flex>
                                                                )
                                                            })
                                                        ) : (
                                                            <Center minHeight="200px" >
                                                                <Stack role="button" onClick={() => { document.getElementById("main-search").focus(); document.getElementById("main-search-group").classList.add("focusSearch"); setTimeout(() => { document.getElementById("main-search-group").classList.remove("focusSearch") }, 1000) }}>
                                                                    <Center mb={2}><Icon as={HiI.HiOutlineCursorClick} fontSize="30px" color="secondary.300" /></Center>
                                                                    <Text >You have not viewed any services.</Text>
                                                                    <Text >Please use the <Text as="span" color="primary.500" fontWeight="600">Search Bar</Text> above to find a service.</Text>
                                                                </Stack>
                                                            </Center>
                                                        )}
                                                    </>
                                                )}
                                            </Stack>
                                        </Box>
                                    </TabPanel>

                                    <TabPanel align="start" borderBottomRadius="lg" borderTopRightRadius="lg" p={["0", "", "", ""]} >
                                    </TabPanel>

                                    <TabPanel align="start" borderBottomRadius="lg" borderTopRightRadius="lg" p={["0", "", "", ""]} >
                                    </TabPanel>

                                </TabPanels>
                            </Tabs>
                        }
                    </>
            }
        </>
    )
}


