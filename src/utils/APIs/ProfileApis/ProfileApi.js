import { authorizeMe, axiosInstance } from "../commonHeadApiLogic";


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




export async function getProfileAPI() {
  return withAuthorization(async () => {
    const response = await axiosInstance.get("/api/customer/profile");
    return response;
  });
}


// /api/customer/profile
export async function editProfileAPI(data) {
    return withAuthorization(async () => {
      const response = await axiosInstance.patch("/api/customer/profile",data);
      return response;
    });
  }

  // /api/customer/bookings

  export async function getUpCommingBookingsAPI(data) {
    return withAuthorization(async () => {
      const response = await axiosInstance.get("/api/customer/upcoming_bookings",data);
      return response;
    });
  }

  // {{url}}/api/customer/previous_bookings
  export async function getPreviousBookingsAPI() {
    return withAuthorization(async () => {
      const response = await axiosInstance.get("/api/customer/previous_bookings");
      return response;
    });
  }

  // /api/customer/bookings/29
  export async function getUpcommingBookingsByIdAPI(id) {
    return withAuthorization(async () => {
      const response = await axiosInstance.get(`/api/customer/bookings/${id}`);
      return response;
    });
  }