import axios from "axios";


const token = sessionStorage.getItem('token');
const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
const role= sessionStorage.getItem("role")
export const getProgramFinalExams = async (programId: string) => {
    console.log("EXAM",programId)
    try {
        const response = await axios.get(`${BASE_URL}/${role}/exams/${programId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include token for authentication
            },
        });

        // Check if response is successful
        if (response.status === 200) {
            console?.log("Program EXAM DATA",response?.data?.data)
            const finalExamsData=response?.data?.data
            return finalExamsData; // Return API response data
        } else {
            throw new Error("Failed to fetch final exams");
        }
    } catch {
        console.error("Error fetching final exams:");
        // throw new Error(error.response?.data?.message || "Something went wrong");
    }
};



// import { collection, query, where, getDocs } from "firebase/firestore"
// import { db } from "../../firebase/firebaseConfig"

// export const getProgramFinalExams = async (programId: string) => {
//     const finalExamsRef = collection(db, 'finalExams')
//     const queryFinalExams = query(finalExamsRef, where('programId', '==', programId))

//     const finalExamsDocs = await getDocs(queryFinalExams)
//     const finalExamsData = finalExamsDocs.docs.map(doc => ({...doc.data(), id: doc.id}))

//     return finalExamsData
// }