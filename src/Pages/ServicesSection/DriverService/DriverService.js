import React, { useEffect } from 'react'
import DriverServiceCards from './DriverServiceCards/DriverServiceCards'
import WhyBookDriver from './WhyBookDriver/WhyBookDriver'
import DriverMarketingSection from './DriverMarketingSection/DriverMarketingSection'
import DriverFeedback from './DriverFeedback/DriverFeedback'
import DriverFAQs from './DriverFAQs/DriverFAQs'

const DriverService = () => {

    useEffect(() => {
      // Store the current URL with a descriptive key
      sessionStorage.setItem('servicePageLocation', "/services/driver-service");
    }, []); // Runs only when the component mounts

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