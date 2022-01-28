import React, { useContext, useEffect, useState } from 'react';
import { Text, Center, Stack, Spinner, Box, Flex, IconButton, Spacer, Button, useDisclosure, Icon, Image, Container, AspectRatio, useToast, useColorMode, Avatar, ModalFooter, ModalHeader, ModalCloseButton, ModalBody, Modal, ModalOverlay, ModalContent, FormControl, FormLabel, FormHelperText, Input, FormErrorMessage } from "@chakra-ui/react";
import { useHistory, useParams } from 'react-router-dom';
import { SiteStateContext } from "../context/SiteStateContext";
import { useMoralis } from "react-moralis";
import Slider from "react-slick";
import Header from '../header/Header';
import ErrorDialog from '../error/ErrorDialog';
import ModalLogin from '../login/ModalLogin';
import Lightbox from "react-awesome-lightbox";
import YouWhoLogo from "../../media/logo/YouWhoLogo.jsx";
import YouWhoLoading from '../misc/YouWhoLoading';
import ViewTimeDay from '../misc/ViewTimeDay';
import BookingTimeDayPicker from '../misc/BookingTimeDayPicker';
import ViewMap from "../map/ViewMap";
import Rating from "../rating/Rating";
import ProviderRating from "../rating/ProviderRating";
import * as Io5 from "react-icons/io5";
import * as FaI from "react-icons/fa";
import * as HiI from "react-icons/hi";
import * as BiI from "react-icons/bi";
// import * as MdI from "react-icons/md";



