import React, { useContext, useState } from 'react';
import { Select, Flex, Input, Text, Button, Stack, IconButton, Icon } from '@chakra-ui/react';
import ErrorDialog from "../error/ErrorDialog";
import { SiteStateContext } from '../context/SiteStateContext';
import * as Io5 from "react-icons/io5";
import * as TiI from "react-icons/ti";
import Moralis from "moralis";



export default function TimeDayPicker({ disableEdit, dayTime, setDayTime }) {

    const [showAlert, setShowAlert] = useState(false);
    const [newServiceError, setNewServiceError] = useState([]);
    const [dayTimeLocal, setDayTimeLocal] = useState([{ day: "", from: "", adjFrom: 0, to: "", adjTo: 0 }])
    const [dayTimeSaved, setDayTimeSaved] = useState(false);
    const { selectedTimezone } = useContext(SiteStateContext);


    // console.log("dayTimeLocal", dayTimeLocal);
    // console.log("dayTimess", dayTime);

    const handleAddTimeDay = () => {
        const arr = dayTimeLocal.slice();
        if (arr.length <= 13) {
            arr.push({ day: "", from: "", adjFrom: 0, to: "", adjTo: 0 });
            setDayTimeLocal(arr);
            setDayTimeSaved(false);
            // setTimeDayArray(arr);
        } else {
            setNewServiceError(["Max. Day Time Reached", "Too many instances of Day and Time, max. 13 allowed."]);
            setShowAlert(true);
        }
    }

    const handleRemoveTimeDay = () => {
        let arr = dayTimeLocal.slice();
        if (arr.length > 1) {
            arr.pop();
        } else {
            arr = [{ day: "", from: "", adjFrom: 0, to: "", adjTo: 0 }];
        };
        setDayTimeLocal(arr);
        setDayTimeSaved(false);
        // setTimeDayArray(arr);
    }

    const handleSaveTimeDay = () => {

        for (let i = 0; i < dayTimeLocal.length; i++) {
            if (dayTimeLocal[i].day === "" || dayTimeLocal[i].from === "" || dayTimeLocal[i].to === "") {
                setNewServiceError(["Complete All Fields", "Some time fields have not be completed, please complete all fields and try saving again."]);
                setShowAlert(true);
                return;
            }
        }

        const dayTimeUTCArray = [];

        for (let i = 0; i < dayTimeLocal.length; i++) {

            let x = dayTimeLocal[i];

            (async () => {
                x.day = Number(x.day);
                // console.log(i, "x.day", x.day, "x.from", x.from, "x.adjFrom", x.adjFrom, "x.to", x.to, "x.adjTo", x.adjTo);

                let dayUTC, fromUTC, adjFromUTC, toUTC, adjToUTC, getUTCFromTime, getUTCToTime;

                getUTCFromTime = await Moralis.Cloud.run("timeToUTC", { time: x.from, offset: [selectedTimezone.offset] });
                fromUTC = String(getUTCFromTime.time);

                getUTCToTime = await Moralis.Cloud.run("timeToUTC", { time: x.to, offset: [selectedTimezone.offset] });
                toUTC = String(getUTCToTime.time);

                // console.log(i, "u.day", "?", "u.from", String(getUTCFromTime.time), "u.adjFrom", getUTCFromTime.adj, "u.to", String(getUTCToTime.time), "u.adjTo", getUTCToTime.adj);

                if (getUTCFromTime.adj === -1) {

                    if (x.day + getUTCFromTime.adj === 0) {
                        dayUTC = 7;
                        adjFromUTC = x.adjFrom;
                        adjToUTC = x.adjTo + getUTCToTime.adj - getUTCFromTime.adj;
                    } else if (x.day < 10) {
                        dayUTC = x.day + getUTCFromTime.adj;
                        adjFromUTC = x.adjFrom;
                        adjToUTC = x.adjTo + getUTCToTime.adj - getUTCFromTime.adj;
                    } else {
                        dayUTC = x.day;
                        adjFromUTC = getUTCFromTime.adj;
                        adjToUTC = getUTCToTime.adj;
                    }

                } else if (getUTCFromTime.adj === 1) {

                    if (x.day + getUTCFromTime.adj === 8) {
                        dayUTC = 1;
                        adjFromUTC = x.adjFrom;
                        adjToUTC = x.adjTo + getUTCToTime.adj - getUTCFromTime.adj;
                    } else if (x.day < 10) {
                        dayUTC = x.day + getUTCFromTime.adj;
                        adjFromUTC = x.adjFrom;
                        adjToUTC = x.adjTo + getUTCToTime.adj - getUTCFromTime.adj;
                    } else {
                        dayUTC = x.day;
                        adjFromUTC = getUTCFromTime.adj;
                        adjToUTC = getUTCToTime.adj;
                    }

                } else {

                    if (x.day < 10) {
                        dayUTC = x.day + getUTCFromTime.adj;
                        adjFromUTC = x.adjFrom;
                        adjToUTC = x.adjTo + getUTCToTime.adj - getUTCFromTime.adj;
                    } else {
                        dayUTC = x.day;
                        adjFromUTC = getUTCFromTime.adj;
                        adjToUTC = getUTCToTime.adj;
                    }
                }

                dayTimeUTCArray[i] = { day: dayUTC, from: fromUTC, adjFrom: adjFromUTC, to: toUTC, adjTo: adjToUTC };

            })();
        }

        setDayTime(dayTimeUTCArray);
        setDayTimeSaved(true);

    }

    function handleWeekday(value, index) {
        value = value === 0 ? "" : Number(value);
        const arr = dayTimeLocal.slice();
        arr[index].day = value;
        setDayTimeLocal(arr);
        setDayTimeSaved(false);
    }

    function handleTimeFrom(value, index) {
        value = value === "" ? "00:00" : value;
        const arr = dayTimeLocal.slice();
        arr[index].from = value;
        setDayTimeLocal(arr);
        setDayTimeSaved(false);
    }

    function handleTimeTo(value, index) {
        value = value === "" ? "00:00" : value;
        const arr = dayTimeLocal.slice();
        if (value > String(arr[index].adjFrom + arr[index].from)) {
            arr[index].to = value;
            setDayTimeLocal(arr);
        } else {
            setNewServiceError(["End Time Too Small", "End time must be greater than start time."]);
            setShowAlert(true);
        };
        setDayTimeSaved(false);
    }



    return (
        <>
            <Stack spacing="0">
                {dayTimeLocal.map((x, i) => (
                    <Flex height="32px" key={"flex" + i} align="center" justify="space-between">
                        <Select key={"select" + i} id={"selectDayTime" + i} width="max-content" value={x.day} isDisabled={disableEdit} variant="unstyled" placeholder="Select" onChange={(e) => handleWeekday(Number(e.target.value), (i))}>
                            <option key={"everyday" + i} value={11}>Everyday</option>
                            <option key={"weekday" + i} value={12}>Weekdays</option>
                            <option key={"weekend" + i} value={13}>Weekends</option>
                            <option key={"sunday" + i} value={1}>Sunday</option>
                            <option key={"monday" + i} value={2}>Monday</option>
                            <option key={"tuesday" + i} value={3}>Tuesday</option>
                            <option key={"wednesday" + i} value={4}>Wednesday</option>
                            <option key={"thursday" + i} value={5}>Thursday</option>
                            <option key={"friday" + i} value={6}>Friday</option>
                            <option key={"saturday" + i} value={7}>Saturday</option>
                        </Select>
                        <Text>{x.adjFrom === -1 ? "-" : (x.adjFrom === 0 ? "" : "+")}</Text><Input key={"from" + i} id={"dayTimeFrom" + i} className="timeFromTo" isDisabled={disableEdit} value={x.from} type="time" width="max-content" variant="unstyled" onChange={(e) => handleTimeFrom(e.target.value, i)} />
                        <Text key={"colon" + i} mx={2}>:</Text><Text>{x.adjTo === -1 ? "-" : (x.adjTo === 0 ? "" : "+")}</Text><Input key={"to" + i} className="timeFromTo" isDisabled={disableEdit} value={x.to} type="time" width="max-content" variant="unstyled" onChange={(e) => handleTimeTo(e.target.value, i)} />
                    </Flex>
                ))}
            </Stack>
            {!disableEdit &&
                <Flex justify="flex-end" px={1} align="center">
                    {/* <Button size="sm" borderRadius="base" h="32px" w="32px" fontSize="20px" onClick={setDayTimeForService} mr={2}>+</Button> */}
                    <Text color="green.300" as="i" display={dayTimeSaved ? "block" : "none"} fontSize="13px" mr={3}><Icon as={TiI.TiTick} fontSize="16px" mb="3px" />saved</Text>
                    <IconButton size="sm" colorScheme="yellow" borderRadius="base" h="32px" w="32px" fontSize="18px" icon={<Io5.IoSaveOutline />} onClick={handleSaveTimeDay} mr={2} />
                    <Button size="sm" borderRadius="base" h="32px" w="32px" fontSize="20px" onClick={handleAddTimeDay} mr={2}>+</Button>
                    <Button size="sm" borderRadius="base" h="32px" w="32px" fontSize="25px" onClick={handleRemoveTimeDay}>-</Button>
                </Flex>
            }
            {showAlert && (<ErrorDialog title={newServiceError[0]} message={newServiceError[1]} showAlert={showAlert} setShowAlert={setShowAlert} />)}
        </>
    )
}
