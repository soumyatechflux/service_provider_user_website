

import axios from "axios";
import ProgramProps from "../../interfaces/ProgramProps";
import { QuestionProps } from "../../interfaces/QuestionProps";
import { FinalExamProps } from "../../interfaces/FinalExamProps";

const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
const role = sessionStorage.getItem("role");

export const setProgramFinalExam = async (
    program: ProgramProps,
    questions: QuestionProps | QuestionProps[], // Can be a single object or an array
    duration?: number,
    selectedExam?: FinalExamProps,
    setLoading?: (loading: boolean) => void
) => {
    const token = sessionStorage.getItem("token");
    

    try {
        // Ensure `questions` is always an array
        
        const questionList = Array.isArray(questions) ? questions : [questions];
        // Validation: Check if there are no questions to upload
        if (!questionList.length) return alert("No questions to upload!");

        console.log("questionList length",questionList.length)
        console.log("questionList QUE",questionList)

        // Construct payload
        const payload = {
            examId: selectedExam?._id,
            programId: program._id,
            // Ensure duration is a number (not a string)
            questions: questionList.map((q) => ({
                _id: q?._id,
                question: q?.question,
                explanation: q?.explanation,
                questionFile: q?.questionFile || "",
                duration: duration ?? 0,
                options: Array.isArray(q?.options) ? q.options : [],
            })),
        };

        console.log("PAYLOAD LOG", payload);
        setLoading?.(true);
        const response = await axios.post(
            `${BASE_URL}/${role}/questions/multiple/add`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Response:", response);
  

        console.log("Cleared questionList:", questionList);

    } catch (error) {
        setLoading?.(false)
        console.error("Error setting final exam:", error);
    }
    finally{
        setLoading?.(false)
    }
};










// import axios from "axios";
// import ProgramProps from "../../interfaces/ProgramProps";
// import { QuestionProps } from "../../interfaces/QuestionProps";
// import { FinalExamProps } from "../../interfaces/FinalExamProps";

// const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
// const role = sessionStorage.getItem("role");

// export const setProgramFinalExam = async (
//     program: ProgramProps,
//     questions: QuestionProps | QuestionProps[], // Can be a single object or an array
//     duration?: number,
//     selectedExam?: FinalExamProps
// ) => {
//     const token = sessionStorage.getItem("token");

//     try {
//         // Check if `questions` is an array or a single object
//         const isArray = Array.isArray(questions);
//         const firstQuestion = isArray ? questions[0] : questions;

//         // Construct payload
//         const payload = {
//     examId: selectedExam?._id,
//     programId: program._id,
//     duration: duration ?? 0, // Ensure duration is a number (not a string)
//     question: firstQuestion?.question,
//     explanation: firstQuestion?.explanation,
//     questionFile: firstQuestion?.questionFile || "",
//     options: Array.isArray(firstQuestion?.options) ? firstQuestion.options : [],
// };


// console.log("PAYLOAD LOG",firstQuestion?.question,)





//         const response = await axios.post(
//             `${BASE_URL}/${role}/questions/add`,
//             payload,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         console.log("Response:", response);
//     } catch (error) {
//         console.error("Error setting final exam:", error);
//     }
// };




// import axios from "axios";
// import ProgramProps from "../../interfaces/ProgramProps";

// const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
// const role= sessionStorage.getItem("role")

// export const setProgramFinalExam = async (
//     // version: string,
//     program: ProgramProps,
//     finalExam?: string,
//     questions?: unknown,
//     duration?: number,
//     selectedExam?:FinalExamProps
// ) => {
//     const token =sessionStorage.getItem("token"); // Replace with actual token or get it dynamically

//     try {
//         if (finalExam) {
//             // Updating existing exam
//             await axios.patch(
//                 `${BASE_URL}/${role}${finalExam}`,
//                 {
//                     questions,
//                     duration: `${duration} Minutes`,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );
//         } else {
//             // Adding a new exam
//             const response = await axios.post(
//                 `${BASE_URL}/${role}/exams/add`,
//                 {
//                     duration: `${duration} Minutes`,
//                     programId: program._id,
//                     questions: [],
//                     // examName:version
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );
//             console.log(response)
            
//             // Update program's finalExams field with the new exam ID
//             // await axios.patch(
//             //     `${BASE_URL}/${role}/exams/${program._id}`,
//             //     {
//             //         finalExams: { ...program.finalExams, [version]: response.data.id },
//             //     },
//             //     {
//             //         headers: {
//             //             Authorization: `Bearer ${token}`,
//             //             "Content-Type": "application/json",
//             //         },
//             //     }
//             // );
//         }
//     } catch (error) {
//         console.error("Error setting final exam:", error);
//     }
// };






// import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
// import { db } from "../../firebase/firebaseConfig";
// import ProgramProps from "../../interfaces/ProgramProps";

// export const setProgramFinalExam = async(version: string, program: ProgramProps, finalExam?: string, questions?: unknown, duration?: number) => {
//     if(finalExam)
//     {
//         const finalExamDoc = doc(db, 'finalExams', finalExam)

//         await updateDoc(finalExamDoc, { questions, duration: `${duration} Minutes`})
//     }
//     else
//     {
//         const finalExamsRef = collection(db, 'finalExams')
    
//         const newFinalExam = {
//             duration: `${duration} Minutes`,
//             programId: program.id,
//             questions: []
//         }
    
//         const addedFinalExam = await addDoc(finalExamsRef, newFinalExam)

//         const programDoc = doc(db, 'programs', program.id)

//         await updateDoc(programDoc, { finalExams: {...program.finalExams, [version]: addedFinalExam.id} })
//     }
// }