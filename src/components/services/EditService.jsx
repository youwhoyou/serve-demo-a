import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalOverlay, ModalCloseButton, ModalHeader, ModalBody, Image, Icon, Box, Center, IconButton, Stack, Flex, Input, Spinner, Button, Text, Spacer, AspectRatio, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, useDisclosure, FormControl, FormLabel, FormErrorMessage, FormHelperText, InputGroup, InputLeftElement, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Radio, RadioGroup, Wrap, ModalFooter, Container } from "@chakra-ui/react";
import * as Io5 from "react-icons/io5";
import * as BiI from "react-icons/bi";
import * as HiI from "react-icons/hi";
import * as VsC from "react-icons/vsc";
import { useMoralis } from "react-moralis";
import { useParams } from "react-router-dom";
import CategoriesModal from '../misc/CategoriesModal';
import Lightbox from "react-awesome-lightbox";
import GetLocation from "../map/GetLocation";
import TimeDayPicker from '../misc/TimeDayPicker';
import ErrorDialog from '../error/ErrorDialog';
import YouWhoLoading from '../misc/YouWhoLoading';



export default function EditService({ category, setCategory, subCategory, setSubCategory, title, setTitle, rate, setRate, description, setDescription, myLat, setMyLat, myLong, setMyLong, serviceLocationChoice, setServiceLocationChoice, dayTime, setDayTime, history, destroyMyObject, siteIsLoading2, setSiteIsLoading2, grayText, selectedService, setSelectedService, setYouWhoSwitch }) {

    const { Moralis } = useMoralis();
    const { id: serviceId } = useParams();
    const [imageUpload, setImageUpload] = useState([true, true, true, true, true, true]);
    const [imageUploadSrc, setImageUploadSrc] = useState([]);
    const [imageUploadFile, setImageUploadFile] = useState([]);
    const [categoryV, setCategoryV] = useState(false);
    const [titleV, setTitleV] = useState(false);
    const [rateV, setRateV] = useState(false);
    const [myLocV, setMyLocV] = useState(false);
    const [okToPost, setOkToPost] = useState(true);
    const [okToPreview, setOkToPreview] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [newServiceError, setNewServiceError] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showLightbox, setShowLightbox] = useState([false, false, false, false, false, false]);
    const [disableEdit, setDisableEdit] = useState(true);
    const [postSuccess, setPostSuccess] = useState(false);

    const postValidation = () => {
        if (category !== "Click to Choose Category" && category !== "") { setCategoryV(false); setOkToPost(true); setOkToPreview(true) } else { setCategoryV(true); setOkToPost(false); setOkToPreview(false) };
        if (title !== "") { setTitleV(false); setOkToPost(true); setOkToPreview(true) } else { setTitleV(true); setOkToPost(false); setOkToPreview(false) };
        if (rate !== "") { setRateV(false); setOkToPost(true); setOkToPreview(true) } else { setRateV(true); setOkToPost(false); setOkToPreview(false) };
        if (myLat !== "" && myLong !== "") { setMyLocV(false); setOkToPost(true); setOkToPreview(true) } else { setMyLocV(true); setOkToPost(false); setOkToPreview(false) };
        if (category !== "Click to Choose Category" && category !== "" && title !== "" && rate !== "" && myLat !== "" && myLong !== "") { setOkToPost(true); setOkToPreview(true) } else { setOkToPost(false); setOkToPreview(false) };

    }

    console.log("selected Service", selectedService ? true : false)

    useEffect(() => {
        if (selectedService) {
            setSiteIsLoading2(true);
            setCategory(selectedService.attributes.category);
            setSubCategory(selectedService.attributes.subCategory);
            setTitle(selectedService.attributes.title);
            setRate(selectedService.attributes.rate);
            setDescription(selectedService.attributes.description);
            setServiceLocationChoice(selectedService.attributes.serviceLocationChoice);
            setMyLat(selectedService.attributes.myLat);
            setMyLong(selectedService.attributes.myLong);
            setDayTime(selectedService.attributes.dayTime);
            setImageUploadFile([selectedService.attributes.service_img1, selectedService.attributes.service_img2, selectedService.attributes.service_img3, selectedService.attributes.service_img4, selectedService.attributes.service_img5, selectedService.attributes.service_img6]);
            setSiteIsLoading2(false);

        } else {

            setSiteIsLoading2(true);

            (async () => {
                let Services = Moralis.Object.extend("Services");
                const queryService = new Moralis.Query(Services);
                queryService.equalTo("objectId", serviceId);

                await queryService.first()
                    .then((result) => {

                        if (result) {
                            setSelectedService(result);
                            setSiteIsLoading2(false);
                            // console.log(result);
                        } else {
                            setSiteIsLoading2(false);
                        }

                    })
                    .catch((error) => {
                        console.log(error);
                        setSiteIsLoading2(false);
                    });
            })();
        }

        // eslint-disable-next-line
    }, [selectedService]);

    const updateService = async () => {
        setIsUploading(true);
        const Services = Moralis.Object.extend("Services");
        const query = new Moralis.Query(Services);
        await query.get(selectedService.id)
            .then(async (service) => {
                // The object was retrieved successfully.
                // service.set('title', "Alcohol Counselor Based in US");
                if (service.attributes.category !== category) service.set('category', category);
                if (service.attributes.subCategory !== subCategory) service.set('subCategory', subCategory);
                if (service.attributes.title !== title) service.set('title', title);
                if (service.attributes.rate !== Number(Number(rate).toFixed(2))) service.set('rate', Number(Number(rate).toFixed(2)));
                if (service.attributes.description !== description) service.set('description', description);
                if (service.attributes.serviceLocationChoice !== serviceLocationChoice) service.set('serviceLocationChoice', serviceLocationChoice);
                if (service.attributes.myLat !== Number(myLat)) service.set('myLat', Number(myLat));
                if (service.attributes.myLong !== Number(myLong)) service.set('myLong', Number(myLong));

                let location = new Moralis.GeoPoint(Number(myLat), Number(myLong));
                if (service.attributes.location !== location) service.set('location', location);

                if (service.attributes.dayTime !== dayTime) service.set('dayTime', dayTime);
                if (service.attributes.service_img1 !== imageUploadFile[0]) service.set('service_img1', imageUploadFile[0]);
                if (service.attributes.service_img2 !== imageUploadFile[1]) service.set('service_img2', imageUploadFile[1]);
                if (service.attributes.service_img3 !== imageUploadFile[2]) service.set('service_img3', imageUploadFile[2]);
                if (service.attributes.service_img4 !== imageUploadFile[3]) service.set('service_img4', imageUploadFile[3]);
                if (service.attributes.service_img5 !== imageUploadFile[4]) service.set('service_img5', imageUploadFile[4]);
                if (service.attributes.service_img6 !== imageUploadFile[5]) service.set('service_img6', imageUploadFile[5]);

                await service.save().then((service) => {
                    // Execute any logic that should take place after the object is saved.
                    setIsUploading(false);
                    setPostSuccess(true);
                    setOkToPreview(false);

                }, (error) => {
                    // Execute any logic that should take place if the save fails.
                    // error is a Moralis.Error with an error code and message.
                    setIsUploading(false);
                    setOkToPreview(false);
                    setNewServiceError(["Error Updating Service!", error.message]);
                    setShowAlert(true);
                });
            }, (error) => {
                // The object was not retrieved successfully.
                // error is a Moralis.Error with an error code and message.
                setSiteIsLoading2(false);
                setNewServiceError(["Error Updating Service!", error.message]);
                setShowAlert(true);
            });
    }

    const handleImageUpload = async (index) => {
        const fileUploadControl = document.getElementById(`inputImageUpload${index + 1}`);
        if (fileUploadControl.files.length > 0) {
            setIsUploading(true);
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

    const handleLightbox = (index, show = false) => {

        const arrShowLightbox = showLightbox.slice();
        arrShowLightbox[index] = show;
        setShowLightbox(arrShowLightbox);

    }

    if (selectedService) {
        return (
            <>
                {siteIsLoading2 ?
                    <YouWhoLoading />
                    : (
                        <>
                            {showAlert && (<ErrorDialog title={newServiceError[0]} message={newServiceError[1]} showAlert={showAlert} setShowAlert={setShowAlert} />)}

                            <Flex pt={2} pr={1} align="center">
                                <IconButton icon={<Io5.IoArrowBack />} variant="link" size="sm" fontSize="24px" h="24px " w="24px" onClick={() => { setImageUploadFile([]); setYouWhoSwitch(true); history.goBack(); }} />
                                <Spacer />
                                <Text color={disableEdit ? grayText : "primary.300"} fontWeight="500" px={3} py={1} borderRadius="base" bg="gray.10">{disableEdit ? "View Mode" : "Edit Mode"}</Text>
                                <Spacer />
                                <IconButton onClick={() => setDisableEdit(!disableEdit)} isActive={false} color={disableEdit ? "primary.400" : "primary.400"} variant="unstyled" size="sm" mr={1} fontSize="24px" h="24px" w="24px" icon={<Io5.IoHammerOutline />} />
                                <HandleDelete destroyMyObject={destroyMyObject} selectedService={selectedService} />
                            </Flex>

                            <Box py={2}>

                                <Flex px={2} >
                                    <Text textAlign="left" color={disableEdit ? "inherit" : "primary.400"} fontWeight="400" fontSize="24px" style={{ display: "flex", alignItems: "center" }} ><Icon as={HiI.HiOutlinePencilAlt} fontSize="22px" color="secondary.200" mr={2} />{title}</Text>
                                </Flex>

                                <Flex px={2} align="center" h="30px" w="100%">
                                    <Text fontSize="xs" color={grayText} >{category} {subCategory ? <Text as="span">&bull;</Text> : ""} {subCategory}</Text>
                                </Flex>

                                <Flex justify="space-between" mt={2} bg="gray.5" borderRadius="md" p={2} align="center">
                                    {/* start */}
                                    {imageUploadFile.slice(0, 3).map((x, i) => (
                                        <Box key={"img" + i}>
                                            <Input type="file" key={"imgInput" + i} isDisabled={disableEdit} variant="unstyled" name={`inputImageUpload${i + 1}`} id={`inputImageUpload${i + 1}`} width="0.1px" height="0.1px" opacity="0" overflow="hidden" position="absolute" zIndex="-1" onChange={() => handleImageUpload(i)} />
                                            {x ? (
                                                <>
                                                    {!isUploading ? (
                                                        <Button color="white" as="label" variant="unstyled" w={["26vw", "120px",]} h={["26vw", "120px",]} >
                                                            <AspectRatio maxWidth="120px" w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} ratio={1} objectFit="cover">
                                                                <Image id={`serviceImage${i}`} role="button" w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} src={imageUploadSrc[i] ? imageUploadSrc[i] : x._url} fallback={<Box h="20px" w="20px"><Spinner color="primary.200" /></Box>} alt={`Service Image ${i + 1}`} borderRadius="base" onClick={disableEdit ? () => handleLightbox(i, true) : () => handleRemoveImage((i))} />
                                                            </AspectRatio>
                                                        </Button>
                                                    ) : (
                                                        <Center w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} bg="gray.10" borderRadius="base">
                                                            <Spinner size="xl" borderWidth="4px" color="primary.200" />
                                                        </Center>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <Button color="white" as="label" htmlFor={disableEdit ? "" : `inputImageUpload${i + 1}`} variant="unstyled" w={["26vw", "120px",]} h={["26vw", "120px",]} >
                                                        <Center role="button" w={["26vw", "120px",]} h={["26vw", "120px",]} bg="gray.10" borderRadius="base">
                                                            <Icon color={disableEdit ? "inherit" : "primary.300"} as={BiI.BiImageAdd} w={["50px", "70px",]} h={["50px", "70px",]} pl={1} pt={1} />
                                                        </Center>
                                                    </Button>
                                                </>
                                            )}
                                        </Box>
                                    ))}
                                </Flex>

                                <Stack p={2} spacing="7" mt={2}>

                                    <FormControl id="category" isRequired isInvalid={categoryV}>
                                        <FormLabel fontWeight="500" color={disableEdit ? "gray.500" : "primary.300"}>Category</FormLabel>
                                        <CategoriesModal as="input" type="text" setCategory={setCategory} category={category} isDisabled={disableEdit} fontWeight={"400"} color={"primary.600"} bg={"primary.100"} _hover={{ bg: "primary.200" }} _focus={{ bg: "primary.100" }} _active={{ bg: "primary.100" }} />
                                        <FormErrorMessage>Please choose a service category.</FormErrorMessage>
                                    </FormControl>
                                    <FormControl id="subCategory">
                                        <Flex justify="space-between">
                                            <FormLabel fontWeight="500" color={disableEdit ? "gray.500" : "primary.300"}>Sub-Category</FormLabel>
                                            <FormHelperText as="i" color={subCategory.length > 30 ? "red" : "gray.500"} >{30 - subCategory.length} char. remaining.</FormHelperText>
                                        </Flex>
                                        <Input type="text" isInvalid={subCategory.length > 30 ? true : false} isReadOnly={disableEdit} variant="flushed" value={subCategory} placeholder="e.g. Eletrician, Sushi Chef, Landscape Architect..." onChange={(e) => setSubCategory(e.target.value)} />
                                    </FormControl>
                                    <FormControl id="title" isRequired isInvalid={titleV}>
                                        <Flex justify="space-between">
                                            <FormLabel fontWeight="500" color={disableEdit ? "gray.500" : "primary.300"}>Title</FormLabel>
                                            <FormHelperText as="i" color={title.length > 40 ? "red" : "gray.500"} >{40 - title.length} char. remaining.</FormHelperText>
                                        </Flex>
                                        <Input type="text" isInvalid={title.length > 40 ? true : false} isReadOnly={disableEdit} variant="flushed" value={title} placeholder="e.g. Sushi Chef with 10 years experience..." onChange={(e) => setTitle(e.target.value)} />
                                        <FormErrorMessage>Please provide a title for your service.</FormErrorMessage>
                                    </FormControl>
                                    <FormControl id="rate" isRequired isInvalid={rateV}>
                                        <FormLabel fontWeight="500" color={disableEdit ? "gray.500" : "primary.300"}>Rate (USD per hour)</FormLabel>
                                        <InputGroup width="45%">
                                            <InputLeftElement pointerEvents="none" children="$" fontSize="sm" />
                                            <NumberInput min={1} variant="flushed" value={rate} fontSize="lg" isReadOnly={disableEdit} precision={2} isInvalid={rate.length > 10 ? true : false}>
                                                <NumberInputField id="numberInputField2" pl={7} placeholder="1.0 min." fontSize="lg" onChange={(e) => setRate(e.target.value)} />
                                                <NumberInputStepper >
                                                    <NumberIncrementStepper color="gray.500" onClick={disableEdit ? () => { } : () => setRate(String(Number(document.getElementById("numberInputField2").value) + .5))} />
                                                    <NumberDecrementStepper color="gray.500" onClick={disableEdit ? () => { } : () => setRate(String(Number(document.getElementById("numberInputField2").value) - .5))} />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </InputGroup>
                                        <FormErrorMessage>Please provide a rate for your service.</FormErrorMessage>
                                    </FormControl>
                                    <FormControl id="description">
                                        <Flex justify="space-between">
                                            <FormLabel fontWeight="400" color={disableEdit ? "gray.500" : "primary.300"}>Description</FormLabel>
                                            <FormHelperText as="i" color={description.length > 1000 ? "red" : "gray.500"} >{1000 - description.length} char. remaining.</FormHelperText>
                                        </Flex>
                                        <Input as="textarea" isInvalid={description.length > 1000 ? true : false} value={description} variant="flushed" minHeight="150px" type="text" overflow="visible" py={1} placeholder="Provide further information regarding the service you offer." onChange={(e) => setDescription(e.target.value)} />
                                        <FormHelperText as="i" color="gray.500" >Can be styled using HTML</FormHelperText>
                                    </FormControl>
                                    <FormControl id="location" isRequired isInvalid={myLocV}>
                                        <FormLabel fontWeight="500" color={disableEdit ? "gray.500" : "primary.300"}>Service Location</FormLabel>
                                        <RadioGroup onChange={setServiceLocationChoice} value={serviceLocationChoice} mb={2}>
                                            <Wrap spacing="4" overflow="visible">
                                                <Radio value="mine" colorScheme="red" isReadOnly={disableEdit} onClick={() => { setMyLat(""); setMyLong("") }}>Mine</Radio>
                                                <Radio value="users" colorScheme="red" isReadOnly={disableEdit} onClick={() => { setMyLat(""); setMyLong("") }}>Users</Radio>
                                                <Radio value="both" colorScheme="red" isReadOnly={disableEdit} onClick={() => { setMyLat(""); setMyLong("") }}>Both</Radio>
                                                <Radio value="global" colorScheme="red" isReadOnly={disableEdit} onClick={() => { setMyLat("13.37"); setMyLong("13.37") }}>Global</Radio>
                                            </Wrap>
                                        </RadioGroup>
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
                                                    <GetLocation myLat={myLat} myLong={myLong} setMyLat={setMyLat} setMyLong={setMyLong} disableEdit={disableEdit} />
                                                </Center>
                                                <Flex mt={2}>
                                                    <InputGroup mr={2}>
                                                        <InputLeftElement pointerEvents="none" color="gray.500" children="Lat: " />
                                                        <Input type="number" isReadOnly={disableEdit} isInvalid={myLat.length > 20 ? true : false} value={myLat} variant="flushed" placeholder="-5.6429177" onChange={(e) => setMyLat(e.target.value)} />
                                                    </InputGroup>
                                                    <InputGroup ml={2}>
                                                        <InputLeftElement pointerEvents="none" color="gray.500" children="Long: " />
                                                        <Input type="number" isReadOnly={disableEdit} isInvalid={myLong.length > 20 ? true : false} value={myLong} variant="flushed" placeholder="-155.9042211" pl={12} onChange={(e) => setMyLong(e.target.value)} />
                                                    </InputGroup>
                                                </Flex>
                                                <FormErrorMessage>Please provide a location for your service.</FormErrorMessage>
                                            </>
                                        )}
                                    </FormControl>

                                    <FormControl id="dayTime">
                                        <FormLabel fontWeight="500" mt={1} color={disableEdit ? "gray.500" : "primary.300"}>Day and Time Available</FormLabel>
                                        <FormHelperText as="i">(-)Negative or (+)positive times indicate the day before or after the day shown.</FormHelperText>
                                        <Stack>
                                            <TimeDayPicker disableEdit={disableEdit} dayTime={dayTime} setDayTime={setDayTime} />
                                        </Stack>
                                        <FormHelperText>You must click the save icon after completing your availability, otherwise the dates and times will NOT be saved.</FormHelperText>
                                    </FormControl>
                                </Stack>

                                <Stack spacing="7" mt={4}>
                                    <FormControl id="certification">
                                        <FormLabel px={2} color={disableEdit ? "gray.500" : "primary.300"} fontWeight="500">Certification / Licenses (optional)</FormLabel>
                                        <Flex justify="space-between" p={2} bg="gray.5" borderRadius="md" align="center">
                                            {imageUploadFile.slice(3).map((x, i) => (
                                                <Box borderRadius="lg" key={"img" + (i + 3)}>
                                                    <Input type="file" key={"imgInput" + (i + 3)} variant="unstyled" name={`inputImageUpload${(i + 3) + 1}`} id={`inputImageUpload${(i + 3) + 1}`} width="0.1px" height="0.1px" opacity="0" overflow="hidden" position="absolute" zIndex="-1" onChange={() => handleImageUpload((i + 3))} />
                                                    {x ? (
                                                        <>
                                                            {!isUploading ? (
                                                                <Button color="white" as="label" htmlFor={disableEdit ? "" : `inputImageUpload${(i + 3) + 1}`} variant="unstyled" w={["26vw", "120px",]} h={["26vw", "120px",]} >
                                                                    <AspectRatio maxWidth="120px" w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} ratio={1} objectFit="cover">
                                                                        <Image id={`serviceCertificate${i + 3}`} role="button" w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} src={imageUploadSrc[i + 3] ? imageUploadSrc[i + 3] : x._url} fallback={<Box h="20px" w="20px"><Spinner color="primary.200" /></Box>} alt={`Service Certificate ${i + 1}`} borderRadius="base" onClick={disableEdit ? () => handleLightbox((i + 3), true) : () => handleRemoveImage((i + 3))} />
                                                                    </AspectRatio>
                                                                </Button>
                                                            ) : (
                                                                <Center w={["26vw", "120px", ""]} h={["26vw", "120px", ""]} bg="gray.10" borderRadius="base">
                                                                    <Spinner size="xl" borderWidth="4px" color="primary.200" />
                                                                </Center>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button color="white" as="label" htmlFor={disableEdit ? "" : `inputImageUpload${(i + 3) + 1}`} variant="unstyled" w={["26vw", "120px",]} h={["26vw", "120px",]} >
                                                                <Center role="button" w={["26vw", "120px",]} h={["26vw", "120px",]} bg="gray.10" borderRadius="base">
                                                                    <Icon color={disableEdit ? "inherit" : "primary.300"} as={BiI.BiImageAdd} w={["50px", "70px",]} h={["50px", "70px",]} pl={1} pt={1} />
                                                                </Center>
                                                            </Button>
                                                        </>
                                                    )}
                                                </Box>
                                            ))}
                                        </Flex>
                                    </FormControl>

                                </Stack>

                                {!disableEdit && <>

                                    <Stack p={2} mt={2} display={["none", "flex", "", ""]}>
                                        <Stack spacing="3">
                                            <FormControl id="postService" isInvalid={!okToPost}>
                                                <FormErrorMessage mb={1}>Please fill out all required * fields above.</FormErrorMessage>
                                                <PreviewPost postValidation={postValidation} updateService={updateService} okToPreview={okToPreview} setOkToPreview={setOkToPreview} setOkToPost={setOkToPost} okToPost={okToPost} category={category} title={title} description={description} rate={rate} myLat={myLat} myLong={myLong} serviceLocationChoice={serviceLocationChoice} dayTime={dayTime} imageUploadSrc={imageUploadSrc} isUploading={isUploading} postSuccess={postSuccess} />
                                            </FormControl>
                                            <Flex>
                                                <Spacer />
                                                <Button onClick={() => window.location.reload()}>Reset<Icon as={VsC.VscClearAll} w={6} h={6} ml={2} /></Button>
                                            </Flex>
                                        </Stack>
                                    </Stack>

                                    <Container maxW="md" >
                                        <Flex justify="space-between" align="center" className="bgBlur" color="gray.500" minHeight="61px" pos="fixed" w="100%" bottom="0" left="0" zIndex={2} borderTop="0px" px={3} borderColor="gray.10" display={["flex", "none", "", ""]}>
                                            <FormControl id="postService" isInvalid={!okToPost}>
                                                <FormErrorMessage mb={1} mx="auto" position="fixed" bottom="58px" >Please fill out all required * fields above.</FormErrorMessage>
                                                <PreviewPost postValidation={postValidation} updateService={updateService} okToPreview={okToPreview} setOkToPreview={setOkToPreview} setOkToPost={setOkToPost} okToPost={okToPost} category={category} title={title} description={description} rate={rate} myLat={myLat} myLong={myLong} serviceLocationChoice={serviceLocationChoice} dayTime={dayTime} imageUploadSrc={imageUploadSrc} isUploading={isUploading} postSuccess={postSuccess} />
                                            </FormControl>
                                            <Flex ml={4}>
                                                <Button onClick={() => window.location.reload()}>Reset<Icon as={VsC.VscClearAll} w={6} h={6} ml={2} /></Button>
                                            </Flex>
                                        </Flex>
                                    </Container>

                                </>
                                }

                            </Box>
                            {imageUploadFile.slice(0, 3).map((x, i) => (
                                showLightbox[i] &&
                                <Lightbox key={"lb" + i} image={x._url} title={`Service Image ${i + 1}`} onClose={() => { handleLightbox(i) }} />
                            ))}
                            {imageUploadFile.slice(3).map((x, i) => (
                                showLightbox[i + 3] &&
                                <Lightbox key={"lb" + (i + 3)} image={x._url} title={`Service Certificate ${i + 1}`} onClose={() => { handleLightbox((i + 3)) }} />
                            ))}
                        </>
                    )
                }
            </>
        )
    }

    return (
        <>
            {siteIsLoading2 ? (
                <YouWhoLoading />
            ) : (
                <Center minHeight="200px" >
                    <Stack role="button" onClick={() => history.push("/activity/who/services")}>
                        <Center mb={2}><Icon as={Io5.IoWarningOutline} fontSize="30px" color="secondary.300" /></Center>
                        <Text align="center">The service you are looking for does not exist.</Text>
                        <Text align="center">Please click here to return to the <Text as="span" color="primary.500" fontWeight="600">My Activity</Text> section.</Text>
                    </Stack>
                </Center>
            )}
        </>
    )
}


