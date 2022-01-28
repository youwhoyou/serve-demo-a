import React, { useContext, useEffect } from 'react';
import { Flex, Input, InputGroup, InputRightElement, IconButton, useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalCloseButton, ModalBody, FormControl, FormLabel, useColorMode, Icon } from '@chakra-ui/react';
import * as AiI from "react-icons/ai";
import { useHistory, useLocation } from 'react-router-dom';
import { SiteStateContext } from "../context/SiteStateContext";


export default function SearchBox(props) {

    const history = useHistory();
    const location = useLocation();
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const query = searchParams.get('query');
    const { siteIsLoading, setSiteIsLoading, searchQuery, setSearchQuery } = useContext(SiteStateContext);

    const { colorMode } = useColorMode();
    const finalRef = React.useRef();

    const handleSearch = () => {
        setSiteIsLoading(true);
        history.push(`/search?query=${searchQuery}`);
    }

    // console.log("query from searchbox: ", query)
    // console.log(history.location.pathname)

    useEffect(() => {
        if (document.getElementById("main-search").value === "" && query) {
            setSearchQuery(query);
        }
        // eslint-disable-next-line
    }, [query])

    return (
        <Flex flexGrow="1" justify="flex-end" align="center" opacity={colorMode === "light" ? "1" : "0.9"} ml={3} >
            <InputGroup id="main-search-group" maxWidth="400px" pl={[0, 3, 3]} h={["40px", "40px", "40px"]}>
                <Input id="main-search" ref={finalRef} isDisabled={siteIsLoading} onKeyPress={e => e.key === 'Enter' ? handleSearch() : null} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} fontSize={["16px", "16px"]} variant="filled" size={["sm", "md", "md"]} borderRadius={["md", "md", "md"]} pl="3" bg={colorMode === "light" ? "white" : "gray.10"} placeholder="Search services" isInvalid={false} errorBorderColor="crimson" focusBorderColor="secondary.200" />
                <InputRightElement width={["40px", "40px", "40px"]} h={["40px", "40px", "40px"]} >
                    <IconButton isLoading={siteIsLoading} onClick={handleSearch} minWidth={["40px", "40px", "40px"]} h={["40px", "40px", "40px"]} borderRadius={["md", "md", "md"]} borderLeftRadius={["0", "0", "0"]} fontSize={["24px", "24px", "24px"]} icon={<AiI.AiOutlineSearch />} color="secondary.500" bg="secondary.100" _hover={{ bg: "secondary.200" }} />
                </InputRightElement>
            </InputGroup>
            <FilterSearch finalRef={finalRef} location={location} siteIsLoading={siteIsLoading} />
        </Flex>
    )
}

function FilterSearch({ finalRef, location, siteIsLoading }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef();

    return (
        <>
            <IconButton ml="2" isLoading={siteIsLoading} d={location.pathname === "/search" ? "inline-flex" : "none"} onClick={onOpen} minWidth={["39px", "40px", "40px"]} width={["39px", "40px", "40px"]} h={["39px", "40px", "40px"]} borderRadius={["md", "md", "md"]} fontSize={["25px", "26px", "26px"]} icon={<AiI.AiOutlineExperiment />} color="third.600" bg="third.200" _hover={{ bg: "third.300" }} />
            <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose} >
                <ModalOverlay />
                <ModalContent minHeight="200px" borderRadius="xl" p={2} mx={3} mt="10%" className="bgBlurModal" >
                    <ModalHeader p={4} fontWeight="400" fontSize="1em" style={{ display: "flex", alignItems: "center" }}><Icon as={AiI.AiOutlineExperiment} fontSize="1em" size="s" color="primary.400" mr={1} h="24px" w="24px" />Filter Search Results</ModalHeader>
                    <ModalCloseButton m={3} />
                    <ModalBody px={4} id="searchFilters">
                        To be added later
                    </ModalBody>
                    <ModalFooter p={4}>
                        <Button colorScheme="primary" onClick={onClose} mr={3}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}