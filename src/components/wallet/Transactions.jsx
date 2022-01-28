import React from 'react';
import { useParams } from 'react-router-dom';
import { useTransType } from '../../hooks/useTransType';
import Paginator from './Paginator';
import TransResults from './TransResults';
import {Box} from "@chakra-ui/react";


export default function Transactions({}) {
    const { address } = useParams();
    const { methodName, postProcess } = useTransType();

    if (!address) {
        return null;
    }

    return (
        <Box id="main-app" className="container-fluid who-bg h-100 px-0 pb-5" style={{ minHeight: "100vh" }} >
            <Paginator methodName={methodName} userAddress={address} options={{ postProcess }} >
                <TransResults />
            </Paginator>
        </Box>
    )
}
