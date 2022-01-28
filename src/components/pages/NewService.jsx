import React, { useEffect, useState } from 'react';
import { useMoralis } from "react-moralis";
import { Button, Box, Center, Container, Text, Icon, useColorModeValue, Stack, useDisclosure, Flex, Input, Spacer, Spinner, InputGroup, useColorMode, Image, FormControl, FormLabel, FormHelperText, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, InputLeftElement, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Wrap, FormErrorMessage, RadioGroup, Radio, Link, AspectRatio, ModalFooter } from "@chakra-ui/react";
import Header from '../header/Header';
import FootNav from '../footnav/FootNav';
// import ErrorBox from "../error/ErrorBox";
// import SuccessBox from "../error/SuccessBox";
import * as BiI from "react-icons/bi";
import * as HiI from "react-icons/hi";
import * as Io5 from "react-icons/io5";
// import * as AiI from "react-icons/ai";
import * as VsC from "react-icons/vsc";
import ErrorDialog from "../error/ErrorDialog";
import { Link as RouterLink, useHistory } from 'react-router-dom';
import GetLocation from "../map/GetLocation";
import CategoriesModal from '../misc/CategoriesModal';
import NewTimeDayPicker from '../misc/NewTimeDayPicker';



export default function NewService() {

    const { user, Moralis } = useMoralis();
    const { colorMode } = useColorMode();
    const [imageUpload, setImageUpload] = useState([false, false, false, false, false, false]);
    const [imageUploadFile, setImageUploadFile] = useState([]);
    const [imageUploadSrc, setImageUploadSrc] = useState([]);
    const [category, setCategory] = useState("Click to Choose Category");
    const [categoryV, setCategoryV] = useState(false);
    const [subCategory, setSubCategory] = useState("");
    const [title, setTitle] = useState("");
    const [titleV, setTitleV] = useState(false);
    const [description, setDescription] = useState("");
    const [rate, setRate] = useState("");
    const [rateV, setRateV] = useState(false);
    const [serviceLocationChoice, setServiceLocationChoice] = useState("mine");
    const [myLat, setMyLat] = useState("");
    const [myLong, setMyLong] = useState("");
    const [myLocV, setMyLocV] = useState(false);
    const [dayTime, setDayTime] = useState([{ day: "", from: "", adjFrom: 0, to: "", adjTo: 0 }]);
    const [serviceInfo, setServiceInfo] = useState("block");
    const [okToPost, setOkToPost] = useState(true);
    const [okToPreview, setOkToPreview] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [newServiceError, setNewServiceError] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [servicesCounter, setServicesCounter] = useState("");
    const [postSuccess, setPostSuccess] = useState(false);
    const [newService, setNewService] = useState("");

    const history = useHistory();


    const postValidation = () => {
        if (category !== "Click to Choose Category" && category !== "") { setCategoryV(false); setOkToPost(true); setOkToPreview(true) } else { setCategoryV(true); setOkToPost(false); setOkToPreview(false) };
        if (title !== "") { setTitleV(false); setOkToPost(true); setOkToPreview(true) } else { setTitleV(true); setOkToPost(false); setOkToPreview(false) };
        if (rate !== "") { setRateV(false); setOkToPost(true); setOkToPreview(true) } else { setRateV(true); setOkToPost(false); setOkToPreview(false) };
        if (myLat !== "" && myLong !== "") { setMyLocV(false); setOkToPost(true); setOkToPreview(true) } else { setMyLocV(true); setOkToPost(false); setOkToPreview(false) };
        if (category !== "Click to Choose Category" && category !== "" && title !== "" && rate !== "" && myLat !== "" && myLong !== "") { setOkToPost(true); setOkToPreview(true) } else { setOkToPost(false); setOkToPreview(false) };

    }

    const handleImageUpload = async (index) => {
        const fileUploadControl = document.getElementById(`inputImageUpload${index + 1}`);
        if (fileUploadControl.files.length > 0) {
            setIsUploading(true);
            // console.log(fileUploadControl.files[0]);
            if (fileUploadControl.files[0].name.match(/\.(jpg|jpeg|png|gif)$/)) {
                if (fileUploadControl.files[0].size <= 512000) {
                    try {
                        const file = fileUploadControl.files[0];
                        const name = file.name;
                        const metadata = { createdById: "youwho_new_service" };
                        const tags = { groupId: "service_images" };
                        const imgUrl = URL.createObjectURL(file);

                        const arrImageUploadSrc = imageUploadSrc.slice();
                        arrImageUploadSrc[index] = imgUrl;
                        setImageUploadSrc(arrImageUploadSrc);

                        const serviceImage = new Moralis.File(name, file);
                        serviceImage.addMetadata(metadata);
                        serviceImage.addTag(tags);

                        const arrImageUploadFile = imageUploadFile.slice();
                        arrImageUploadFile[index] = serviceImage;
                        setImageUploadFile(arrImageUploadFile);

                        const arrImageUpload = imageUpload.slice();
                        arrImageUpload[index] = true;
                        setImageUpload(arrImageUpload);

                        setIsUploading(false);
                    } catch (error) {
                        setNewServiceError(["Image Upload Error", "Error when trying to upload the image, please reload and try again."]);
                        setShowAlert(true);

                        setIsUploading(false);
                    }
                } else {
                    setNewServiceError(["Image Size Too Large", "Please select an image that is less than or equal to 500kb in size."]);
                    setShowAlert(true);

                    setIsUploading(false);
                }
            } else {
                setNewServiceError(["Wrong Image Type", "Please select select an image of type 'jpg', 'jpeg', 'png', or 'gif'."]);
                setShowAlert(true);

                setIsUploading(false);
            }
        }
        fileUploadControl.value = "";
    }

    const handleRemoveImage = (index) => {
        const fileUploadControl = document.getElementById(`inputImageUpload${index + 1}`);
        fileUploadControl.value = "";

        const arrImageUploadFile = imageUploadFile.slice();
        arrImageUploadFile[index] = undefined;
        setImageUploadFile(arrImageUploadFile);

        const arrImageUploadSrc = imageUploadSrc.slice();
        arrImageUploadSrc[index] = "";
        setImageUploadSrc(arrImageUploadSrc);

        const arrImageUpload = imageUpload.slice();
        arrImageUpload[index] = false;
        setImageUpload(arrImageUpload);
    }


    const defineNewService = async () => {

        setIsUploading(true);
        setPostSuccess(false);

        // console.log("checking services count");
        if (servicesCounter >= 10) {
            // console.log("Too many posts: " + servicesCounter + "/10");
            setOkToPreview(false);
            setIsUploading(false);
        } else {
            // console.log("Post limit not yet reached: " + servicesCounter + "/10");
            const NewService = Moralis.Object.extend("Services");
            const acl = new Moralis.ACL();
            acl.setPublicReadAccess(true);
            acl.setWriteAccess(user.id, true);

            const service = new NewService();
            service.setACL(acl);
            service.set('creator', user.id);
            service.set('provider', user);
            service.set('providerPublic', user.attributes.userPublic);
            service.set('category', category);
            service.set('subCategory', subCategory);
            service.set('title', title);
            service.set('rate', Number(Number(rate).toFixed(2)));
            service.set('description', description);
            service.set('serviceLocationChoice', serviceLocationChoice);
            service.set('myLat', Number(myLat));
            service.set('myLong', Number(myLong));

            let location = new Moralis.GeoPoint(Number(myLat), Number(myLong));
            service.set('location', location);

            service.set('dayTime', dayTime);
            service.set('service_img1', imageUploadFile[0] ? imageUploadFile[0] : undefined);
            service.set('service_img2', imageUploadFile[1] ? imageUploadFile[1] : undefined);
            service.set('service_img3', imageUploadFile[2] ? imageUploadFile[2] : undefined);
            service.set('service_img4', imageUploadFile[3] ? imageUploadFile[3] : undefined);
            service.set('service_img5', imageUploadFile[4] ? imageUploadFile[4] : undefined);
            service.set('service_img6', imageUploadFile[5] ? imageUploadFile[5] : undefined);

            await service.save().then(async (service) => {
                // Execute any logic that should take place after the object is saved.
                setNewService(service);
                setIsUploading(false);
                setPostSuccess(true);
                setOkToPreview(false);

                const relation = user.relation("myServices");
                relation.add(service);
                await user.save();
                // window.scrollTo(0, 0);
                // window.location.reload();

            }, (error) => {
                // Execute any logic that should take place if the save fails.
                // error is a Moralis.Error with an error code and message.
                setIsUploading(false);
                setOkToPreview(false);
                setNewServiceError(["Error Adding New Service!", error.message]);
                setShowAlert(true);
            });

            // setIsUploading(false);
        };
    }

    useEffect(() => {
        (async () => {
            await Moralis.Cloud.run("getMyServicesCount")
                .then((results) => {
                    setServicesCounter(results);
                })
                .catch((error) => {
                    console.error(error);
                });
        })();
        // eslint-disable-next-line
    }, []
    )

    const grayText = colorMode === "light" ? "gray.500" : "gray.400";
    const grayText2 = colorMode === "light" ? "gray.600" : "gray.100";

    const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(249,249,249,0.07) 50%, rgba(249,249,249,0.0) 100%)";

    // const bgGradientLight = "radial-gradient(circle at 30vw 90vh, rgba(0,201,153,0.07) 0%, rgba(249,249,249,0.07) 50%, rgba(249,249,249,0.0) 100%)";

    const bgGradientDark = "radial-gradient(circle at 80vw -30vh, rgba(0,201,153, 0.25) 0%, rgba(13,110,253,0.15) 35%, rgba(19,19,19,0.5) 100%)";
    const bg = useColorModeValue(bgGradientLight, bgGradientDark);

    return (
        <Box w="100%" minH="100vh" minW="100vw" h="100%" p={0} bg={bg} border={0}>
            <Header bgSearch={[colorMode === "light" ? "gray.50" : "gray.900", "none", "", ""]} />
            <Box p={[0, 4, 6, 8]} minHeight="100%">
                <Container minHeight={["91vh", "200px", "200px", "200px"]} maxW="lg" borderRadius={["0", "xl", "xl", "xl"]} px={[4, 6, "", ""]} pb={[4, 6, "", ""]} pt={[1, 5, "", ""]} mb={["60px", "0", "", ""]} >
                    <Stack pb={2} spacing="0" >
                        {showAlert && (<ErrorDialog title={newServiceError[0]} message={newServiceError[1]} showAlert={showAlert} setShowAlert={setShowAlert} />)}
                        {/* <Button onClick={checkMyServicesCount}>count</Button> */}
                        <Text fontWeight="400" fontSize="3xl" ml={1} color={grayText2} style={{ display: "flex", alignItems: "center" }}><Icon as={HiI.HiOutlinePencilAlt} color="secondary.200" mr={2} />Post a New Service</Text>
                        <Text fontWeight="400" color="secondary.200" fontSize="md" px="2">( {servicesCounter ? servicesCounter : "0"} / 10 services max. per account )</Text>
                    </Stack>
                    {servicesCounter < 10 ? (
                        <>
                            <Stack p={2} bg="gray.5" borderRadius="md" >
                                <Text color={grayText} mx={2} fontSize="sm">Add (3 max.) images related to post</Text>
                                <Flex justify="space-between" align="center">
                                    {/* start */}
                                    <Box>
                                        <Input type="file" variant="unstyled" name="inputImageUpload1" id="inputImageUpload1" width="0.1px" height="0.1px" opacity="0" overflow="hidden" position="absolute" zIndex="-1" onChange={() => handleImageUpload(0)} />
                                        {imageUpload[0] ? (
                                            <>
                                                {!isUploading ? (
                                                    <AspectRatio maxWidth="110px" w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} ratio={1} objectFit="cover">
                                                        <Image role="button" w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} src={imageUploadSrc[0]} alt="Service Image 1" borderRadius="base" onClick={() => handleRemoveImage(0)} />
                                                    </AspectRatio>
                                                ) : (
                                                    <Center w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} bg="gray.10" borderRadius="base">
                                                        <Spinner size="xl" borderWidth="4px" color="primary.200" />
                                                    </Center>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Button color="white" as="label" htmlFor="inputImageUpload1" variant="unstyled" w={["26vw", "120px",]} h={["26vw", "120px",]} >
                                                    <Center role="button" w={["26vw", "120px",]} h={["26vw", "120px",]} bg="gray.10" borderRadius="base">
                                                        <Icon as={BiI.BiImageAdd} w={["50px", "70px",]} h={["50px", "70px",]} pl={1} pt={1} />
                                                    </Center>
                                                </Button>
                                            </>
                                        )}
                                    </Box>

                                    <Box>
                                        <Input type="file" variant="unstyled" name="inputImageUpload2" id="inputImageUpload2" width="0.1px" height="0.1px" opacity="0" overflow="hidden" position="absolute" zIndex="-1" onChange={() => handleImageUpload(1)} />
                                        {imageUpload[1] ? (
                                            <>
                                                {!isUploading ? (
                                                    <AspectRatio maxWidth="110px" w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} ratio={1} objectFit="cover">
                                                        <Image role="button" w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} src={imageUploadSrc[1]} alt="Service Image 2" borderRadius="base" onClick={() => handleRemoveImage(1)} />
                                                    </AspectRatio>
                                                ) : (
                                                    <Center w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} bg="gray.10" borderRadius="base">
                                                        <Spinner size="xl" borderWidth="4px" color="primary.200" />
                                                    </Center>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Button color="white" as="label" htmlFor="inputImageUpload2" variant="unstyled" w={["26vw", "120px",]} h={["26vw", "120px",]} >
                                                    <Center role="button" w={["26vw", "120px",]} h={["26vw", "120px",]} bg="gray.10" borderRadius="base">
                                                        <Icon as={BiI.BiImageAdd} w={["50px", "70px",]} h={["50px", "70px",]} pl={1} pt={1} />
                                                    </Center>
                                                </Button>
                                            </>
                                        )}
                                    </Box>

                                    <Box>
                                        <Input type="file" variant="unstyled" name="inputImageUpload3" id="inputImageUpload3" width="0.1px" height="0.1px" opacity="0" overflow="hidden" position="absolute" zIndex="-1" onChange={() => handleImageUpload(2)} />
                                        {imageUpload[2] ? (
                                            <>
                                                {!isUploading ? (
                                                    <AspectRatio maxWidth="110px" w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} ratio={1} objectFit="cover">
                                                        <Image role="button" w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} src={imageUploadSrc[2]} alt="Service Image 3" borderRadius="base" onClick={() => handleRemoveImage(2)} />
                                                    </AspectRatio>
                                                ) : (
                                                    <Center w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} bg="gray.10" borderRadius="base">
                                                        <Spinner size="xl" borderWidth="4px" color="primary.200" />
                                                    </Center>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Button color="white" as="label" htmlFor="inputImageUpload3" variant="unstyled" w={["26vw", "120px",]} h={["26vw", "120px",]} >
                                                    <Center role="button" w={["26vw", "120px",]} h={["26vw", "120px",]} bg="gray.10" borderRadius="base">
                                                        <Icon as={BiI.BiImageAdd} w={["50px", "70px",]} h={["50px", "70px",]} pl={1} pt={1} />
                                                    </Center>
                                                </Button>
                                            </>
                                        )}
                                    </Box>

                                </Flex>
                            </Stack>

                            <Stack p={2} spacing="7" mt={2}>
                                <FormControl id="category" isRequired isInvalid={categoryV}>
                                    <FormLabel fontWeight="500" color="gray.500">Category</FormLabel>
                                    <CategoriesModal as="input" type="text" setCategory={setCategory} category={category} fontWeight={"400"} color={"primary.600"} bg={"primary.100"} _hover={{ bg: "primary.200" }} _focus={{ bg: "primary.100" }} _active={{ bg: "primary.100" }} />
                                    <FormErrorMessage>Please choose a service category.</FormErrorMessage>
                                </FormControl>
                                <FormControl id="subCategory">
                                    <Flex justify="space-between">
                                        <FormLabel fontWeight="500" color="gray.500">Sub-Category</FormLabel>
                                        <FormHelperText as="i" color={subCategory.length > 30 ? "red" : "gray.500"} >{30 - subCategory.length} char. remaining.</FormHelperText>
                                    </Flex>
                                    <Input type="text" isInvalid={subCategory.length > 30 ? true : false} variant="flushed" placeholder="e.g. Eletrician, Sushi Chef, Landscape Architect..." onChange={(e) => setSubCategory(e.target.value)} />
                                </FormControl>
                                <FormControl id="title" isRequired isInvalid={titleV}>
                                    <Flex justify="space-between">
                                        <FormLabel fontWeight="500" color="gray.500">Title</FormLabel>
                                        <FormHelperText as="i" color={title.length > 40 ? "red" : "gray.500"} >{40 - title.length} char. remaining.</FormHelperText>
                                    </Flex>
                                    <Input type="text" isInvalid={title.length > 40 ? true : false} variant="flushed" placeholder="e.g. Sushi Chef with 10 years experience..." onChange={(e) => setTitle(e.target.value)} />
                                    <FormErrorMessage>Please provide a title for your service.</FormErrorMessage>
                                </FormControl>
                                <FormControl id="rate" isRequired isInvalid={rateV}>
                                    <FormLabel fontWeight="500" color="gray.500">Rate (USD per hour)</FormLabel>
                                    <InputGroup width="45%">
                                        <InputLeftElement pointerEvents="none" children="$" />
                                        <NumberInput min={1} variant="flushed" precision={2} isInvalid={rate.length > 10 ? true : false}>
                                            <NumberInputField id="numberInputField" pl={7} placeholder="1.0 min." onChange={(e) => setRate(e.target.value)} />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper color="gray.500" onClick={() => setRate(String(Number(document.getElementById("numberInputField").value) + .5))} />
                                                <NumberDecrementStepper color="gray.500" onClick={() => setRate(String(Number(document.getElementById("numberInputField").value) - .5))} />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </InputGroup>
                                    <FormErrorMessage>Please provide a rate for your service.</FormErrorMessage>
                                </FormControl>
                                <FormControl id="description">
                                    <Flex justify="space-between">
                                        <FormLabel fontWeight="500" color="gray.500">Description</FormLabel>
                                        <FormHelperText as="i" color={description.length > 1000 ? "red" : "gray.500"} >{1000 - description.length} char. remaining.</FormHelperText>
                                    </Flex>
                                    <Input as="textarea" isInvalid={description.length > 1000 ? true : false} variant="flushed" minHeight="150px" type="text" overflow="visible" py={1} placeholder="Provide further information regarding the service you offer." onChange={(e) => setDescription(e.target.value)} />
                                    <FormHelperText as="i" color="gray.500" >Can be styled using HTML</FormHelperText>
                                </FormControl>
                                <FormControl id="location" isRequired isInvalid={myLocV}>
                                    <FormLabel fontWeight="500" color="gray.500">Service Location</FormLabel>
                                    <RadioGroup onChange={setServiceLocationChoice} value={serviceLocationChoice} mb={2}>
                                        <Wrap spacing="4" overflow="visible">
                                            <Radio value="mine" colorScheme="red" onClick={() => { setMyLat(""); setMyLong("") }}>Mine</Radio>
                                            <Radio value="users" colorScheme="red" onClick={() => { setMyLat(""); setMyLong("") }}>Users</Radio>
                                            <Radio value="both" colorScheme="red" onClick={() => { setMyLat(""); setMyLong("") }}>Both</Radio>
                                            <Radio value="global" colorScheme="red" onClick={() => { setMyLat("13.37"); setMyLong("13.37") }}>Global</Radio>
                                        </Wrap>
                                    </RadioGroup>
                                    <FormHelperText role="button" mb={2} onClick={() => setServiceInfo("none")} display={serviceInfo}>Select: <br></br>'Mine' to provide a service at your location.<br></br>'Users' to provide a service at the Users location.<br></br>'Both' to provide a service at either yours or the Users location.<br></br>'Global' for digitial or consultancy type services where service can be provided globally.<br></br>Click here to close this info box.</FormHelperText>
                                    {serviceLocationChoice !== "global" && (
                                        <>
                                            {(serviceLocationChoice === "users" || serviceLocationChoice === "both") && (
                                                <>
                                                    <FormHelperText mb={3} >Note: You must still provide a location even when providing a service at the users location, as your location is used to filter Users search results.</FormHelperText>
                                                </>
                                            )
                                            }
                                            {(serviceLocationChoice === "mine") && (
                                                <>
                                                    <FormHelperText mb={3} >Note: Your location is used to filter Users search results.</FormHelperText>
                                                </>
                                            )
                                            }
                                            <Center>
                                                <GetLocation myLat={myLat} myLong={myLong} setMyLat={setMyLat} setMyLong={setMyLong} />
                                            </Center>
                                            <Flex mt={2}>
                                                <InputGroup mr={2}>
                                                    <InputLeftElement pointerEvents="none" color="gray.500" children="Lat: " />
                                                    <Input type="number" isInvalid={myLat.length > 20 ? true : false} variant="flushed" placeholder="-5.6429177" value={myLat} onChange={(e) => setMyLat(e.target.value)} />
                                                </InputGroup>
                                                <InputGroup ml={2}>
                                                    <InputLeftElement pointerEvents="none" color="gray.500" children="Long: " />
                                                    <Input type="number" isInvalid={myLong.length > 20 ? true : false} variant="flushed" placeholder="-155.9042211" value={myLong} pl={12} onChange={(e) => setMyLong(e.target.value)} />
                                                </InputGroup>
                                            </Flex>
                                            <FormErrorMessage>Please provide a location for your service.</FormErrorMessage>
                                        </>
                                    )}
                                </FormControl>

                                <FormControl id="dayTime">
                                    <FormLabel fontWeight="500" mt={1} color="gray.500">Day and Time Available</FormLabel>
                                    <Stack>
                                        <NewTimeDayPicker disableEdit={false} dayTime={dayTime} setDayTime={setDayTime} />
                                    </Stack>
                                    <FormHelperText>You must click the save icon after completing your availability, otherwise the dates and times will NOT be saved.</FormHelperText>
                                </FormControl>
                            </Stack>

                            <Stack spacing="7" mt={4}>
                                <FormControl id="certification">
                                    <FormLabel px={2} color="gray.500" fontWeight="500">Certification / Licenses (optional)</FormLabel>
                                    <Stack p={2} bg="gray.5" borderRadius="md" >
                                        <Text color={grayText} mx={2} fontSize="xs">Add (3 max.) certificates/licenses related to service :</Text>
                                        <Flex justify="space-between" align="center" >

                                            <Box>
                                                <Input type="file" variant="unstyled" name="inputImageUpload4" id="inputImageUpload4" width="0.1px" height="0.1px" opacity="0" overflow="hidden" position="absolute" zIndex="-1" onChange={() => handleImageUpload(3)} />
                                                {imageUpload[3] ? (
                                                    <>
                                                        {!isUploading ? (
                                                            <AspectRatio maxWidth="110px" w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} ratio={1} objectFit="cover">
                                                                <Image role="button" w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} src={imageUploadSrc[3]} alt="Service Certificate 1" borderRadius="base" onClick={() => handleRemoveImage(3)} />
                                                            </AspectRatio>
                                                        ) : (
                                                            <Center w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} bg="gray.10" borderRadius="base">
                                                                <Spinner size="xl" borderWidth="4px" color="primary.200" />
                                                            </Center>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button color="white" as="label" htmlFor="inputImageUpload4" variant="unstyled" w={["26vw", "120px",]} h={["26vw", "120px",]} >
                                                            <Center role="button" w={["26vw", "120px",]} h={["26vw", "120px",]} bg="gray.10" borderRadius="base">
                                                                <Icon as={BiI.BiImageAdd} w={["50px", "70px",]} h={["50px", "70px",]} pl={1} pt={1} />
                                                            </Center>
                                                        </Button>
                                                    </>
                                                )}
                                            </Box>

                                            <Box>
                                                <Input type="file" variant="unstyled" name="inputImageUpload5" id="inputImageUpload5" width="0.1px" height="0.1px" opacity="0" overflow="hidden" position="absolute" zIndex="-1" onChange={() => handleImageUpload(4)} />
                                                {imageUpload[4] ? (
                                                    <>
                                                        {!isUploading ? (
                                                            <AspectRatio maxWidth="110px" w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} ratio={1} objectFit="cover">
                                                                <Image role="button" w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} src={imageUploadSrc[4]} alt="Service Certificate 2" borderRadius="base" onClick={() => handleRemoveImage(4)} />
                                                            </AspectRatio>
                                                        ) : (
                                                            <Center w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} bg="gray.10" borderRadius="base">
                                                                <Spinner size="xl" borderWidth="4px" color="primary.200" />
                                                            </Center>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button color="white" as="label" htmlFor="inputImageUpload5" variant="unstyled" w={["26vw", "120px",]} h={["26vw", "120px",]} >
                                                            <Center role="button" w={["26vw", "120px",]} h={["26vw", "120px",]} bg="gray.10" borderRadius="base">
                                                                <Icon as={BiI.BiImageAdd} w={["50px", "70px",]} h={["50px", "70px",]} pl={1} pt={1} />
                                                            </Center>
                                                        </Button>
                                                    </>
                                                )}
                                            </Box>

                                            <Box>
                                                <Input type="file" variant="unstyled" name="inputImageUpload6" id="inputImageUpload6" width="0.1px" height="0.1px" opacity="0" overflow="hidden" position="absolute" zIndex="-1" onChange={() => handleImageUpload(5)} />
                                                {imageUpload[5] ? (
                                                    <>
                                                        {!isUploading ? (
                                                            <AspectRatio maxWidth="110px" w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} ratio={1} objectFit="cover">
                                                                <Image role="button" w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} src={imageUploadSrc[5]} alt="Service Certificate 3" borderRadius="base" onClick={() => handleRemoveImage(5)} />
                                                            </AspectRatio>
                                                        ) : (
                                                            <Center w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} bg="gray.10" borderRadius="base">
                                                                <Spinner size="xl" borderWidth="4px" color="primary.200" />
                                                            </Center>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button color="white" as="label" htmlFor="inputImageUpload6" variant="unstyled" w={["26vw", "120px",]} h={["26vw", "120px",]} >
                                                            <Center role="button" w={["26vw", "120px",]} h={["26vw", "120px",]} bg="gray.10" borderRadius="base">
                                                                <Icon as={BiI.BiImageAdd} w={["50px", "70px",]} h={["50px", "70px",]} pl={1} pt={1} />
                                                            </Center>
                                                        </Button>
                                                    </>
                                                )}
                                            </Box>

                                        </Flex>
                                    </Stack>
                                </FormControl>
                            </Stack>

                            <Stack p={2} mt={2}>
                                <Stack spacing="3">
                                    <FormControl id="postService" isInvalid={!okToPost}>
                                        <FormErrorMessage mb={1}>Please fill out all required * fields above.</FormErrorMessage>
                                        <PreviewPost postValidation={postValidation} defineNewService={defineNewService} okToPreview={okToPreview} setOkToPreview={setOkToPreview} setOkToPost={setOkToPost} okToPost={okToPost} category={category} title={title} description={description} rate={rate} myLat={myLat} myLong={myLong} serviceLocationChoice={serviceLocationChoice} dayTime={dayTime} imageUploadSrc={imageUploadSrc} isUploading={isUploading} newService={newService} postSuccess={postSuccess} setPostSuccess={setPostSuccess} history={history} />
                                    </FormControl>
                                    <Flex>
                                        <Spacer />
                                        <Button onClick={() => window.location.reload()}>Reset<Icon as={VsC.VscClearAll} w={6} h={6} ml={2} /></Button>
                                    </Flex>
                                </Stack>
                            </Stack>
                        </>
                    ) : (
                        <>
                            <Center h="50vw">
                                <Stack>
                                    <Text >You have reached your post limit of 10 posted services per user. Please remove an old or existing service before posting a new service.</Text>
                                    <Text >To remove an old or existing post please visit the <Link as={RouterLink} to="/activity/who" color="primary.500" fontWeight="600">Activity / Provider</Link> section.</Text>
                                </Stack>
                            </Center>
                        </>
                    )}
                </Container>
            </Box>
            <FootNav />
        </Box >
    )
}


