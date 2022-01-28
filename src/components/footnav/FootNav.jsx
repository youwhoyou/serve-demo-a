import React from 'react';
import { useMoralis } from "react-moralis";
import { Container, Text, Icon, Link, Stack, Flex } from "@chakra-ui/react";
// eslint-disable-next-line
import md5 from 'md5';
import * as BiI from "react-icons/bi";
import * as HiI from "react-icons/hi";
import * as Io5 from "react-icons/io5";

import { NavLink as RouterNavLink, useHistory } from 'react-router-dom';

export default function FootNav() {

    const { user } = useMoralis();
    const history = useHistory();

    if (user && history.location.pathname !== "/") {
        return (
            <Container maxW="md" >
                <Flex justify="space-between" className="bgBlur" color="gray.500" minHeight="61px" pos="fixed" w="100%" bottom="0" left="0" zIndex={2} borderTop="0px" px={3} borderColor="gray.10" display={user ? ["flex", "none", "none", "none"] : "none"}>
                    <Link as={RouterNavLink} to="/newservice" filter="grayscale(1)" activeStyle={{ fontWeight: "bold", color: "#3182CE", filter: "grayscale(0)" }}>
                        <Stack align="center" h="60px" w="60px">
                            <Icon mt={2} h="25px" w="25px" as={HiI.HiOutlinePencilAlt} color="secondary.200" />
                            <Text lineHeight={0.8} fontSize="xs" textAlign="center">New</Text>
                        </Stack>
                    </Link>
                    <Link as={RouterNavLink} to="/activity" filter="grayscale(1)" activeStyle={{ fontWeight: "bold", color: "#ff7e4c", filter: "grayscale(0)" }}>
                        <Stack align="center" h="60px" w="60px">
                            <Icon mt={2} h="25px" w="25px" as={Io5.IoReaderOutline} color="primary.300" />
                            <Text lineHeight={0.8} fontSize="xs">Activity</Text>
                        </Stack>
                    </Link>
                    <Link as={RouterNavLink} to="/chat" filter="grayscale(1)" activeStyle={{ fontWeight: "bold", color: "#ff7e4c", filter: "grayscale(0)" }}>
                        <Stack align="center" h="60px" w="60px">
                            <Icon mt={2} h="28px" w="28px" as={Io5.IoChatboxEllipsesOutline} color="teal.300" />
                            <Text lineHeight={0.5} fontSize="xs">Chat</Text>
                        </Stack>
                    </Link>
                    <Link as={RouterNavLink} to="/wallet" filter="grayscale(1)" activeStyle={{ fontWeight: "bold", color: "#3182CE", filter: "grayscale(0)" }}>
                        <Stack align="center" h="60px" w="60px">
                            <Icon mt={2} h="25px" w="25px" as={Io5.IoWalletOutline} color="primary.400" />
                            <Text lineHeight={0.8} fontSize="xs">Wallet</Text>
                        </Stack>
                    </Link>
                    <Link as={RouterNavLink} to="/account" filter="grayscale(1)" activeStyle={{ fontWeight: "bold", color: "#ff7e4c", filter: "grayscale(0)" }}>
                        <Stack align="center" h="60px" w="60px">
                            <Icon mt={2} h="25px" w="25px" as={BiI.BiUserCircle} color="blue.500" />
                            <Text lineHeight={0.8} fontSize="xs">Account</Text>
                        </Stack>
                    </Link>
                </Flex>
            </Container>
        )
    }

    return (<></>)
}

// isActive={() => {['/activity', '/activity/you', '/activity/who'].includes(history.location.pathname)}} 