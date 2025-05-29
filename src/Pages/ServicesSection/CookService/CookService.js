import React, { useEffect } from 'react'
import CookServiceCards from './CookServiceCards/CookServiceCards'
import WhyBookCooks from './WhyBookCooks/WhyBookCooks'
import CookMarketingSection from './CookMarketingSection/CookMarketingSection'
import CookFeedback from './CookFeedback/CookFeedback'
import CookFAQs from './CookFAQs/CookFAQs'
import Testimonials from '../../Testimonials/Testimonials'

const CookService = () => {

  useEffect(() => {
    // Store the current URL with a descriptive key
    sessionStorage.setItem('servicePageLocation', "/services/cook-service");
  }, []); // Runs only when the component mounts



  return (
    <div className=''>
        <CookServiceCards/>
        <WhyBookCooks/>
        <CookMarketingSection/>
        <CookFeedback/>
        {/* <Testimonials/> */}
        <CookFAQs/>
    </div>
  )
}

export default CookService