// import React from "react";
// import "./DownloadApp.css";

// const DownloadApp = () => {
//   return (
//     <div className=" Download-container">
//       <div className="container nav-container download-section">
//         <div className="container">
//           <div className="row align-items-center">
//             <div className="col-lg-6 content-col">
//               <div>
//                 <h2 className="download-title" style={{fontSize:"36px" , fontWeight:"700", color:"white"}}>Download The App</h2>
//                 <p className="download-text" style={{ color:"white"}}>
//                   Lorem ipsum dolor sit amet consectetur. Eu dignissim mi
//                   scelerisque eget vulputate. Suspendisse sit imperdiet sagittis
//                   at mauris. Tristique condimentum diam purus amet at rhoncus.
//                   Pretium aliquam proin erat aenean in.
//                 </p>
//                 <div className="store-buttons">
//                   <a href="#" className="store-button google-play">
//                     <img
//                       src="./DownloadApp/Google_Play_Store.png"
//                       alt="Get it on Google Play"
//                       className="store-img"
//                     />
//                   </a>
//                   <a href="#" className="store-button app-store">
//                     <img
//                       src="./DownloadApp/AppStore.png"
//                       alt="Download on the App Store"
//                       className="store-img"
//                     />
//                   </a>
//                 </div>
//               </div>
//             </div>

//             <div className="col-lg-6 ">
//               <div className="img-phone">
//                 <img src="./DownloadApp/test.png" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DownloadApp;



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
                <p className="download-text" style={{ color: "white" }}>
                  Lorem ipsum dolor sit amet consectetur. Eu dignissim mi
                  scelerisque eget vulputate. Suspendisse sit imperdiet sagittis
                  at mauris. Tristique condimentum diam purus amet at rhoncus.
                  Pretium aliquam proin erat aenean in.
                </p>
                <div className="store-buttons">
                  <a href="#" className="store-button google-play">
                    <img
                      src="/DownloadApp/Google_Play_Store.png"
                      alt="Get it on Google Play"
                      className="store-img"
                    />
                  </a>
                  <a href="#" className="store-button app-store">
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
                <img src="/DownloadApp/test.png" alt="Phone Display" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;