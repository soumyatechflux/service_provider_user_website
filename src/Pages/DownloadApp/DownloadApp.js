import React from 'react'
import './DownloadApp.css'

const DownloadApp = () => {
  return (
    <div className=' Download-container'>
    <div className="container nav-container download-section">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-6 content-col">
          <h2 className='download-title'>Download The App</h2>
          <p className='download-text'>
            Lorem ipsum dolor sit amet consectetur. Eu dignissim mi scelerisque eget 
            vulputate. Suspendisse sit imperdiet sagittis at mauris. Tristique 
            condimentum diam purus amet at rhoncus. Pretium aliquam proin erat 
            aenean in.
          </p>
          <div className="store-buttons">
            <a href="#" className="store-button google-play">
              <img 
                src="./DownloadApp/Frame-1.jpg" 
                alt="Get it on Google Play" 
                className="store-img"
              />
            </a>
            <a href="#" className="store-button app-store">
              <img 
                src="./DownloadApp/Frame-2.jpg" 
                alt="Download on the App Store" 
                className="store-img"
              />
            </a>
          </div>
        </div>
        <div className="col-lg-6 phones-col">
          <div className="phones-container">
            {[...Array(6)].map((_, index) => (
              <div key={index} className={`phone-outline phone-${index + 1}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
  )
}

export default DownloadApp