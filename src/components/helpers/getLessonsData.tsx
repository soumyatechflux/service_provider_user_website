import axios from "axios";

export const getLessonsData = async (courseId: string, programId: string) => {
    if (!courseId || !programId) throw new Error("Course ID or Program ID is missing");
    console.log(programId)
    const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
    const token=sessionStorage.getItem('token')
    const role = sessionStorage.getItem("role");
    const response = await axios.get(`${BASE_URL}/${role}/assessment/${courseId}`, {
        headers: {
            Authorization: `Bearer ${token}`,  // Send token for authentication
            "Content-Type": "application/json",
        },
    });

    return response?.data?.data;
};




// import { collection, documentId, getDocs, query, where } from "firebase/firestore"
// import { db } from "../../firebase/firebaseConfig"

// //@ts-expect-error course
// export const getLessonsData = async (courses) => {
//     const lessonsRef = collection(db, 'lessons')
//     //@ts-expect-error course
//     const coursesLessons = courses?.map(course => course?.lessons).flat()

//     if(coursesLessons?.length)
//     {
//         const queryRef = query(lessonsRef, where(documentId(), 'in', coursesLessons))

//         const lessonsDocs = await getDocs(queryRef)
//         const lessonsArray = lessonsDocs.docs.map(doc => ({...doc.data(), id: doc.id})) ?? []

//         //@ts-expect-error order
//         const orderedLessonsArray = lessonsArray.slice().sort((a, b) => a.order - b.order)

//         return orderedLessonsArray
//     }
//     else return []
// }