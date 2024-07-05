import React from "react";
import {Marker} from 'react-leaflet';
import  {IconLocation}  from "./IconLocation";
const Markers = () =>  {   
    return (
        <Marker position={{lat:'-17.3645441', lng:'-66.1775065'}} icon={IconLocation}/>
    );
};
export default Markers;