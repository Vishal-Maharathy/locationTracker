import React, { useEffect, useState } from 'react';
import MapComponent from './MapComponent';
import "../../assets/mapView/container.css";

const Container = () => {
    return (
        <div className='container'>
            <input type='text' placeholder='Locate Target'></input>
            <MapComponent />
        </div>
    );
};

export default Container;
