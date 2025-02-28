import axios from "axios";
const BASE_URL=import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
const token=sessionStorage.getItem("token");
const role=sessionStorage.getItem("role")
export const getTeacherPrograms = async () => {
    let endpoint = '';

    if (role === 'teacher') {
        endpoint = `${BASE_URL}/teacher/myprograms`;
    } else if (role === 'admin') {
        endpoint = `${BASE_URL}/admin/myprograms`;
    } else {
        throw new Error('Invalid role');
    }

    try {
            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}` // Add your token here
                }
            });
             // Replace with your actual API endpoint
             const teacherProgramsData = response?.data?.data;
            console.log("MY PROGRAMS ", teacherProgramsData)
            // return { ...response.data, id: response.data?.id ?? '' };
            return teacherProgramsData;

        
    } catch (error) {
        console.error("Error fetching programs data:", error);
        return [];
    }
};



// import { collection, query, where, getDocs } from "firebase/firestore"
// import { db } from "../../firebase/firebaseConfig"

// export const getTeacherPrograms = async(teacherId: string) => {
//     const teacherProgramsRef = collection(db, 'programs')
//     const queryTeacherPrograms = query(teacherProgramsRef, where('teacherId', '==', teacherId))

//     const teacherProgramsDocs = await getDocs(queryTeacherPrograms)

//     const teacherProgramsData = teacherProgramsDocs.docs.map(doc => ({...doc.data(), id: doc.id}))

//     return teacherProgramsData
// }