import axios from "axios";
import ProgramProps from "../../interfaces/ProgramProps";
import { FinalExamProps } from "../../interfaces/FinalExamProps";

const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;

// ✅ Use Axios to Delete Final Exam
export const setDeleteFinalExam = async (program: ProgramProps, finalExam:FinalExamProps) => {
    
    console.log(program)
    try {
        const token = sessionStorage.getItem("token"); // ✅ Get auth token
        const role = sessionStorage.getItem("role"); // ✅ Get user role

        // ✅ Send DELETE request
        await axios.delete(`${BASE_URL}/${role}/exams/${finalExam._id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log(`Final exam ${finalExam._id} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting final exam:", error);
        throw new Error("Failed to delete final exam.");
    }
};
















// import { doc, deleteDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "../../firebase/firebaseConfig";
// import ProgramProps from "../../interfaces/ProgramProps";

// export const setDeleteFinalExam = async(program: ProgramProps, finalExam: unknown) => {
//     //@ts-expect-error finalExam
//     const finalExamDoc = doc(db, 'finalExams', finalExam.id)
//     const studentFinalExam = collection(db, 'studentFinalExam')
//     //@ts-expect-error finalExam
//     const queryStudentFinalExam = query(studentFinalExam, where('finalExamId', '==', finalExam.id))

//     const studentFinalExamDocs = await getDocs(queryStudentFinalExam)

//     const deletePromises = studentFinalExamDocs.docs.map(async (doc) => await deleteDoc(doc.ref))

//     await Promise.all(deletePromises)

//     await deleteDoc(finalExamDoc)

//     const programDoc = doc(db, 'programs', program.id)

//     await updateDoc(programDoc, { finalExams: {...program.finalExams} })
// }