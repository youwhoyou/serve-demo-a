import React, { useEffect, useContext, useState } from 'react';
import { Flex, Text, Stack } from '@chakra-ui/react';
import ErrorDialog from "../error/ErrorDialog";
import { SiteStateContext } from '../context/SiteStateContext';
import Moralis from "moralis";



export default function TimeDayPicker({ dayTime }) {

    const [showAlert, setShowAlert] = useState(false);
    const [newServiceError, setNewServiceError] = useState([]);
    const [dayTimeLocal, setDayTimeLocal] = useState([{ day: "", from: "", adjFrom: 0, to: "", adjTo: 0, dayName: "" }])
    const { selectedTimezone } = useContext(SiteStateContext);


    useEffect(() => {

        (async () => {
            try {
                if (dayTime && dayTime[0].day !== "") {

                    const dayTimeLocalArray = [];

                    for (let i = 0; i < dayTime.length; i++) {

                        let x = dayTime[i];

                        x.day = Number(x.day);

                        let dayLocal, fromLocal, adjFromLocal, toLocal, adjToLocal, getLocalFromTime, getLocalToTime;

                        getLocalFromTime = await Moralis.Cloud.run("timeFromUTC", { time: x.from, offset: [selectedTimezone.offset] });
                        fromLocal = String(getLocalFromTime.time);

                        getLocalToTime = await Moralis.Cloud.run("timeFromUTC", { time: x.to, offset: [selectedTimezone.offset] });
                        toLocal = String(getLocalToTime.time);

                        fromLocal = String(getLocalFromTime.time);
                        toLocal = String(getLocalToTime.time);

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

                        let dayNameLocal;

                        switch (Number(dayLocal)) {
                            case 11:
                                dayNameLocal = "Everyday"
                                break;
                            case 12:
                                dayNameLocal = "Weekdays"
                                break;
                            case 13:
                                dayNameLocal = "Weekends"
                                break;
                            case 1:
                                dayNameLocal = "Sunday"
                                break;
                            case 2:
                                dayNameLocal = "Monday"
                                break;
                            case 3:
                                dayNameLocal = "Tuesday"
                                break;
                            case 4:
                                dayNameLocal = "Wednesday"
                                break;
                            case 5:
                                dayNameLocal = "Thursday"
                                break;
                            case 6:
                                dayNameLocal = "Friday"
                                break;
                            case 7:
                                dayNameLocal = "Saturday"
                                break;
                            default:
                                dayNameLocal = ""
                        };

                        dayTimeLocalArray[i] = { day: dayLocal, from: fromLocal, adjFrom: adjFromLocal, to: toLocal, adjTo: adjToLocal, dayName: dayNameLocal };

                    };
                    setDayTimeLocal(dayTimeLocalArray);
                }
            } catch (error) {
                setNewServiceError(["Error Getting Availability", "Please refresh the page and try again."]);
                setShowAlert(true);
                console.log(error);
            }
        })();
        // eslint-disable-next-line
    }, [dayTime])


    return (
        <>
            <Stack spacing="0" w={["85%", "60%", "", ""]}>
                {dayTimeLocal[0].day !== "" ?
                    <>
                        {dayTimeLocal.map((x, i) => (
                            <Flex height="32px" key={"flex" + i} align="center" justify="space-between">
                                <Text mr={4}>{x.dayName}</Text>
                                <Text>{x.adjFrom === -1 ? "-" : (x.adjFrom === 0 ? "" : "+")} {x.from}</Text>
                                <Text key={"colon" + i} mx={2}>:</Text>
                                <Text>{x.adjTo === -1 ? "-" : (x.adjTo === 0 ? "" : "+")} {x.to}</Text>
                            </Flex>
                        ))}
                    </>
                    :
                    <>
                    <Text>Availability not specified</Text>
                    </>
                }
            </Stack>
            {showAlert && (<ErrorDialog title={newServiceError[0]} message={newServiceError[1]} showAlert={showAlert} setShowAlert={setShowAlert} />)}
        </>
    )
}
