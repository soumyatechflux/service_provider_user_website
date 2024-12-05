import React from 'react'
import DriverServiceCards from './DriverServiceCards/DriverServiceCards'
import WhyBookDriver from './WhyBookDriver/WhyBookDriver'
import DriverMarketingSection from './DriverMarketingSection/DriverMarketingSection'
import DriverFeedback from './DriverFeedback/DriverFeedback'
import DriverFAQs from './DriverFAQs/DriverFAQs'

const DriverService = () => {
  return (
    <div>
      <DriverServiceCards/>
      <WhyBookDriver/>
      <DriverMarketingSection/>
      <DriverFeedback/>
      <DriverFAQs/>
    </div>
  )
}

export default DriverService