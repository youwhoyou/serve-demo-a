import React, { useState } from 'react';
import { Box, IconButton, AlertIcon, AlertTitle, Alert, AlertDescription } from '@chakra-ui/react';
import * as MdI from 'react-icons/md';

export default function ErrorBox({title, message }) {

    const [showAlert, setShowAlert] = useState("flex");

    return (
        <Alert display={showAlert} status="error" borderRadius="md" mb={2}>
            <AlertIcon />
            <Box flex="1" textAlign="left">
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription display="block">
                    {message}
                </AlertDescription>
            </Box>
            <IconButton icon={<MdI.MdClose />} variant="link" position="absolute" right="-2px" top="8px" onClick={() => setShowAlert("none")} />
        </Alert>
    )
}
