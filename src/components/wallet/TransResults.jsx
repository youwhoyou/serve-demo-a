import React from 'react';
import { useTransType } from '../../hooks/useTransType';
import { useResultContext } from './Paginator';
import { Box, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, } from "@chakra-ui/react";


export default function TransResults() {

    const { results } = useResultContext();
    const { cols } = useTransType();
    if (!results || !cols) { return null };
    console.log("results: ", results);

    return (
        <Box className="table-responsive p-2 mb-2 mh-500">
            <Table className="table">
                <Thead>
                    <Tr>
                        {cols.map((col) => (
                        <Th scope="col" key={col.colName}>
                            {col.colName}
                        </Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {results.map((arrToMap, yIndex) => (
                        <Tr key={yIndex}>
                            {cols.map((col) => {
                                return (
                                    <Td key={col.colName}>{arrToMap[col.key]}</Td>
                                )
                            })}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    )
};
