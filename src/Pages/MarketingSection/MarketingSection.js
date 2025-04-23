// import React from "react";
// import "./MarketingSection.css";

// const sections = [
//   {
//     id: 1,
//     title: "Marketing Section 1",
//     text: [
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//     ],
//     images: [{ large: true }],
//   },
//   {
//     id: 2,
//     title: "Marketing Section 2",
//     text: [
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//     ],
//     images: [{ large: true }, { small: true }],
//   },
// ];

// const MarketingSection = () => {
//   return (
//     <div className="container nav-container my-5 mobile-padding">
//       {/* Top Section */}
//       <div className="row mb-5">
//         <div className="col-md-6 image-wrapper me-md-5">
//           <img className="image-section" src="./ServicesSection/test.jpg" />
//         </div>
//         <div className="col-md-6 text-wrapper">
//           <h2 className="mb-4">Marketing Section</h2>
//           <div className="mb-4">
//             <h3 className="text-primary">Lorem ipsum dolor</h3>
//             <p>
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
//               eiusmod tempor incididunt ut labore et dolore magna aliqua.
//             </p>
//           </div>
//           <div className="mb-4">
//             <h3 className="text-primary">Lorem ipsum dolor</h3>
//             <p>
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
//               eiusmod tempor incididunt ut labore et dolore magna aliqua.
//             </p>
//           </div>
//           <div className="mb-4">
//             <h3 className="text-primary">Lorem ipsum dolor</h3>
//             <p>
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
//               eiusmod tempor incididunt ut labore et dolore magna aliqua.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="row ">
//         <div className="col-md-6 order-md-2 image-wrapper pl-md-5">
//           <img className="image-section-2" src="./ServicesSection/test.jpg" />
//         </div>
//         <div className="col-md-6 order-md-1 text-wrapper pr-md-5">
//           <h2 className="mb-4">Marketing Section</h2>
//           <div>
//             <h3 className="text-primary">Lorem ipsum dolor</h3>
//             <p>
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
//               eiusmod tempor incididunt ut labore et dolore magna aliqua.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MarketingSection;

import React from "react";
import "./MarketingSection.css";

const MarketingSection = () => {
  return (
    <div>
      <div className="container nav-container marketing-container align-items-center">
        <div className="col-md-6 order-md-2 unique-image-wrapper">
          {/* Second Image */}
          <img
            className="unique-image-second"
            src="./ServicesSection/test.jpg"
            alt="Second"
          />

          {/* Third Overlapping Image */}
          <img
            className="unique-image-third"
            src="./ServicesSection/test2.jpg"
            alt="Third"
          />
        </div>
        <div className="col-md-6 order-md-1 unique-text-wrapper mp-text">
          <h2 className="unique-heading">
            Why Download Many When One App Can Do It All?
          </h2>
          <div>
            <h3 className="unique-subheading">No more switching apps—</h3>
            <p className="unique-paragraph">
              Book your home services on one screen, one app with just a few
              clicks; anytime you need them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingSection;
