import React from 'react';
import Logo from "./Logo";
import { Center } from "@chakra-ui/react";
import SearchBox from './SearchBox';
import AccountMenu from './AccountMenu';


export default function NavBarMain(props) {


    return (
        <Center w="100%" py={["2", "2", "3", "4"]} px={["2", "4", "6", "8"]} bg={props.bgSearch} >
            <Logo />
            <SearchBox {...props} />
            <AccountMenu />
        </Center>
    )
}