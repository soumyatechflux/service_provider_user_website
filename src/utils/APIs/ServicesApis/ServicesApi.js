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
export async function getAllServicesAPI() {
  return withAuthorization(async () => {
    const response = await axiosInstance.get("/api/customer/category");
    return response;
  });
}
