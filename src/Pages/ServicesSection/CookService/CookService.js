import React from 'react'
import CookServiceCards from './CookServiceCards/CookServiceCards'
import WhyBookCooks from './WhyBookCooks/WhyBookCooks'
import CookMarketingSection from './CookMarketingSection/CookMarketingSection'
import CookFeedback from './CookFeedback/CookFeedback'
import CookFAQs from './CookFAQs/CookFAQs'

const CookService = () => {
  return (
    <div className=''>
        <CookServiceCards/>
        <WhyBookCooks/>
        <CookMarketingSection/>
        <CookFeedback/>
        <CookFAQs/>
    </div>
  )
}

export default CookService