// import React, { useEffect, useState } from "react";
// import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
// import "./App.css";
// import ScrollToTop from "./utils/scrollToTop/ScrollToTop";
// import InternetChecker from "./utils/InternetChecker/InternetChecker";
// import NavbarComponent from "./Template/Navbar/Navbar";
// import HomeHeroSection from "./Pages/HomeHeroSection/HomeHeroSection";
// import Footer from "./Template/Footer/Footer";
// import ServicesSection from "./Pages/ServicesSection/ServicesSection";
// import WhyChooseUs from "./Pages/WhyChooseUs/WhyChooseUs";
// import BookWithEase from "./Pages/BookWithEase/BookWithEase";
// import MarketingSection from "./Pages/MarketingSection/MarketingSection";
// import Testimonials from "./Pages/Testimonials/Testimonials";
// import DownloadApp from "./Pages/DownloadApp/DownloadApp";
// import CookService from "./Pages/ServicesSection/CookService/CookService";
// import DriverService from "./Pages/ServicesSection/DriverService/DriverService";
// import GardenerService from "./Pages/ServicesSection/GardenerService/GardenerService";
// import ContactPage from "./Pages/ContactPage/ContactPage";
// import AboutUs from "./Pages/AboutUs/AboutUs";
// import ProfilePage from "./Pages/ProfilePage/ProfilePage";
// import LogInPage from "./Pages/LogInPage/LogInPage";
// import JoinAsPartner from "./Pages/JoinAsPartner/JoinAsPartner";
// import ModifyBooking from "./Pages/ProfilePage/ModifyBooking/ModifyBooking";


// function App() {
//   const [loggedIn, setLoggedIn] = useState(false);

//   useEffect(() => {
//     const isLoggedIn = localStorage.getItem("isDineRightUserLoggedIn");
//     const encryptedToken = localStorage.getItem("encryptedTokenForDineRightUser");

//     if (isLoggedIn === "true" && encryptedToken) {
//       setLoggedIn(true);
//     }
//   }, []);

//   const handleLogin = () => {
//     setLoggedIn(true);
//   };

//   const handleLogout = () => {
//     setLoggedIn(false);
//   };

//   const [isOffline, setIsOffline] = useState(false);

//   useEffect(() => {
//     const handleOffline = () => setIsOffline(true);
//     const handleOnline = () => setIsOffline(false);

//     window.addEventListener("offline", handleOffline);
//     window.addEventListener("online", handleOnline);

//     return () => {
//       window.removeEventListener("offline", handleOffline);
//       window.removeEventListener("online", handleOnline);
//     };
//   }, []);

//   return (
//     <div className="App">
//       <BrowserRouter>
//         <ScrollToTop />
//         <NavbarComponent />
        
//         {isOffline && <InternetChecker />}

//         <Routes>
//           {/* Home Page */}
//           <Route
//             path="/"
//             element={
//               <>
//               {/* <LogInPage/> */}
//                 <HomeHeroSection />
//                 <ServicesSection />
//                 <MarketingSection />
//                 <WhyChooseUs />
//                 <BookWithEase />
//                 <Testimonials />
                
//               </>
//             }
//           />

//           {/* Services */}
//           <Route path="/services/cook-service" element={<CookService />} />
//           <Route path="/services/driver-service" element={<DriverService />} />
//           <Route path="/services/gardener-service" element={<GardenerService />} />
//           <Route path="/contact-us" element={<ContactPage/>} />
//           <Route path="/about-us" element={<AboutUs/>} />
//           <Route path="/my-profile" element={<ProfilePage/>}/>
//           <Route path="/join-as-partner" element={<JoinAsPartner/>} />
//           <Route path="/my-profile" element={<ModifyBooking/>}/>

//           {/* Catch-all route */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//         <DownloadApp />
//         <Footer />
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import ScrollToTop from "./utils/scrollToTop/ScrollToTop";
import InternetChecker from "./utils/InternetChecker/InternetChecker";
import NavbarComponent from "./Template/Navbar/Navbar";
import HomeHeroSection from "./Pages/HomeHeroSection/HomeHeroSection";
import Footer from "./Template/Footer/Footer";
import ServicesSection from "./Pages/ServicesSection/ServicesSection";
import WhyChooseUs from "./Pages/WhyChooseUs/WhyChooseUs";
import BookWithEase from "./Pages/BookWithEase/BookWithEase";
import MarketingSection from "./Pages/MarketingSection/MarketingSection";
import Testimonials from "./Pages/Testimonials/Testimonials";
import DownloadApp from "./Pages/DownloadApp/DownloadApp";
import CookService from "./Pages/ServicesSection/CookService/CookService";
import DriverService from "./Pages/ServicesSection/DriverService/DriverService";
import GardenerService from "./Pages/ServicesSection/GardenerService/GardenerService";
import ContactPage from "./Pages/ContactPage/ContactPage";
import AboutUs from "./Pages/AboutUs/AboutUs";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
// import LogInPage from "./Pages/LogInPage/LogInPage";
import JoinAsPartner from "./Pages/JoinAsPartner/JoinAsPartner";
import ModifyBooking from "./Pages/ProfilePage/ModifyBooking/ModifyBooking";
import LogInPage from "./Pages/Credentials/LogInPage/LogInPage";
import SignUpPage from "./Pages/Credentials/SignUpPage/SignUpPage";
import MarketingSlider from "./Pages/MarketingSlider/MarketingSlider";
import BookingSection from "./Pages/ServicesSection/BookingSection/BookingSection";
// import Credentials from "./Pages/Credentials/Credentials";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isDineRightUserLoggedIn");
    const encryptedToken = localStorage.getItem("encryptedTokenForDineRightUser");

    if (isLoggedIn === "true" && encryptedToken) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <ConditionalNavbar />
        {isOffline && <InternetChecker />}
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <HomeHeroSection />
                <ServicesSection />
                <MarketingSection />
                <MarketingSlider/>
                <WhyChooseUs />
                <BookWithEase />
                <Testimonials />
              </>
            }
          />
          {/* Services */}
          <Route path="/services/cook-service" element={<CookService />} />
          <Route path="/services/driver-service" element={<DriverService />} />
          <Route path="/services/gardener-service" element={<GardenerService />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/my-profile" element={<ProfilePage />} />
          <Route path="/join-as-partner" element={<JoinAsPartner />} />
          <Route path="/modify-booking" element={<ModifyBooking />} />
          <Route path ="/booking" element={<BookingSection/>} />
          {/* Login Page */}
          <Route path="/login" element={<LogInPage />} />
          <Route path="/sign-up" element={<SignUpPage/>}/>
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ConditionalDownloadApp />
        <ConditionalFooter />
      </BrowserRouter>
    </div>
  );
}

// Conditional Navbar Component
function ConditionalNavbar() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/login" && location.pathname !==  "/sign-up";
  return showNavbar ? <NavbarComponent /> : null;
}

// Conditional Footer Component
function ConditionalFooter() {
  const location = useLocation();
  const showFooter = location.pathname !== "/login" && location.pathname !==  "/sign-up";
  return showFooter ? <Footer /> : null;
}

// Conditional Footer Component
function ConditionalDownloadApp() {
  const location = useLocation();
  const showDownloader = location.pathname !== "/login" && location.pathname !==  "/sign-up";
  return showDownloader ? <DownloadApp /> : null;
}

export default App;
