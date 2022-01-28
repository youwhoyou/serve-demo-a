import React from 'react';
import { IconButton, useColorMode } from "@chakra-ui/react";
import * as FiI from 'react-icons/fi';


export default function ThemeToggler({...props}) {

    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <IconButton onClick={toggleColorMode} bg="gray.10" {...props} icon={colorMode === "light" ? <FiI.FiMoon /> : <FiI.FiSun />} />
    )
}
