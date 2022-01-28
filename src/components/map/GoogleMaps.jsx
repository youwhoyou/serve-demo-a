import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Spinner, useColorMode } from '@chakra-ui/react';
import { PanMap } from "./PanMap";

const containerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: "12px"
};

const styles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];


function GoogleMaps({ myLat, myLong, setMyLat, setMyLong }) {

    const { colorMode } = useColorMode();
    const [marker, setMarker] = useState({ lat: myLat, lng: myLong });

    const options = {
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        styles: colorMode === "light" ? "" : styles,
    };

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API
    });

    // console.log("myLat   MyLong MARKER", marker);
    // console.log("myLat   MyLong aaaa", myLat, myLong);

    useEffect(() => {
        setMyLat(-5.6429177);
        setMyLong(-155.9042211);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setMarker({ lat: Number(myLat), lng: Number(myLong) });
    }, [myLat, myLong]);

    const onMapClick = React.useCallback((e) => {
        setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        setMyLat(e.latLng.lat());
        setMyLong(e.latLng.lng());
        // eslint-disable-next-line
    }, []);

    const mapRef = React.useRef();

    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    const renderMap = () => {
        // wrapping to a function is useful in case you want to access `window.google`
        // to eg. setup options or create latLng object, it won't be available otherwise
        // feel free to render directly if you don't need that
        // const onMapLoad = React.useCallback(
        //     function onMapLoad(map) {
        //         mapRef.current = map;
        //     }
        // )

        return (
            <>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={marker}
                    zoom={10}
                    onLoad={onMapLoad}
                    // onUnmount={onUnmount}
                    styles={styles}
                    options={options}
                    onClick={onMapClick}
                >

                    <PanMap myLatMyLong={marker} />
                    <Marker position={marker} icon={{
                        url: '/media/logo/YouWhoMarker.svg',
                        scaledSize: new window.google.maps.Size(50,40),
                        origin: new window.google.maps.Point(0,0),
                        anchor: new window.google.maps.Point(25,40),
                    }} />

                </GoogleMap>
            </>
        )
    };

    if (loadError) {
        return <div>Map cannot be loaded right now, sorry.</div>
    };

    return isLoaded ? renderMap() : <Spinner />;
};

export default React.memo(GoogleMaps);