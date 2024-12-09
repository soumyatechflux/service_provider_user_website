import React from 'react'
import { useParams } from 'react-router-dom';
import CookServiceCards from '../CookService/CookServiceCards/CookServiceCards';
import DriverServiceCards from '../DriverService/DriverServiceCards/DriverServiceCards';
import GardenerServiceCards from '../GardenerService/GardenerServiceCards/GardenerServiceCards';

const ServiceDetails = () => {
    const { id } = useParams(); // Extracts the id from the URL

    // Render different components based on the `id`
    switch (id) {
      case '1':
        return <CookServiceCards />;
      case '2':
        return <DriverServiceCards />;
      case '3':
        return <GardenerServiceCards />;
      default:
        return <div>Service not found or invalid ID.</div>;
    }
}

export default ServiceDetails