export default function ViewService({ viewService, setViewService, myFavourites, setMyFavourites, setReloadPage }) {

    const { user, Moralis, setUserData, web3 } = useMoralis();
    const { siteIsLoading, setSiteIsLoading, siteIsLoading2, setSiteIsLoading2, selectedTimezone, siteIsLoading3, setSiteIsLoading3 } = useContext(SiteStateContext);
    const { colorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { id: serviceId } = useParams();
    const [provider, setProvider] = useState("");
    const [providerId, setProviderId] = useState("");
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
    const [bookingDayTime, setBookingDayTime] = useState([{ day: "", from: "", adjFrom: 0, to: "", adjTo: 0 }]);
    const [bookingDescription, setBookingDescription] = useState("");
    const [imagesArray, setImagesArray] = useState([]);
    const [lightboxArray, setLightboxArray] = useState([]);
    const [showLightbox, setShowLightbox] = useState(false);
    const [newServiceError, setNewServiceError] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [bookSuccess, setBookSuccess] = useState(false);
    const [newBooking, setNewBooking] = useState("");
    const toast = useToast();
    const history = useHistory();

    useEffect(() => {

        setSiteIsLoading2(true);


        if (!viewService) {

            (async () => {

                // const resultx = await Moralis.Cloud.run("getViewService", {serviceId});
                // console.log("RESULT CLOUD", resultx)

                let Services = Moralis.Object.extend("Services");
                const query = new Moralis.Query(Services);
                query.equalTo("objectId", serviceId);
                query.include("providerPublic");

                await query.first()
                    .then((result) => {
                        // let result=results[0]
                        // console.log("result",result)
                        if (result) {
                            setViewService(result);

                            setProvider(result.attributes.providerPublic);
                            setCategory(result.attributes.category);
                            setSubCategory(result.attributes.subCategory);
                            setTitle(result.attributes.title);
                            setRating(result.attributes.rating);
                            setReviewCount(result.attributes.reviewCount);
                            setRate(result.attributes.rate);
                            setDescription(result.attributes.description);
                            setServiceLocationChoice(result.attributes.serviceLocationChoice);
                            setMyLat(result.attributes.myLat);
                            setMyLong(result.attributes.myLong);
                            setDayTime(result.attributes.dayTime);
                            setImagesArray([result.attributes.service_img1, result.attributes.service_img2, result.attributes.service_img3, result.attributes.service_img4, result.attributes.service_img5, result.attributes.service_img6]);

                            let imgArr = [result.attributes.service_img1, result.attributes.service_img2, result.attributes.service_img3, result.attributes.service_img4, result.attributes.service_img5, result.attributes.service_img6];
                            let lbArr = [];
                            for (let i = 0; i < imgArr.length; i++) {
                                if (imgArr[i]) {
                                    lbArr.push({ url: imgArr[i]._url, title: i < 3 ? `Service Image ${i + 1}` : `Service Certificate ${i - 2}` });
                                }
                            }
                            setLightboxArray(lbArr);

                            setSiteIsLoading2(false);
                        }
                    })
                    .catch((error) => {
                        setNewServiceError(["Service Not Found", error.message]);
                        setShowAlert(true);
                        setSiteIsLoading2(false);
                    });
            })();

        } else {

            try {
                setProvider(viewService.attributes.providerPublic);
                setCategory(viewService.attributes.category);
                setSubCategory(viewService.attributes.subCategory);
                setTitle(viewService.attributes.title);
                setRate(viewService.attributes.rate);
                setRating(viewService.attributes.rating);
                setReviewCount(viewService.attributes.reviewCount);
                setDescription(viewService.attributes.description);
                setServiceLocationChoice(viewService.attributes.serviceLocationChoice);
                setMyLat(viewService.attributes.myLat);
                setMyLong(viewService.attributes.myLong);
                setDayTime(viewService.attributes.dayTime);
                setImagesArray([viewService.attributes.service_img1, viewService.attributes.service_img2, viewService.attributes.service_img3, viewService.attributes.service_img4, viewService.attributes.service_img5, viewService.attributes.service_img6]);

                let imgArr = [viewService.attributes.service_img1, viewService.attributes.service_img2, viewService.attributes.service_img3, viewService.attributes.service_img4, viewService.attributes.service_img5, viewService.attributes.service_img6];
                let lbArr = [];
                for (let i = 0; i < imgArr.length; i++) {
                    if (imgArr[i]) {
                        lbArr.push({ url: imgArr[i]._url, title: i < 3 ? `Service Image ${i + 1}` : `Service Certificate ${i - 2}` });
                    }
                }
                setLightboxArray(lbArr);
                setSiteIsLoading2(false);
            } catch (error) {
                setNewServiceError(["Service Not Found", error.message]);
                setShowAlert(true);
                setSiteIsLoading2(false);
            }

        }
        window.scrollTo(0, 0);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (user) {
            (async () => {
                await setUserData({
                    myFavourites
                });
            })();
        }
    }, [myFavourites])


    useEffect(() => {
        if (document.getElementById("description") && description !== "") {
            document.getElementById("description").innerHTML = description;
        }
    }, [description, document.getElementById("description")])

    const handleFavourites = () => {
        if (user) {
            let favArr = myFavourites.slice();

            if (favArr.indexOf(serviceId) <= -1) {
                favArr.unshift(serviceId)
            } else {
                favArr.splice(favArr.indexOf(serviceId), 1);
            }
            setMyFavourites(favArr);
        }

        if (myFavourites.indexOf(serviceId) > -1) {
            document.getElementById("toggleFav").classList.remove("toggleFavRed");
            document.getElementById("toggleFav").classList.add("toggleFavGray");
        } else {
            document.getElementById("toggleFav").classList.remove("toggleFavGray");
            document.getElementById("toggleFav").classList.add("toggleFavRed");
        }
        // setTimeout(() => { document.getElementById("toggleFav").classList.remove("toggleFav") }, 2000);
    };

    let padRight = (str) => {
        let newStr = str;
        while (newStr.length < 66) {
            newStr += "0"
        }
        return newStr
    }

    const handleBookService = () => {


        (async () => {
            setSiteIsLoading3(true);

            const NewBooking = Moralis.Object.extend("Bookings");
            const acl = new Moralis.ACL();
            acl.setPublicReadAccess(true);
            // acl.setReadAccess(provider.id, true);
            acl.setWriteAccess(user.id, true);

            const booking = new NewBooking();
            booking.setACL(acl);
            booking.set('service', viewService);
            booking.set('user', user);
            booking.set('userPublic', user.attributes.userPublic);
            booking.set('provider', provider);
            booking.set('bookingDayTime', bookingDayTime);
            booking.set('bookingDescription', bookingDescription)


            await booking.save().then(async (booking) => {
                // Execute any logic that should take place after the object is saved.

                const userRelation = user.relation("userBookings");
                userRelation.add(booking);
                await user.save();

                let bookingBytes32 = web3.utils.asciiToHex(booking.id);
                let bookingBytes32Padded = padRight(bookingBytes32);

                booking.set('bookingBytes32', bookingBytes32Padded);

                await booking.save().then(async (booking) => {

                    const bookingPointer = booking;

                    const BookingsPublic = Moralis.Object.extend("BookingsPublic");
                    let query = new Moralis.Query(BookingsPublic);
                    query.equalTo("booking", booking);
                    let bookingPublic = await query.first();
                    bookingPublic.set("bookingBytes32", bookingBytes32Padded);
                    await bookingPublic.save().then(async (bookingPublic) => {

                        bookingPublic.attributes.booking.set('bookingPublic', bookingPublic);
                        await bookingPublic.attributes.booking.save().then(async (booking) => {



                            const NewChat = Moralis.Object.extend("Chats");
                            const acl = new Moralis.ACL();
                            acl.setPublicReadAccess(true);
                            // acl.setReadAccess(provider.id, true);
                            acl.setWriteAccess(user.id, true);

                            const chat = new NewChat();
                            chat.setACL(acl);
                            chat.set('service', viewService);
                            chat.set('user', user);
                            chat.set('userPublic', user.attributes.userPublic);
                            chat.set('provider', provider);
                            chat.set('booking', booking);
                            chat.set('bookingId', booking.id);
                            chat.set('messages', [{ time: Date.now(), from: "user", message: "Hi, I have just booked your service. Can you please review and approve my booking? Thank you." }]);
                            chat.set('userRead', true);
                            chat.set('providerRead', false);

                            await chat.save().then(async (chat) => {

                                setNewBooking(booking);
                                setSiteIsLoading3(false);
                                setBookSuccess(true);
                            });

                        });

                    });


                });
                // window.scrollTo(0, 0);
                // window.location.reload();
                // setSiteIsLoading(false);

            }, (error) => {
                // Execute any logic that should take place if the save fails.
                // error is a Moralis.Error with an error code and message.
                setSiteIsLoading3(false);
                setBookSuccess(false);
                setNewServiceError(["Error Booking Service!", error.message]);
                setShowAlert(true);
            });

        })();

    };



    var sliderSettings = {
        dots: true,
        arrows: false,
        infinite: true,
        autoplay: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        className: "viewServiceCarousel"
    };

    const buttonBg = colorMode !== "light" ? "gray.700" : "white";
    const slideTextBg = colorMode !== "light" ? "gray.900" : "white";
    const grayText = colorMode === "light" ? "gray.500" : "gray.400";
    // const grayText2 = colorMode === "light" ? "gray.600" : "gray.100";

    if (true) {
        return (
            <>
                <Box display={["none", "block", "", ""]} position="relative" zIndex="2">
                    <Header bgSearch={[colorMode === "light" ? "gray.50" : "gray.900", "none", "", ""]} />
                </Box>
                <Box p={[0, 4, 6, 8]} minHeight="100%">
                    <Container minHeight={["91vh", "200px", "", ""]} maxW="lg" overflow="hidden" borderRadius={["0", "xl", "", ""]} px={[0, "", "", ""]} pb={["70px", "0px", "", ""]} pt={[0, "", "", ""]} mb={["0px", "50px", "", ""]} > {/* pt={[4, 6, "", ""]} */}


                        {showAlert && (<ErrorDialog title={newServiceError[0]} message={newServiceError[1]} showAlert={showAlert} setShowAlert={setShowAlert} />)}
                        {siteIsLoading2 ? (
                            <YouWhoLoading />
                        ) : (
                            <>
                                <Stack spacing="6">

                                    <Box position="relative" borderTopRadius={[0, "xl", "", ""]} overflow="hidden">
                                        <Flex pt={4} px={4} align="center" top="0px" position="absolute" zIndex="1" w="100%">
                                            <IconButton icon={<Io5.IoArrowBack />} size="sm" color={colorMode === "light" ? "gray.700" : "white"} bg={buttonBg} _hover={{ bg: buttonBg }} _focus={{ bg: buttonBg }} _active={{ bg: buttonBg }} className="bgBlur" borderRadius="full" fontSize="24px" onClick={() => { history.goBack(); }} />
                                            <Spacer />
                                            <IconButton icon={<Io5.IoShareSocial />} pr="4px" pb="1px" size="sm" color={colorMode === "light" ? "gray.700" : "white"} bg={buttonBg} _hover={{ bg: buttonBg }} _focus={{ bg: buttonBg }} _active={{ bg: buttonBg }} className="bgBlur" borderRadius="full" fontSize="21px"
                                                onClick={() => {
                                                    var aux = document.createElement("input");
                                                    aux.setAttribute("value", `https://servedemo.youwho.io/search/view/${serviceId}`);
                                                    document.body.appendChild(aux);
                                                    aux.select();
                                                    document.execCommand("copy");
                                                    document.body.removeChild(aux);
                                                    toast({
                                                        title: "Link copied.",
                                                        description: `Share link: https://servedemo.youwho.io/search/view/${serviceId} has been copied to your clipboard.`,
                                                        status: "info",
                                                        duration: 4000,
                                                        isClosable: true,
                                                        render: () => (
                                                            <Box w={["94vw", "512px", "", ""]} position="fixed" bottom="0" left="50%" p={4} pb={5} ml={["-47vw", "-251px", "", ""]} color="primary.600" bg="primary.100" borderTopRadius="lg">
                                                                Share link:<br /><b>https://servedemo.youwho.io/search/view/{serviceId}</b><br />has been copied to your clipboard.
                                                            </Box>
                                                        ),
                                                    });
                                                }} />
                                            {user &&
                                                <Box id="toggleFav" ml={3} borderRadius="full">
                                                    <IconButton icon={<Io5.IoHeartSharp />} size="sm" color={myFavourites.indexOf(serviceId) > -1 ? "red.300" : (colorMode === "light" ? "gray.700" : "white")} bg={buttonBg} _hover={{ bg: buttonBg }} _focus={{ bg: buttonBg }} _active={{ bg: buttonBg }} className="bgBlur" borderRadius="full" fontSize="18px" onClick={() => handleFavourites()} />
                                                </Box>
                                            }
                                        </Flex>

                                        <Box maxHeight="384px">
                                            <Slider {...sliderSettings}>

                                                {imagesArray[0] ?
                                                    <Box role="button" onClick={() => setShowLightbox(true)}>
                                                        <AspectRatio ratio={4 / 3} objectFit="cover">
                                                            <Image id={`serviceImage1`} src={imagesArray[0] ? imagesArray[0]._url : ""} fallback={<Box h="20px" w="20px"><Spinner color="primary.200" /></Box>} alt={`Service Image 1`} />
                                                        </AspectRatio>
                                                    </Box>
                                                    :
                                                    <Center filter="grayscale(1)" bg="gray.5" >
                                                        <AspectRatio ratio={4 / 3} objectFit="cover">
                                                            <Box w="100%">
                                                                <YouWhoLogo opacity="0.1" wdth={["40%", "", ""]} />
                                                            </Box>
                                                        </AspectRatio>
                                                    </Center>
                                                }

                                                {imagesArray[1] &&
                                                    <Box role="button" onClick={() => setShowLightbox(true)}>
                                                        <AspectRatio ratio={4 / 3} objectFit="cover">
                                                            <Image id={`serviceImage2`} src={imagesArray[1] ? imagesArray[1]._url : ""} fallback={<Box h="20px" w="20px"><Spinner color="primary.200" /></Box>} alt={`Service Image 2`} />
                                                        </AspectRatio>
                                                    </Box>
                                                }

                                                {imagesArray[2] &&
                                                    <Box role="button" onClick={() => setShowLightbox(true)}>
                                                        <AspectRatio ratio={4 / 3} objectFit="cover">
                                                            <Image id={`serviceImage3`} src={imagesArray[2] ? imagesArray[2]._url : ""} fallback={<Box h="20px" w="20px"><Spinner color="primary.200" /></Box>} alt={`Service Image 3`} />
                                                        </AspectRatio>
                                                    </Box>
                                                }

                                            </Slider>
                                        </Box>
                                    </Box>

                                    <Stack px={6} spacing="6">

                                        <Box borderBottom="1px" pb={5} borderColor="gray.10" >
                                            <Text fontSize="2xl" fontWeight="500">{title}</Text>
                                            <Rating rating={rating} reviewCount={reviewCount} />
                                            <Text fontSize="sm" color="gray.500">{category} {subCategory ? <>&bull; {subCategory}</> : ""}</Text>
                                        </Box>

                                        {description !== "" &&
                                            <Box borderBottom="1px" pb={5} borderColor="gray.10" >
                                                <Text fontWeight="300" color={grayText} mb={1}>Information relating to service</Text>
                                                <Text id="description"></Text>
                                            </Box>
                                        }

                                        {provider &&
                                            <Box borderBottom="1px" pb={5} borderColor="gray.10" >
                                                <Flex>
                                                    <Box>
                                                        <Text fontWeight="300" color={grayText}>Service provided by</Text>
                                                        <Text fontSize="xl" fontWeight="500">{provider.attributes.username}</Text>
                                                        <ProviderRating rating={provider.attributes.providerRating} reviewCount={provider.attributes.providerReviewCount} />
                                                        <Flex align="center" mt={1}>
                                                            <Icon w={6} h={6} ml="1px" as={FaI.FaUserShield} color={provider.attributes.providerVerified ? "primary.600" : "gray.500"} />
                                                            <Text ml="6px" color="gray.500" fontSize="sm">{provider.attributes.providerVerified ? "Provider verified" : "Provider unverified"}</Text>
                                                        </Flex>
                                                    </Box>
                                                    <Spacer />
                                                    <Center mr={4}>
                                                        <Avatar size="xl" name={provider.attributes.username} src={provider.attributes.profile_photo ? provider.attributes.profile_photo._url : ""} />
                                                    </Center>
                                                </Flex>
                                            </Box>
                                        }

                                        <Box borderBottom="1px" pb={5} borderColor="gray.10">
                                            <Flex>
                                                <Box>
                                                    <Text fontWeight="300" color={grayText}>Availability <Text as="span" fontSize="sm">{selectedTimezone && selectedTimezone.offset ? <>({selectedTimezone.offset < 0 ? "-" : "+"}{selectedTimezone.offset} UTC 24hr)</> : ""}</Text></Text>
                                                    <ViewTimeDay dayTime={dayTime} />
                                                    <Text fontSize="xs" as="i" fontWeight="200">(-)Negative or (+)positive times indicate the day before or after the day shown.</Text>
                                                </Box>
                                            </Flex>
                                        </Box>

                                        <Box borderBottom="1px" pb={5} borderColor="gray.10">
                                            <Flex>
                                                <Box>
                                                    <Text fontWeight="300" color={grayText}>Service Location</Text>
                                                    <Text>
                                                        {serviceLocationChoice === "users" ?
                                                            <>
                                                                I am able to provide my service at your location.
                                                            </>
                                                            :
                                                            serviceLocationChoice === "both" ?
                                                                <>
                                                                    I am able to provide my service at your location or mine.
                                                                </>
                                                                :
                                                                serviceLocationChoice === "mine" ?
                                                                    <>
                                                                        I am only able to provide my service my location.
                                                                    </>
                                                                    :
                                                                    <>
                                                                        I am able to provide my service worldwide.
                                                                    </>
                                                        }
                                                    </Text>
                                                </Box>
                                            </Flex>
                                        </Box>

                                    </Stack>

                                    <Box>

                                        {serviceLocationChoice !== "global" &&
                                            <>
                                                <Box pb={3} px={6} >
                                                    <Flex>
                                                        <Box>
                                                            <Text fontWeight="300" color={grayText}>Service Providers Location</Text>
                                                        </Box>
                                                    </Flex>
                                                </Box>

                                                <ViewMap myLat={myLat} myLong={myLong} />
                                            </>
                                        }

                                        {imagesArray[3] &&
                                            <Box maxHeight="384px" position="relative">
                                                <Box p={2} position="absolute" zIndex="2" >
                                                    <Text fontWeight="300" py={2} px={4} borderRadius="md" bg={slideTextBg} className="bgBlur">
                                                        Certificates and Licenses related to Service
                                                    </Text>
                                                </Box>
                                                <Slider {...sliderSettings}>


                                                    <Box role="button" onClick={() => setShowLightbox(true)}>
                                                        <AspectRatio ratio={4 / 3} objectFit="cover">
                                                            <Image id={`serviceCert1`} src={imagesArray[3] ? imagesArray[3]._url : ""} fallback={<Box h="20px" w="20px"><Spinner color="primary.200" /></Box>} alt={`Service Certificate 1`} />
                                                        </AspectRatio>
                                                    </Box>

                                                    {imagesArray[4] &&
                                                        <Box role="button" onClick={() => setShowLightbox(true)}>
                                                            <AspectRatio ratio={4 / 3} objectFit="cover">
                                                                <Image id={`serviceCert2`} src={imagesArray[4] ? imagesArray[4]._url : ""} fallback={<Box h="20px" w="20px"><Spinner color="primary.200" /></Box>} alt={`Service Certificate 2`} />
                                                            </AspectRatio>
                                                        </Box>
                                                    }

                                                    {imagesArray[5] &&
                                                        <Box role="button" onClick={() => setShowLightbox(true)}>
                                                            <AspectRatio ratio={4 / 3} objectFit="cover">
                                                                <Image id={`serviceCert3`} src={imagesArray[5] ? imagesArray[5]._url : ""} fallback={<Box h="20px" w="20px"><Spinner color="primary.200" /></Box>} alt={`Service Certificate 3`} />
                                                            </AspectRatio>
                                                        </Box>
                                                    }

                                                </Slider>
                                            </Box>
                                        }

                                    </Box>
                                </Stack>
                                <Container maxW="md">
                                    <Flex justify="space-between" w={["100vw", "512px", "", ""]} className="bgBlur" color="gray.500" minHeight="71px" pos="fixed" bottom="0" left="50%" zIndex={2} p={4} ml={["-50vw", "-251px", "", ""]} borderTopRadius={["0", "xl", "", ""]}>
                                        <Flex w="100%" justify="space-between" align="center">
                                            {!user ?
                                                <>
                                                    <Center w="100%">
                                                        <Button w="70%" color="secondary.500" bg="secondary.100" _hover={{ bg: "secondary.200" }} onClick={onOpen}>Sign in to Book Service</Button>
                                                        <ModalLogin isOpen={isOpen} onClose={onClose} />
                                                    </Center>
                                                </>
                                                :
                                                <>
                                                    {provider.id !== user.attributes.userPublic.id ?
                                                        <>
                                                            <Box px={2}>
                                                                <Text color="primary.500" lineHeight="13px" fontSize="2xl" fontWeight="600"><Text as="span" fontSize="lg">$</Text>{rate ? rate.toFixed(2) : ""}<Text as="span" fontSize="sm" fontWeight="500" color={grayText}> USD/hr. </Text></Text>
                                                            </Box>
                                                            <Spacer />
                                                            <SelectDayTime handleBookService={handleBookService} siteIsLoading3={siteIsLoading3} bookSuccess={bookSuccess} newBooking={newBooking} providerName={provider ? provider.attributes.username : ""} provider={provider ? provider : ""} user={user} grayText={grayText} dayTime={dayTime} selectedTimezone={selectedTimezone} bookingDayTime={bookingDayTime} setBookingDayTime={setBookingDayTime} bookingDescription={bookingDescription} setBookingDescription={setBookingDescription} setReloadPage={setReloadPage} />
                                                        </>
                                                        :
                                                        <>
                                                            <Center px={2} w="100%">
                                                                <Button w="80%" color="secondary.500" bg="secondary.100" _hover={{ bg: "secondary.200" }} _focus={{ bg: "secondary.100" }} _active={{ bg: "secondary.100" }} onClick={() => history.push(`/activity/who/myservices/${serviceId}`)}>Edit My Service</Button>
                                                            </Center>
                                                        </>
                                                    }
                                                </>
                                            }
                                        </Flex>
                                    </Flex>
                                </Container>

                                {showLightbox &&
                                    (lightboxArray.length === 1 ?
                                        <Lightbox image={lightboxArray[0].url} title={lightboxArray[0].title} onClose={() => setShowLightbox(false)} />
                                        :
                                        <Lightbox images={lightboxArray} onClose={() => setShowLightbox(false)} />
                                    )
                                }

                            </>
                        )}
                    </Container>
                </Box>
            </>
        )
    }

    return (
        <>
            {siteIsLoading2 ? (
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

function SelectDayTime({ handleBookService, siteIsLoading3, bookSuccess, user, setNewBooking, newBooking, providerName, provider, bookingDayTime, setBookingDayTime, grayText, dayTime, selectedTimezone, bookingDescription, setBookingDescription, setReloadPage }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode } = useColorMode();
    const history = useHistory();
    const [confirmBooking, setConfirmBooking] = useState(false);

    return (
        <>
            <Button minWidth="50%" color="secondary.500" bg="secondary.100" _hover={{ bg: "secondary.200" }} _focus={{ bg: "secondary.100" }} _active={{ bg: "secondary.100" }} borderRadius="md" onClick={onOpen} isDisabled={provider.id === user.attributes.userPublic.id} ><Icon as={FaI.FaRegCalendarAlt} mr={2} mb="2px" fontSize="18px"></Icon>Select Day & Time</Button>

            <Modal isOpen={isOpen} size="lg" onClose={bookSuccess ? () => { onClose(); window.scrollTo(0, 0); window.location.reload(); } : () => { onClose(); }} >
                <ModalOverlay />
                <ModalContent minHeight="200px" borderRadius="xl" mx={3} mt="10%" bg={colorMode === "light" ? "white" : "gray.900"} overflow="hidden">
                    {bookSuccess ? (
                        <>
                            <ModalHeader py={6} px={["4", "6", "", ""]} fontWeight="400" style={{ display: "flex", alignItems: "center" }}><Icon as={Io5.IoBonfireOutline} color="secondary.300" mr={1} h="24px" w="24px" />Booking Success!</ModalHeader>
                            <ModalCloseButton m={3} onClick={() => { onClose(); window.scrollTo(0, 0); window.location.reload(); }} />
                            <ModalBody px={["4", "6", "", ""]} id="categoryButtons">
                                <Text>Your Booking Number is <Text as="span" color="primary.500" fontWeight="600">{newBooking.id}</Text><br />Please wait for <Text as="span" color="secondary.300" fontWeight="600">{providerName}</Text> to process your booking.<br /><br />Click <Text as="span" color="primary.400" fontWeight="600">OK</Text> to view your booking or close this window to continue browsing services.</Text>
                            </ModalBody>
                            <ModalFooter pb={6} px={6}>
                                <Button colorScheme="primary" onClick={() => { setReloadPage(true); history.push(`/activity/you/booked/${newBooking.id}`) }}>OK</Button>
                            </ModalFooter>
                        </>
                    ) : (
                        <>
                            <ModalHeader px={["4", "6", "", ""]} pt={6} pb={4} fontWeight="400" bg="gray.10"><Icon as={FaI.FaRegCalendarAlt} color="secondary.300" mb="5px" mr={2} h="24px" w="24px" />Select Day & Time
                                <Box pt={2} pb={1} fontSize="md">
                                    <Flex>
                                        <Box>
                                            <Text fontWeight="300" color={grayText}><Text as="span" color="secondary.300" fontWeight="600">{providerName}</Text> is available at the following day and time</Text>
                                            <ViewTimeDay dayTime={dayTime} />
                                            <Text fontSize="xs" as="i" fontWeight="200">(-)Negative or (+)positive times indicate the day before or after the day shown.</Text>
                                        </Box>
                                    </Flex>
                                </Box>

                            </ModalHeader>
                            <ModalCloseButton m={3} onClick={() => { onClose(); }} />
                            <ModalBody px={["4", "6", "", ""]} pt={4}>

                                {siteIsLoading3 ?
                                    <YouWhoLoading />
                                    :
                                    <Stack spacing="3">

                                        <Text fontWeight="300" color={grayText}>Select the Day and Time you would like to book the service, and provide a brief description of your needs.</Text>
                                        <Box pb={5} borderColor="gray.10">
                                            <Text fontWeight="500" color={grayText}><Icon as={BiI.BiCalendarCheck} mb="3px" /> Select Day and Time</Text>
                                            <Flex pt="2">
                                                <Box w="100%">
                                                    <BookingTimeDayPicker disableEdit={false} dayTime={bookingDayTime} setDayTime={setBookingDayTime} />
                                                    <Box pt="4" >
                                                        <Text as="i" color={grayText} fontSize="sm" >Choose days and times that matches the availibity of the service provider otherwise they may reject your booking.</Text>
                                                    </Box>
                                                </Box>
                                            </Flex>
                                        </Box>

                                        <Box pb={0} borderColor="gray.10">
                                            <FormControl id="description" isInvalid={bookingDescription.length > 500 ? true : false}>
                                                <Flex justify="space-between">
                                                    <FormLabel fontWeight="500" color={grayText}><Icon as={BiI.BiNotepad} mb="3px" /> Description</FormLabel>
                                                    <FormHelperText as="i" color={bookingDescription.length > 500 ? "red" : "gray.500"} >{500 - bookingDescription.length} char. remaining.</FormHelperText>
                                                </Flex>
                                                <Input as="textarea" isInvalid={bookingDescription.length > 500 ? true : false} variant="unstyled" minHeight="150px" type="text" value={bookingDescription} overflow="visible" py={1} placeholder="Provide further information regarding the service you require." onChange={(e) => setBookingDescription(e.target.value)} />
                                                <FormErrorMessage>Description too long.</FormErrorMessage>
                                            </FormControl>
                                        </Box>

                                    </Stack>
                                }
                            </ModalBody>
                            <ModalFooter pb={6} px={6} bg="gray.10" >
                                <Stack spacing="3">
                                    <Text>Press Confirm below, to send a booking request to <Text as="span" color="secondary.300" fontWeight="600">{providerName}</Text>.</Text>
                                    <Text as="i" color={grayText} fontSize="sm">Note this does not guarantee you will get the service at your day and time of choosing.</Text>
                                    <Text><Text as="span" color="secondary.300" fontWeight="600">{providerName}</Text> will then either approve your booking, get in touch via <Text as="span" color="teal.300" fontWeight="600">Chat</Text>, and provide a rough estimate on the amount of time required, OR may decline your booking.</Text>
                                    {!confirmBooking ?
                                        <>
                                            <Button colorScheme="primary" isDisabled={bookingDescription.length > 500 ? true : false} onClick={() => setConfirmBooking(true)} mr={2} ><Icon as={HiI.HiOutlineBadgeCheck} mr={1} h="20px" w="20px" /> Confirm?</Button>
                                            <Flex>
                                                <Spacer />
                                                <Button w="40%" onClick={() => { onClose(); }}>Cancel</Button>
                                            </Flex>
                                        </>
                                        :
                                        <>
                                            <Button colorScheme="green" isDisabled={bookingDescription.length > 500 ? true : false} onClick={handleBookService} mr={2} isLoading={siteIsLoading3}><Icon as={HiI.HiOutlineBadgeCheck} mr={1} h="20px" w="20px" /> Yes I Confirm my Booking!</Button>
                                            <Flex>
                                                <Spacer />
                                                <Button w="40%" onClick={() => setConfirmBooking(false)} isLoading={siteIsLoading3}>Cancel</Button>
                                            </Flex>
                                        </>
                                    }
                                </Stack>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
