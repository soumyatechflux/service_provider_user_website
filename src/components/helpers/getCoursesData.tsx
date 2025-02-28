import axios from "axios";
import ProgramProps from "../../interfaces/ProgramProps";

const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
const role = sessionStorage.getItem("role");
const token = sessionStorage.getItem("token");


export const getCoursesData = async (program: ProgramProps) => {
  try {
    console.log("BASE_URL:", BASE_URL);
    console.log("Program Data:", program);

    if (!program?._id) {
      console.warn("No valid program ID provided.");
      return [];
    }

    const apiUrl = `${BASE_URL}/${role}/course/${program._id}`;
    console.log("Fetching courses from:", apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("API Response COURSE:", response?.data?.data);

    if (!Array.isArray(response.data.data)) {
      console.error("Unexpected response format. Expected an array but got:", response.data);
      return [];
    }



    // console.log("Ordered Courses Array:", orderedCoursesArray);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};










// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
// const role = sessionStorage.getItem("role");
// const token = sessionStorage.getItem("token");

// // Define the expected type for the program
// interface Program {
//   _id: string;
//   courses: string[];
// }

// interface Course {
//   _id: string;
//   name: string;
//   createdAt: string; // Adjust the type based on API response (Date | string)
// }

// export const getCoursesData = async (program: Program): Promise<Course[]> => {
//   try {
//     console.log("BASE_URL:", BASE_URL);
//     console.log("Program Data:", program);

//     if (!program?._id) {
//       console.warn("No valid program ID provided.");
//       return [];
//     }

//     const apiUrl = `${BASE_URL}/${role}/course/${program._id}`;
//     console.log("Fetching courses from:", apiUrl);

//     const response = await axios.get(apiUrl, {
//       headers: {
//         Authorization: `Bearer ${token}`, // ✅ Include token in headers
//         "Content-Type": "application/json",
//       },
//     });

//     console.log("API Response COURSE:", response.data);

//     if (!Array.isArray(response.data)) {
//       console.error("Unexpected response format. Expected an array but got:", response.data);
//       return [];
//     }

//     const coursesArray = response.data; // ✅ Ensure it's an array
//     console.log("Courses Array before sorting:", coursesArray);

//     const orderedCoursesArray = coursesArray.slice().sort((a, b) => {
//       const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
//       const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
//       return dateA - dateB;
//     });

//     console.log("Ordered Courses Array:", orderedCoursesArray);
//     return orderedCoursesArray;
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     return [];
//   }
// };






// import { collection, query, where, documentId, getDocs } from "firebase/firestore"
// import { db } from "../../firebase/firebaseConfig"

// //@ts-expect-error program
// export const getCoursesData = async (program) => {
//     const coursesRef = collection(db, 'courses')
//     const queryRef = query(coursesRef, where(documentId(), 'in', program.courses))

//     const coursesDocs = await getDocs(queryRef)
//     const coursesArray = coursesDocs.docs.map(doc => ({...doc.data(), id: doc.id})) ?? []

//     const orderedCoursesArray = coursesArray.slice().sort((a, b) => {
//         //@ts-expect-error createdAt
//         const dateA = a.createdAt.toDate();
//         //@ts-expect-error createdAt
//         const dateB = b.createdAt.toDate();
      
//         // Compare the dates for sorting
//         return dateA - dateB;
//       })

//     return orderedCoursesArray
// }