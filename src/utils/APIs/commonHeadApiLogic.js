// import axios from "axios";
// import { decryptData } from "./../CRYPTO/cryptoFunction";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";

// const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL,
//   timeout: 30000,
// });

// const axiosInstanceNoAuth = axios.create({
//   baseURL: process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL,
//   timeout: 30000,
// });

// // Authorization function
// export function authorizeMe() {
//   try {
//     const encryptedToken = sessionStorage.getItem("ServiceProviderUserToken");
//     const token = encryptedToken ? decryptData(encryptedToken) : null;
//     console.log("Encrypted Token:", encryptedToken);

//     const token1 = decryptData(encryptedToken);
//     console.log("Decrypted Token:", token1);

//     if (token) {
//       axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       console.log("Authorization Header:", axiosInstance.defaults.headers.common["Authorization"]);

//     } else {
//       delete axiosInstance.defaults.headers.common["Authorization"];
//     }
//   } catch (error) {
//     console.error("Error during authorization setup:", error);
//     delete axiosInstance.defaults.headers.common["Authorization"];
//   }
// }

// // Response Interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const navigate = useNavigate();

//     if (
//       error?.response?.data?.message === "Expired token"
//     ) {
//       toast.error("Session expired, please log in again!");
//       localStorage.clear();
//       sessionStorage.clear();
//       navigate("/");
//     }

//     return Promise.reject(error);
//   }
// );

// // Request Interceptor
// axiosInstance.interceptors.request.use((config) => {
//   authorizeMe();
//   return config;
// });

// // App Component
// const App = () => {
//   useEffect(() => {
//     authorizeMe();
//   }, []);

//   return <></>;
// };

// export default App;
// export { axiosInstance, axiosInstanceNoAuth };










import axios from "axios";
import { decryptData } from "./../CRYPTO/cryptoFunction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL,
  timeout: 30000,
});

// Create a new Axios instance without setting the Authorization header
const axiosInstanceNoAuth = axios.create({
  baseURL: process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL,
  timeout: 30000,
});


// Add the Authorization token to each request before making the API call
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('ServiceProviderUserToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;  // Add token to the header
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     const { navigate } = require("react-router-dom");
//     if (
//       error?.response &&
//       error?.response?.data &&
//       error?.response?.data?.message === "Expired token"
//     ) {
//       toast.error("Time elapsed, Please log in again!");
//       console.log("Expired token error....");
//       localStorage.clear();
//       navigate("/");
//     }
//     return Promise.reject(error);
//   }
// );

export function authorizeMe() {
  const encryptedTokenForServiceProviderUser = sessionStorage.getItem("ServiceProviderUserToken");

  const token = decryptData(encryptedTokenForServiceProviderUser);
  

  if (token && token !== null && token !== undefined) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
}

// Intercept requests and authorize them before sending
axiosInstance.interceptors.request.use(async (config) => {
  await authorizeMe();
  return config;
});


const App = () => {
  useEffect(() => {
    authorizeMe();
  }, []);

  // Your component code here

  return (
  <>
  </>
  );
};

export default App;
export { axiosInstance , axiosInstanceNoAuth};