function PreviewPost({ postValidation, okToPreview, postSuccess, history, setOkToPreview, category, subCategory, title, description, rate, myLat, myLong, dayTime, serviceLocationChoice, imageUploadSrc, setOkToPost, okToPost, defineNewService, isUploading, newService }) {

    // eslint-disable-next-line
    const { isOpen, onOpen, onClose } = useDisclosure()
    // const [isDisabled, setIsDisabled] = useState(false);

    // useEffect(() => {
    //     if (subCategory.length > 40 && title.length > 70 && rate.length > 10 && description.length > 1000 && myLat.length > 20 && myLong.length > 20) {
    //         setIsDisabled(true);
    //     }
    // },)

    useEffect(() => {
        if (okToPreview === true && okToPost === true && category !== "Click to Choose Category" && category !== "" && title !== "" && rate !== "" && myLat !== "" && myLong !== "") {
            onOpen();
            // defineNewService();
        }
        // eslint-disable-next-line
    }, [okToPreview])

    return (
        <>
            <Button w="100%" fontSize="xl" p={6} color="secondary.500" bg="secondary.100" _hover={{ bg: "secondary.200" }} _focus={{ bg: "secondary.100" }} _active={{ bg: "secondary.100" }} onClick={postValidation} isLoading={isUploading} isDisabled={false} ><Icon as={VsC.VscOpenPreview} height="28px" width="28px" mr={2} /> Confirm Post</Button>

            <Modal isOpen={isOpen} size="lg" onClose={postSuccess ? () => { onClose(); window.scrollTo(0, 0); window.location.reload(); } : () => { onClose(); setOkToPreview(false); setOkToPost(true); }} >
                <ModalOverlay />
                <ModalContent minHeight="200px" borderRadius="xl" p={2} mx={3} mt="10%" className="bgBlurModal">
                    {postSuccess ? (
                        <>
                            <ModalHeader p={4} fontWeight="400" style={{ display: "flex", alignItems: "center" }}><Icon as={Io5.IoBonfireOutline} color="secondary.300" mr={1} h="24px" w="24px" />Post Success!</ModalHeader>
                            <ModalCloseButton m={3} onClick={() => { onClose(); window.scrollTo(0, 0); window.location.reload(); }} />
                            <ModalBody px={4} id="categoryButtons">
                                Your service post was successfully created. Please choose whether you would like to go to your post, or create a another service.
                            </ModalBody>
                            <ModalFooter>
                                <Button color="secondary.500" bg="secondary.100" _hover={{ bg: "secondary.200" }} _focus={{ bg: "secondary.100" }} _active={{ bg: "secondary.100" }} onClick={() => { setOkToPreview(false); history.push(`/activity/who/myservices/${newService.id}`) }} mr={2}>Go To Post</Button>
                                <Button onClick={() => { onClose(); window.scrollTo(0, 0); window.location.reload(); }}>Create Another Service</Button>
                            </ModalFooter>
                        </>
                    ) : (
                        <>
                            <ModalHeader p={4} fontWeight="400" style={{ display: "flex", alignItems: "center" }}><Icon as={HiI.HiOutlineBadgeCheck} color="primary.400" mr={1} h="24px" w="24px" />Confirm Post</ModalHeader>
                            <ModalCloseButton m={3} onClick={() => { onClose(); setOkToPreview(false); setOkToPost(true); }} />
                            <ModalBody px={4} id="categoryButtons">
                                Please confirm you would like to save this new service.
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="primary" onClick={defineNewService} mr={2} isLoading={isUploading}>Confirm</Button>
                                <Button onClick={() => { onClose(); setOkToPreview(false); setOkToPost(true); }} isLoading={isUploading}>Cancel</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
