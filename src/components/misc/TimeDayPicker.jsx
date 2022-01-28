import React, { useEffect, useContext, useState } from 'react';
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

    // console.log("dayTime",dayTime);
    // console.log("dayTimeLocal",dayTimeLocal);
    // console.log("dayTimeSaved",dayTimeSaved);

    useEffect(() => {

        (async () => {
            try {
                if (dayTime && dayTime[0] && dayTime[0].day !== "") {

                    const dayTimeLocalArray = [];

                    for (let i = 0; i < dayTime.length; i++) {

                        let x = dayTime[i];

                        x.day = Number(x.day);
                        // console.log(i, "x.day", x.day, "x.from", x.from, "x.adjFrom", x.adjFrom, "x.to", x.to, "x.adjTo", x.adjTo);

                        let dayLocal, fromLocal, adjFromLocal, toLocal, adjToLocal, getLocalFromTime, getLocalToTime;

                        getLocalFromTime = await Moralis.Cloud.run("timeFromUTC", { time: x.from, offset: [selectedTimezone.offset] });
                        fromLocal = String(getLocalFromTime.time);

                        getLocalToTime = await Moralis.Cloud.run("timeFromUTC", { time: x.to, offset: [selectedTimezone.offset] });
                        toLocal = String(getLocalToTime.time);

                        fromLocal = String(getLocalFromTime.time);
                        toLocal = String(getLocalToTime.time);

                        // console.log(i, "l.day", "?", "l.from", String(getLocalFromTime.time), "l.adjFrom", getLocalFromTime.adj, "l.to", String(getLocalToTime.time), "l.adjTo", getLocalToTime.adj);

                        if (getLocalFromTime.adj === -1) {

                            if (x.day + getLocalFromTime.adj === 0) {
                                dayLocal = 7;
                                adjFromLocal = x.adjFrom;
                                adjToLocal = x.adjTo + getLocalToTime.adj - getLocalFromTime.adj;
                            } else if (x.day < 10) {
                                dayLocal = x.day + getLocalFromTime.adj;
                                adjFromLocal = x.adjFrom;
                                adjToLocal = x.adjTo + getLocalToTime.adj - getLocalFromTime.adj;
                            } else {
                                dayLocal = x.day;
                                adjFromLocal = x.adjFrom + getLocalFromTime.adj;
                                adjToLocal = x.adjTo + getLocalToTime.adj;
                            }

                        } else if (getLocalFromTime.adj === 1) {

                            if (x.day + getLocalFromTime.adj === 8) {
                                dayLocal = 1;
                                adjFromLocal = x.adjFrom;
                                adjToLocal = x.adjTo + getLocalToTime.adj - getLocalFromTime.adj;
                            } else if (x.day < 10) {
                                dayLocal = x.day + getLocalFromTime.adj;
                                adjFromLocal = x.adjFrom;
                                adjToLocal = x.adjTo + getLocalToTime.adj - getLocalFromTime.adj;
                            } else {
                                dayLocal = x.day;
                                adjFromLocal = x.adjFrom + getLocalFromTime.adj;
                                adjToLocal = x.adjTo + getLocalToTime.adj;
                            }

                        } else {

                            if (x.day < 10) {
                                dayLocal = x.day + getLocalFromTime.adj;
                                adjFromLocal = x.adjFrom;
                                adjToLocal = x.adjTo + getLocalToTime.adj - getLocalFromTime.adj;
                            } else {
                                dayLocal = x.day;
                                adjFromLocal = x.adjFrom + getLocalFromTime.adj;
                                adjToLocal = x.adjTo + getLocalToTime.adj;
                            }
                        }

                        dayTimeLocalArray[i] = { day: dayLocal, from: fromLocal, adjFrom: adjFromLocal, to: toLocal, adjTo: adjToLocal };

                    };
                    // console.log("dayTimes use", dayTime);
                    setDayTimeLocal(dayTimeLocalArray);
                }
            } catch (error) {
                setNewServiceError(["Error Updating Availibility", "Please refresh the page and try again."]);
                setShowAlert(true);
                console.log(error);
            }
        })();
        // eslint-disable-next-line
    }, [dayTime])

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
    }

    // console.log("12");
    // console.log("22:00",timeFromUTC("22:00", 12))
    // console.log("15:00",timeFromUTC("15:00", 12))
    // console.log(timeToUTC("05:00", 7))
    // console.log(timeToUTC("22:00", 7))
    // console.log("-12");
    // console.log("21:00",timeFromUTC("21:00", -12))
    // console.log("05:00",timeFromUTC("05:00", -12))
    // console.log(timeToUTC("09:00", -7))
    // console.log(timeToUTC("17:00", -7))

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
                        adjFromUTC = x.adjFrom + getUTCFromTime.adj;
                        adjToUTC = x.adjTo + getUTCFromTime.adj;
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
                        adjFromUTC = x.adjFrom + getUTCFromTime.adj;
                        adjToUTC = x.adjTo + getUTCFromTime.adj;
                    }

                } else {

                    if (x.day < 10) {
                        dayUTC = x.day + getUTCFromTime.adj;
                        adjFromUTC = x.adjFrom;
                        adjToUTC = x.adjTo + getUTCToTime.adj - getUTCFromTime.adj;
                    } else {
                        dayUTC = x.day;
                        adjFromUTC = x.adjFrom + getUTCFromTime.adj;
                        adjToUTC = x.adjTo + getUTCFromTime.adj;
                    }
                }

                dayTimeUTCArray[i] = { day: dayUTC, from: fromUTC, adjFrom: adjFromUTC, to: toUTC, adjTo: adjToUTC };
            })();
        };

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
        console.log("v", value, "i", index)
        value = value === "" ? "00:00" : value;
        const arr = dayTimeLocal.slice();
        console.log("arr", arr);
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
                        <Select key={"select" + i} id={"selectDayTime" + i} width="max-content" placeholder="Select" value={x.day} isDisabled={disableEdit} variant="unstyled" onChange={(e) => handleWeekday(Number(e.target.value), (i))}>
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