function HandleDelete({ destroyMyObject, selectedService }) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    return (
        <>
            <IconButton onClick={onOpen} color="red.300" variant="link" size="sm" ml={1} fontSize="24px" h="24px" w="24px" icon={<Io5.IoTrashBinOutline />} />

            <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen} isCentered >
                <AlertDialogOverlay />

                <AlertDialogContent m={3} borderRadius="lg" p={2} className="bgBlurModal" >
                    <AlertDialogHeader p={4} style={{ display: "flex", alignItems: "center" }}><Icon as={Io5.IoTrashBinOutline} color="red.300" w={6} h={6} mr={2} />Confirm Delete Service</AlertDialogHeader>
                    <AlertDialogCloseButton m={2} />
                    <AlertDialogBody px={6}>
                        Do you want to delete this service?
                    </AlertDialogBody>
                    <AlertDialogFooter p={4}>
                        <Button colorScheme="red" ref={cancelRef} onClick={() => { destroyMyObject(selectedService.id); onClose(); }}>
                            Yes
                        </Button>
                        <Button ml={3} onClick={onClose}>
                            No
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

function PreviewPost({ postValidation, okToPreview, setOkToPreview, postSuccess, category, subCategory, title, description, rate, myLat, myLong, dayTime, serviceLocationChoice, imageUploadSrc, setOkToPost, okToPost, updateService, isUploading }) {

    // eslint-disable-next-line
    const { isOpen, onOpen, onClose } = useDisclosure()
    // const [isDisabled, setIsDisabled] = useState(false);

    // useEffect(() => {
    //     if (subCategory.length > 40 && title.length > 70 && rate.length > 10 && description.length > 1000 && myLat.length > 20 && myLong.length > 20 ) {
    //         setIsDisabled(true);
    //     }
    // },)

    useEffect(() => {
        if (okToPreview === true && okToPost === true && category !== "Click to Choose Category" && category !== "" && title !== "" && rate !== "" && myLat !== "" && myLong !== "") {
            onOpen();
            // updateService();
        }
        // eslint-disable-next-line
    }, [okToPreview])

    return (
        <>
            <Button w="100%" fontSize="lg" px={3} color="secondary.500" bg="secondary.100" _hover={{ bg: "secondary.200" }} _focus={{ bg: "secondary.100" }} _active={{ bg: "secondary.100" }} onClick={postValidation} isLoading={isUploading} isDisabled={false} ><Icon as={VsC.VscOpenPreview} height="28px" width="28px" mr={2} /> Confirm Changes</Button>

            <Modal isOpen={isOpen} size="lg" onClose={postSuccess ? () => { onClose(); window.scrollTo(0, 0); window.location.reload(); } : () => { onClose(); setOkToPreview(false); setOkToPost(true); }} >
                <ModalOverlay />
                <ModalContent minHeight="200px" m={3} borderRadius="xl" p={2} mx={3} mt="10%" className="bgBlurModal" >
                    {postSuccess ? (
                        <>
                            <ModalHeader p={4} fontWeight="400" style={{ display: "flex", alignItems: "center" }}><Icon as={Io5.IoBonfireOutline} color="secondary.300" mr={1} h="24px" w="24px" />Update Success!</ModalHeader>
                            <ModalCloseButton m={3} onClick={() => { onClose(); window.scrollTo(0, 0); window.location.reload(); }} />
                            <ModalBody px={4} id="categoryButtons">
                                Your service post was successfully updated. Click OK to go back to your service.
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="primary" onClick={() => { onClose(); window.scrollTo(0, 0); window.location.reload(); }}>OK</Button>
                            </ModalFooter>
                        </>
                    ) : (
                        <>
                            <ModalHeader p={4} fontWeight="400" style={{ display: "flex", alignItems: "center" }}><Icon as={HiI.HiOutlineBadgeCheck} color="primary.300" mr={1} h="24px" w="24px" />Confirm Changes</ModalHeader>
                            <ModalCloseButton m={3} onClick={() => { onClose(); setOkToPreview(false); setOkToPost(true); }} />
                            <ModalBody px={4} id="categoryButtons">
                                Please confirm you would like to update this existing service.
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="primary" onClick={updateService} mr={2} isLoading={isUploading}>Confirm</Button>
                                <Button onClick={() => { onClose(); setOkToPreview(false); setOkToPost(true); }}>Cancel</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}