import React, { createContext, useEffect, useState } from "react";
import { useMoralis, useMoralisFile, useMoralisQuery, useMoralisSubscription } from "react-moralis";
import { useToast, Box, Text, Icon } from "@chakra-ui/react";
import { useHistory } from 'react-router-dom';
import * as AiI from "react-icons/ai";



export const SiteStateContext = createContext();

// This context provider is passed to any component requiring the context
export const SiteState = ({ children }) => {

  const { user, Moralis } = useMoralis();
  const [siteIsLoading, setSiteIsLoading] = useState(false);
  const [siteIsLoading2, setSiteIsLoading2] = useState(false);
  const [siteIsLoading3, setSiteIsLoading3] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState({ "value": Intl.DateTimeFormat().resolvedOptions().timeZone, "offset": (new Date().getTimezoneOffset()) / (-60) });
  const [userHistory, setUserHistory] = useState(window.localStorage.getItem("anonUser") !== null ? JSON.parse(window.localStorage.getItem("anonUser")) : { viewHistory: [], searchHistory: [] });
  const [youWhoSwitch, setYouWhoSwitch] = useState(window.localStorage.getItem("youWhoSwitch") !== null ? JSON.parse(window.localStorage.getItem("youWhoSwitch")) : false);
  const [userLoc, setUserLoc] = useState([13.37, 13.37]);
  const [newEvent, setNewEvent] = useState(false);
  const [provider, setProvider] = useState("");
  const [acceptDemo, setAcceptDemo] = useState(window.localStorage.getItem("demo") !== null ? JSON.parse(window.localStorage.getItem("demo")) : false);

  const history = useHistory();
  const toast = useToast();
  const id = "events-updated";
  const toastIdyou = "new-you-message";
  const toastIdwho = "new-who-message";

  const { data: eventsData } = useMoralisQuery(
    "Events",
    query => query.equalTo("user", user),
    [],
    {
      live: true,
      onLiveCreate: data => {
        // console.log(`Event ${data.id} was just CREATED`);
        setNewEvent(true);
        if (!toast.isActive(id)) {
          toast({
            id,
            position: "top",
            title: "New Event",
            description: "You have a new event please visit Events page for more details.",
            status: "info",
            duration: 5000,
            isClosable: true,
            render: () => (
              <Box as="button" textAlign="left" onClick={() => history.push("/account/events")} w={["94vw", "512px", "", ""]} position="fixed" top="0" left="50%" p={4} pb={5} ml={["-47vw", "-251px", "", ""]} color="primary.600" bg="primary.100" borderBottomRadius="lg">
                <Text fontWeight="600"><Icon as={AiI.AiOutlineExclamationCircle} mr={1} mb="4px" />New event</Text>
                <Text>Please click here to visit Events page for more details.</Text>
              </Box>
            ),
          });
        };
      },
      onLiveUpdate: data => {
        // console.log(`Event ${data.id} was just UPDATED`);
        if ((data.attributes.newEvents).length > 0) {
          setNewEvent(true);
          if (!toast.isActive(id)) {
            toast({
              id,
              position: "top",
              title: "New Event",
              description: "You have a new event please visit Events page for more details.",
              status: "info",
              duration: 5000,
              isClosable: true,

              render: () => (
                <Box as="button" textAlign="left" onClick={() => history.push("/account/events")} w={["94vw", "512px", "", ""]} position="fixed" top="0" left="50%" p={4} pb={5} ml={["-47vw", "-251px", "", ""]} color="primary.600" bg="primary.100" borderBottomRadius="lg">
                  <Text fontWeight="600"><Icon as={AiI.AiOutlineExclamationCircle} mr={1} mb="4px" />New event</Text>
                  <Text>Please click here to visit Events page for more details.</Text>
                </Box>
              ),

            });
          };
        }
      },
    },
  );

  const { data: youChatData } = useMoralisQuery(
    "Chats",
    query =>
      query
        .equalTo("user", user),
    [],
    {
      live: true,
      onLiveUpdate: () => {
        if (!toast.isActive(toastIdyou)) {
          toast({
            id: toastIdyou,
            position: "top",
            title: "New Booking Message",
            description: "You received a new message for one of your bookings.",
            status: "success",
            duration: 5000,
            isClosable: true,
            render: () => (
              <Box as="button" textAlign="left" onClick={() => history.push("/chat/you")} w={["94vw", "512px", "", ""]} position="fixed" top="0" left="50%" p={4} pb={5} ml={["-47vw", "-251px", "", ""]} color="primary.600" bg="primary.200" borderBottomRadius="lg">
                <Text fontWeight="600"><Icon as={AiI.AiOutlineExclamationCircle} mr={1} mb="4px" />New Booking Message</Text>
                <Text>You received a new message from the service provider for one of your bookings.</Text>
              </Box>
            ),

          });
        };
      },
    },
  );


  const { data: whoChatData } = useMoralisQuery(
    "Chats",
    query =>
      query
        .equalTo("provider", provider),
    [],
    {
      live: true,
      onLiveUpdate: () => {
        if (!toast.isActive(toastIdwho)) {
          toast({
            id: toastIdwho,
            position: "top",
            title: "New Booking Message",
            description: "You received a new message for one of your bookings.",
            status: "success",
            duration: 5000,
            isClosable: true,
            render: () => (
              <Box as="button" textAlign="left" onClick={() => history.push("/chat/who")} w={["94vw", "512px", "", ""]} position="fixed" top="0" left="50%" p={4} pb={5} ml={["-47vw", "-251px", "", ""]} color="secondary.600" bg="secondary.200" borderBottomRadius="lg">
                <Text fontWeight="600"><Icon as={AiI.AiOutlineExclamationCircle} mr={1} mb="4px" />New Booking Message</Text>
                <Text>You received a new message from a User for one of your bookings.</Text>
              </Box>
            ),

          });
        };
      },
    },
  );

  useEffect(() => {
    if (user) {

      if (newEvent) {
        if (!toast.isActive(id)) {
          toast({
            id,
            position: "top",
            title: "New Event",
            description: "You have a new event please visit Events page for more details.",
            status: "info",
            duration: 5000,
            isClosable: true,

            render: () => (
              <Box as="button" textAlign="left" onClick={() => history.push("/account/events")} w={["94vw", "512px", "", ""]} position="fixed" top="0" left="50%" p={4} pb={5} ml={["-47vw", "-251px", "", ""]} color="primary.600" bg="primary.100" borderBottomRadius="lg">
                <Text fontWeight="600"><Icon as={AiI.AiOutlineExclamationCircle} mr={1} mb="4px" />New event</Text>
                <Text>Please click here to visit Events page for more details.</Text>
              </Box>
            ),

          });
        };
      };

      setProvider(user.attributes.userPublic);

      (async () => {
        await loadEvents();
      })();
    } else {
      setNewEvent(false);
    }


  }, [newEvent, user])


  const loadEvents = async () => {
    try {
      const Events = Moralis.Object.extend("Events");
      const queryUserEvents = new Moralis.Query(Events);
      queryUserEvents.equalTo("user", user);
      let userEvents = await queryUserEvents.first();

      if (userEvents) {
        if (userEvents.attributes.newEvents.length > 0) {
          setNewEvent(true);
        }

      } else {

        const Events = Moralis.Object.extend("Events");
        const acl = new Moralis.ACL();
        acl.setPublicReadAccess(false);
        acl.setReadAccess(user.id, true);
        acl.setWriteAccess(user.id, true);

        const event = new Events();
        // event.setACL(acl);
        event.set('user', user);
        event.set('newEvents', [{ id: Date.now(), title: "Welcome to YouWho.io", detail: "Thank you very much for joining us, we hope you find our Decentralized Service Marketplace useful!", link: "/activity" }])
        await event.save().then(() => {
          // console.log("create new event success");
          setNewEvent(true);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    try {
      (async () => {
        await getLocation();

        async function getLocation() {
          if (navigator.geolocation) {
            await navigator.geolocation.getCurrentPosition(showPosition, showError);
          } else {
            console.log("Geolocation Failed", "Geolocation is not supported by this browser.");
          }
        }

        async function showPosition(position) {
          setUserLoc([Number(position.coords.latitude), Number(position.coords.longitude)]);
        }

        function showError(error) {
          if (document.getElementById("sortSelect")) document.getElementById("sortSelect").value = "rateDesc";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.log("Geolocation Failed", "Please allow location or GPS in your web-browser or device.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.log("Geolocation Failed", "Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.log("Geolocation Failed", "The request to get user location timed out.");
              break;
            case error.UNKNOWN_ERROR:
              console.log("Geolocation Failed", "An unknown error occurred.");
              break;
            default:
              console.log("Geolocation Failed", "Please allow location/GPS in your web-browser/app.");
              break;
          }
        }
      })();
    } catch (error) { console.log(error) }
  }, [])


  return (
    <SiteStateContext.Provider value={{ siteIsLoading, setSiteIsLoading, siteIsLoading2, setSiteIsLoading2, siteIsLoading3, setSiteIsLoading3, searchQuery, setSearchQuery, selectedTimezone, setSelectedTimezone, userHistory, setUserHistory, youWhoSwitch, setYouWhoSwitch, userLoc, setUserLoc, newEvent, setNewEvent, acceptDemo, setAcceptDemo }} >
      {children}
    </SiteStateContext.Provider>
  );
};