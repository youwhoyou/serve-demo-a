import React from 'react';
import { Box, Text, Center, Stack, Spinner, Flex, Image, Icon, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Select, Spacer, Container } from "@chakra-ui/react";
import { Link as RouterLink, } from 'react-router-dom';
import YouWhoLogo from "../../media/logo/YouWhoLogo.jsx";
import Header from '../header/Header';
// import * as FaI from "react-icons/fa";
import * as BiI from "react-icons/bi";
// import * as BsI from "react-icons/bs";
import * as AiI from "react-icons/ai";
import * as RiI from "react-icons/ri";
import ErrorDialog from '../error/ErrorDialog';
import YouWhoLoading from '../misc/YouWhoLoading';



export default function SearchResults({ history, colorMode, who, siteIsLoading, query, category, title, queryResults, setSortResults, showAlert, setShowAlert, newServiceError, grayText, grayText2, noSearchResults, setViewService }) {


    return (
        <>
            <Header bgSearch={[colorMode === "light" ? "gray.50" : "gray.900", "none", "", ""]} />
            <Box p={[0, 4, 6, 8]} minHeight="100%">
                <Container minHeight={["91vh", "200px", "", ""]} maxW="lg" borderRadius={["0", "xl", "xl", "xl"]} px={[4, 6, "", ""]} pb={[4, 6, "", ""]} pt={[1, 5, "", ""]} mb={["60px", "0", "", ""]} > {/* pt={[4, 6, "", ""]} */}

                    <Box pb={2}>
                        <Text fontWeight="400" fontSize="3xl" ml={1} color={grayText2}><Icon as={AiI.AiOutlineFileSearch} color="primary.300" mb={1} mr={2} />Service Search</Text>
                    </Box>
                    <Stack spacing="3">
                        {siteIsLoading ? (
                            <YouWhoLoading />
                        ) : (
                            <>
                                {showAlert && (<ErrorDialog title={newServiceError[0]} message={newServiceError[1]} showAlert={showAlert} setShowAlert={setShowAlert} />)}
                                <Flex align="center" justify="space-between">
                                    {query ? (
                                        <Breadcrumb color="grayText" textTransform="lowercase" className="searchBreadcrumb" spacing="7px" separator={<BiI.BiChevronRight opacity="0.85" />}>
                                            <BreadcrumbItem >
                                                <BreadcrumbLink as={RouterLink} to={`/search/${query}`} >{query}</BreadcrumbLink>
                                            </BreadcrumbItem>

                                            {category &&
                                                <BreadcrumbItem >
                                                    <BreadcrumbLink as={RouterLink} to={`/search/${query}/${category}`} >{category}</BreadcrumbLink>
                                                </BreadcrumbItem>
                                            }

                                            {title &&
                                                <BreadcrumbItem >
                                                    <BreadcrumbLink as={RouterLink} to={`/search/${query}/${category}/${title}`} >{title}</BreadcrumbLink>
                                                </BreadcrumbItem>
                                            }
                                        </Breadcrumb>
                                    ) : (
                                        <Breadcrumb color="grayText" textTransform="lowercase" className="searchBreadcrumb" spacing="7px" separator={<BiI.BiChevronRight opacity="0.85" />}>
                                            <BreadcrumbItem >
                                                <BreadcrumbLink as={RouterLink} to={`/search/${query}`} >{queryResults.length > 0 ? ((who !== null && who !== "") && (query === null || query === "") ? <>services by <strong>{who}</strong></> : "wildcard search") : <em>No services found</em>}</BreadcrumbLink>
                                            </BreadcrumbItem>
                                        </Breadcrumb>

                                    )}

                                    <Spacer />

                                    <Select id="sortSelect" placeholder="Sort" isDisabled={!queryResults.length > 0 ? true : false} borderRadius="base" bg="gray.5" w="max-content" size="sm" variant="filled" onChange={(e) => { setSortResults(e.target.value) }}>
                                        <option value="nearest">Closest</option>
                                        <option value="rateDesc">&#65284; p/hr &#8681;</option>
                                        <option value="rateAsc">&#65284; p/hr &#8679;</option>
                                        <option value="reviewDesc">Rating &#9734; &#8681;</option>
                                        <option value="reviewAsc">Rating &#9734; &#8679;</option>
                                        <option value="newest">Newest</option>
                                        <option value="oldest">Oldest</option>
                                    </Select>
                                </Flex>

                                {queryResults.length > 0 ? (
                                    queryResults.map((x, i) => {
                                        return (
                                            <Flex role="button" onClick={() => { setViewService(x); history.push(`/search/view/${x.id}`); window.scrollTo(0, 0); }} id={x.id} key={"Box" + i} bg="gray.5" borderRadius="md" overflow="hidden" align="center">
                                                <Box id={"flex1" + i} key={"flex1" + i} minWidth={["29vw", "120px", ""]} minHeight={["29vw", "120px", ""]} >
                                                    {x.attributes.service_img1 ? (
                                                        <Image id={"img1" + i} key={"img1" + i} w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} objectFit="cover" src={x.attributes.service_img1._url} fallback={<Center w={["29vw", "120px", ""]} h={["29vw", "120px", ""]}><Spinner /></Center>} borderLeftRadius="md" />
                                                    ) : (
                                                        <Center filter="grayscale(1)" bg="gray.5" key={"logo" + i} w={["29vw", "120px", ""]} h={["29vw", "120px", ""]} >
                                                            <YouWhoLogo opacity="0.15" wdth={["40%", "", ""]} />
                                                        </Center>
                                                    )}
                                                </Box>
                                                <Box textAlign="left" px={3} py={0} maxHeight={["29vw", "120px", ""]} overflow="hidden">
                                                    <Text id={"title" + i} key={"title" + i} fontWeight="500" textTransform="capitalize" fontSize="sm">{x.attributes.title}</Text>
                                                    <Box overflow="hidden" h="20px">
                                                        <Text id={"category" + i} key={"category" + i} color={grayText} textTransform="capitalize" fontSize="xs">{x.attributes.category} {x.attributes.subCategory ? <Text as="span">&bull;</Text> : ""} {x.attributes.subCategory}</Text>
                                                    </Box>
                                                    <Text id={"rate" + i} key={"rate" + i} color="primary.500" fontSize="xl" fontWeight="500" mt={["0", "0", "", ""]} lineHeight={["13px", "20px", "", ""]}><Text as="span" fontSize="md">$</Text>{x.attributes.rate}<Text as="span" fontSize="xs" color={grayText}> USD/hr. {x.distance ? <>&bull; <Icon as={RiI.RiRoadMapLine} pb="3px" color="secondary.300" /> {x.attributes.serviceLocationChoice === "global" ? <>Global</> : <>{x.distance} km</>}</> : <>&bull; <Icon as={RiI.RiRoadMapLine} mb="3px" color="gray.500" /> <em>enable GPS</em></>}</Text></Text>
                                                </Box>
                                            </Flex>
                                        )
                                    })
                                ) : (
                                    <>
                                        {noSearchResults}
                                    </>
                                )}

                            </>
                        )}
                    </Stack>
                </Container>
            </Box>
        </>
    )
}
