import React, { useEffect } from 'react'
import GardenerServiceCards from './GardenerServiceCards/GardenerServiceCards'
import WhyBookGardener from './WhyBookGardener/WhyBookGardener'
import GardenerMarketingSection from './GardenerMarketingSection/GardenerMarketingSection'
import GardenerFeedback from './GardenerFeedback/GardenerFeedback'
import GardenerFAQs from './GardenerFAQs/GardenerFAQs'

const GardenerService = () => {

    useEffect(() => {
      // Store the current URL with a descriptive key
      sessionStorage.setItem('servicePageLocation', "/services/gardener-service");
    }, []); // Runs only when the component mounts


  return (
    <div>
      <GardenerServiceCards/>
      <WhyBookGardener/>
      <GardenerMarketingSection/>
      <GardenerFeedback/>
      <GardenerFAQs/>
    </div>
  )
}

export default GardenerService