import React from 'react';
import { Center, Stack, Text, Spinner, useColorMode, Heading } from '@chakra-ui/react';
import YouWhoLogo from "../../media/logo/YouWhoLogo.jsx";


export default function YouWhoLoading() {

    const { colorMode } = useColorMode();

    return (
        <Center h="100vw" maxHeight="300px">
            <Stack align="center" spacing="5">
                <Stack spacing="0">
                    <Center opacity={colorMode === "light" ? "1" : "0.9"} >
                        <YouWhoLogo className="youwho-logo" wdth="80px" />
                    </Center>
                    <Center>
                        <Heading fontSize="30px" color="gray.500" className="logo-font">youwho</Heading>
                    </Center>
                </Stack>
                <Spinner size="xl" color="primary.300" />
                <Text>Please wait...</Text>
            </Stack>
        </Center>
    )
}
