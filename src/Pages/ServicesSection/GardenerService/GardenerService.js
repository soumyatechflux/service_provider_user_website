import React from 'react'
import GardenerServiceCards from './GardenerServiceCards/GardenerServiceCards'
import WhyBookGardener from './WhyBookGardener/WhyBookGardener'
import GardenerMarketingSection from './GardenerMarketingSection/GardenerMarketingSection'
import GardenerFeedback from './GardenerFeedback/GardenerFeedback'
import GardenerFAQs from './GardenerFAQs/GardenerFAQs'

const GardenerService = () => {
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