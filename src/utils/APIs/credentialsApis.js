// import { axiosInstance, axiosInstanceNoAuth ,authorizeMe} from './../commonHeadApiLogic.js';
// import { authorizeMe } from './commonHeadApiLogic.js'; // Ensure you import this function

import { authorizeMe, axiosInstance, axiosInstanceNoAuth } from "./commonHeadApiLogic";

// Ensure authorization header is set before making authenticated requests
const withAuthorization = async (apiFunction, ...args) => {
  try {
    await authorizeMe(); // Ensure the Authorization header is set
    return await apiFunction(...args);
  } catch (error) {
    // Handle errors as necessary
    console.error("Error in API request:", error);
    throw error;
  }
};

const baseURL = process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL;


export async function SignUpAPI(data) {
  // return withAuthorization(async () => {
    // const response = await axiosInstanceNoAuth.post("https://api-serviceprovider.techfluxsolutions.com/api/customer/register", data);
    const response = await axiosInstanceNoAuth.post(`${baseURL}/api/customer/register`, data);
    return response;
  // });
}

export async function LoginAPI(data) {
 
    const response = await axiosInstanceNoAuth.post("/api/customer/login", data);
    return response;

}


export async function OTPAPI(data) {
  // return withAuthorization(async () => {
    const response = await axiosInstanceNoAuth.post("/api/customer/otp-verify", data);
    return response;
  // });
}

export async function forgotPasswordAPI(data) {
  return withAuthorization(async () => {
    const response = await axiosInstanceNoAuth.post("/user/user_Forgot_Password_check_api", data);
    return response;
  });
}



export async function updateProfileAPI(data) {
  return withAuthorization(async () => {
    const response = await axiosInstance.post("/user/account_update_", data);
    return response;
  });
}

export async function updatePasswordAPI(data) {
  return withAuthorization(async () => {
    const response = await axiosInstanceNoAuth.post("/user/account_update_pass_reset", data);
    return response;
  });
}

export async function dashboardDataAPI() {
  return withAuthorization(async () => {
    const response = await axiosInstance.get("/user/get_dashboard_data_api");
    return response;
  });
}
