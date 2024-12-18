import React from 'react'
import { useParams } from 'react-router-dom';
import CookServiceCards from '../CookService/CookServiceCards/CookServiceCards';
import DriverServiceCards from '../DriverService/DriverServiceCards/DriverServiceCards';
import GardenerServiceCards from '../GardenerService/GardenerServiceCards/GardenerServiceCards';
import CookService from '../CookService/CookService';
import GardenerService from '../GardenerService/GardenerService';
import DriverService from '../DriverService/DriverService';

const ServiceDetails = () => {
    const { id } = useParams(); // Extracts the id from the URL

    // Render different components based on the `id`
    switch (id) {
      case '1':
        return <CookService />;
      case '2':
        return <DriverService />;
      case '3':
        return <GardenerService/>;
      default:
        return <div>Service not found or invalid ID.</div>;
    }
}

export default ServiceDetails