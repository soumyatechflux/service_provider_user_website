import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;

export const getTeachers = async () => {
    try {
        const token = sessionStorage.getItem("token");
        const role = sessionStorage.getItem("role");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(`${BASE_URL}/${role}/teachers`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) throw new Error("Invalid response from server");
        console.log("Get TEACHER RESPONSE",response?.data?.data)
        //@ts-expect-error hide firstLoginLink from teachers
        const filteredTeachers = response.data?.data?.filter((teacher) => !teacher?.firstLoginLink);

        return filteredTeachers;
    } catch (error) {
        console.error("Error fetching teachers:", error);
        return [];
    }
};





// import { collection, getDocs } from "firebase/firestore"
// import { db } from "../../firebase/firebaseConfig"

// export const getTeachers = async () => {
//     const teachersRef = collection(db, 'teachers')

//     const teachersDocs = await getDocs(teachersRef)

//     const teachers = teachersDocs.docs.map(doc => ({...doc.data(), id: doc.id}))

//     //@ts-expect-error hide firstLoginLink from teachers
//     const filteredTeachers = teachers.filter((teacher) => !teacher?.firstLoginLink)

//     return filteredTeachers
// }