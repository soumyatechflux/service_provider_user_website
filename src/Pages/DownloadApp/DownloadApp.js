import React from "react";
import "./DownloadApp.css";

const DownloadApp = () => {
  return (
    <div className=" Download-container">
      <div className="container nav-container download-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 content-col">
              <div>
                <h2
                  className="download-title"
                  style={{
                    fontSize: "36px",
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  Download The App
                </h2>
                <p className="download-text" style={{ color: "white", fontWeight:"700" }}>
                Download the Servyo app on Android & iOS. Get access to all our services on your fingertips for a smooth and hassle-free experience
                </p>
                <div className="store-buttons">
                  <a
                    href="https://play.google.com/store" // Replace with your app's Google Play Store URL
                    className="store-button google-play"
                    target="_blank" // Opens the link in a new tab
                    rel="noopener noreferrer" // Improves security
                  >
                    <img
                      src="/DownloadApp/Google_Play_Store.png"
                      alt="Get it on Google Play"
                      className="store-img"
                    />
                  </a>
                  <a
                    href="https://www.apple.com/app-store/" // Replace with your app's App Store URL
                    className="store-button app-store"
                    target="_blank" // Opens the link in a new tab
                    rel="noopener noreferrer" // Improves security
                  >
                    <img
                      src="/DownloadApp/AppStore.png"
                      alt="Download on the App Store"
                      className="store-img"
                    />
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-6 ">
              <div className="img-phone">
                <img src="/DownloadApp/downloadApp.png" alt="Phone Display" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
