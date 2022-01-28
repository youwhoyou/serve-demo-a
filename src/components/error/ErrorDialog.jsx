import React, { useEffect, useRef } from 'react';
import { Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, useDisclosure, Icon } from '@chakra-ui/react';
import * as Io5 from 'react-icons/io5';

export default function ErrorDialog({ title, message, showAlert, setShowAlert }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    useEffect(() => {
        if (showAlert) {
            onOpen();
        }
        // eslint-disable-next-line
    }, [showAlert])

    return (
        <>
            <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen} isCentered >
                <AlertDialogOverlay />

                <AlertDialogContent m={3} borderRadius="lg" p={2} className="bgBlurModal" >
                    <AlertDialogHeader p={4} style={{ display: "flex", alignItems: "center" }}><Icon as={Io5.IoWarningOutline} w={6} h={6} mr={2} color="crimson" />{title}</AlertDialogHeader>
                    <AlertDialogCloseButton m={2} onClick={() => { onClose(); setShowAlert(false) }} />
                    <AlertDialogBody px={6}>
                        {message}
                    </AlertDialogBody>
                    <AlertDialogFooter p={4}>
                        <Button colorScheme="red" ref={cancelRef} onClick={() => { onClose(); setShowAlert(false) }} >
                            OK
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}