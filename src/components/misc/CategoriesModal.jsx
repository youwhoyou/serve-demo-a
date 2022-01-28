import React from 'react';
import { Button, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, Wrap } from '@chakra-ui/react';
import jobCategoriesArray from './jobCategoriesArray';
import * as HiI from "react-icons/hi";


function CategoriesModal({ variant, setCategory, category, padding, fontWeight, color, bg, _hover, _focus, _active, isDisabled, fSz }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef();

    const jobCategoriesArr = jobCategoriesArray;

    const categoriesList = React.useCallback(() => {
        // Declare variables
        var input, filter, ul, li, i, txtValue;
        input = document.getElementById('searchCategories');
        filter = input.value.toUpperCase();
        ul = document.getElementById("categoryButtons");
        li = ul.getElementsByTagName('button');

        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
            txtValue = li[i].textContent || li[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }, []);

    return (
        <>
            <Button onClick={isDisabled ? () => { } : onOpen} p={padding} fontSize={fSz} variant={variant} fontWeight={fontWeight} color={color} bg={bg} _hover={_hover} _focus={_focus} _active={_active}>{category}</Button>

            <Modal isOpen={isOpen} size="lg" onClose={onClose} initialFocusRef={initialRef}>
                <ModalOverlay />
                <ModalContent minHeight="200px" borderRadius="xl" p={2} mx={3} mt="10%" className="bgBlurModal">
                    <ModalHeader p={4} fontWeight="400" style={{ display: "flex", alignItems: "center" }}><Icon as={HiI.HiOutlineBadgeCheck} color="primary.400" mr={1} h="24px" w="24px" />Select Service Category</ModalHeader>
                    <ModalCloseButton m={3} />
                    <ModalBody px={4} id="categoryButtons">
                        <Input type="text" id="searchCategories" ref={initialRef} onChange={categoriesList} placeholder="Search for category..." />
                        <Wrap px={2} py={4}>
                            {jobCategoriesArr.map((x, i) => {
                                return (
                                    <Button size="sm" m={2} overflow="hidden" onClick={() => { setCategory(x); onClose(); }} key={i}>{x}</Button>
                                )
                            })}
                        </Wrap>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}


export default React.memo(CategoriesModal);