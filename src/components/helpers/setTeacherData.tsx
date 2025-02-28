// import axios from "axios";

// export const setTeacherData = async (
//     name: string, 
//     title: string, 
//     university: string, 
//     image: File | string | null, // Allow both File and string (URL)
// ) => {
//     const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
    
//     // Get token from session storage
//     const token = sessionStorage.getItem("token");
//     if (!token) throw new Error("Unauthorized: No token found.");

//     try {
//         const formData = new FormData();
//         formData.append("name", name);
//         formData.append("title", title);
//         formData.append("university", university);

//         if (typeof image === "string") {
//             formData.append("imageUrl", image); // Send as URL
//         } else if (image instanceof File) {
//             formData.append("image", image); // Send as File
//         } else {
//             throw new Error("Invalid image format. Please upload a valid file.");
//         }

//         const response = await axios.patch(
//             `${BASE_URL}/admin/auth/profile`,
//             formData,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "multipart/form-data",
//                 },
//             }
//         );
//         console.log("EDIT ADMIN PROFILe",response)

//         return response.data;
//     } catch (error) {
//         console.error("Error updating teacher data:", error);
//         throw error;
//     }
// };




// import { doc, updateDoc } from "firebase/firestore"
// import { db } from "../../firebase/firebaseConfig"

// export const setTeacherData = async (teacherId: string, name: string, title: string, university: string, image: string) => {
//     const teacherDoc = doc(db, 'teachers', teacherId)

//     await updateDoc(teacherDoc, {
//         name,
//         title,
//         university,
//         image
//     })
// }