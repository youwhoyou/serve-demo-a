import React from 'react';
import { useGoogleMap } from '@react-google-maps/api';


export function PanMap({ myLatMyLong }) {

    const map = useGoogleMap()

    React.useMemo(() => {
        if (map && myLatMyLong.lat !== 0 && myLatMyLong.lng !== 0) {
            map.panTo(myLatMyLong)
        }
    }, [map,myLatMyLong])

    return null;
}