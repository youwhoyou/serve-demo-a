import React from 'react'
import { Center, Flex, Text, useColorMode, MenuItem, Icon, Box, Menu, MenuButton, MenuList, Heading } from "@chakra-ui/react";
import YouWhoLogo from "../../media/logo/YouWhoLogo.jsx";
import { NavLink } from 'react-router-dom';
import * as Io5 from "react-icons/io5";
import * as BiI from "react-icons/bi";


export default function Header() {

    const { colorMode } = useColorMode()
    const grayText = colorMode === "light" ? "gray.500" : "gray.400";

    return (
        <Menu>
            {({ isOpen }) => (
                <>
                    <MenuButton>
                        <Flex >
                            <Center opacity={colorMode === "light" ? "1" : "0.9"} >
                                <YouWhoLogo wdth={["40px", "50px", "50px"]} />
                            </Center>
                            <Center px="1" fontSize={[12, 12, 16, 20]} >
                                {isOpen ? <Io5.IoChevronUpOutline /> : <Io5.IoChevronDownOutline />}
                            </Center>
                        </Flex>
                    </MenuButton>
                    <MenuList borderWidth="0" className="bgBlur" pb={6} pt={["2", "6", "", "", ""]}>
                        <Center fontSize="4xl" color={grayText} display={["flex", "none", "", "", ""]} px={4} mb={4}>
                            <NavLink to="/">
                                <Center w="100%" as="span" borderBottom="1px" borderColor="gray.10"><Heading fontSize="2xl" fontWeight="300">youwho</Heading></Center>
                            </NavLink>
                        </Center>
                        <MenuItem mt="2" px={6}>
                            <NavLink to="/" activeStyle={{}} style={{ display: "flex", alignItems: "center" }}>
                                <Icon as={Io5.IoAccessibilityOutline} height="22px" width="22px" mr={2} color="primary.400" /><Heading as="span" fontSize="18px" fontWeight="300">youwho <Box as="span" fontWeight="500">Serve</Box></Heading>
                            </NavLink>
                        </MenuItem>
                        <MenuItem mt="2" px={6} isDisabled={true} style={{ display: "flex", alignItems: "center" }}>
                            <Box role="button" color="grayText">
                                <Icon as={Io5.IoFastFoodOutline} height="22px" width="22px" mr={2} /><Heading as="span" fontSize="18px" fontWeight="300">youwho <Box as="span" fontWeight="500">Eats</Box></Heading>
                            </Box>
                        </MenuItem>
                        <MenuItem mt="2" px={6} isDisabled={true} style={{ display: "flex", alignItems: "center" }}>
                            <Box role="button" color="grayText">
                                <Icon as={Io5.IoHomeOutline} height="22px" width="22px" mr={2} /><Heading as="span" fontSize="18px" fontWeight="300">youwho <Box as="span" fontWeight="500">Stays</Box></Heading>
                            </Box>
                        </MenuItem>
                        <MenuItem mt="2" px={6} isDisabled={true} style={{ display: "flex", alignItems: "center" }}>
                            <Box role="button" color="grayText">
                                <Icon as={Io5.IoCarOutline} height="22px" width="22px" mr={2} /><Heading as="span" fontSize="18px" fontWeight="300">youwho <Box as="span" fontWeight="500">Lifts</Box></Heading>
                            </Box>
                        </MenuItem>
                        <MenuItem mt="2" px={6} isDisabled={true} style={{ display: "flex", alignItems: "center" }}>
                            <Box color="grayText">
                                <Icon as={BiI.BiTimer} height="22px" width="22px" mr={2} /><Heading as="span" fontSize="18px" fontWeight="300">youwho <Box as="span" fontWeight="500">Race</Box></Heading>
                            </Box>
                        </MenuItem>
                        <MenuItem mt="2" px={6} isDisabled={true} style={{ display: "flex", alignItems: "center" }}>
                            <Box color="grayText">
                                <Icon as={Io5.IoPeopleOutline} height="22px" width="22px" mr={2} /><Heading as="span" fontSize="18px" fontWeight="300">youwho <Box as="span" fontWeight="500">Connect</Box></Heading>
                            </Box>
                        </MenuItem>
                    </MenuList>

                </>
            )}
        </Menu>
    )
}

