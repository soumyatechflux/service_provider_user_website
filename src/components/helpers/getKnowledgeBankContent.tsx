import axios from "axios";

const role = sessionStorage.getItem('role'); 
// const token=sessionStorage.getItem('token')
const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;

// Fetching Knowledge Bank Content with Token
export const getKnowledgeBankContent = async (id: string, token: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/${role}/knowledge_bank/files/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Adding token for authentication
            },
        });

        if (response.status === 200) {
            return response?.data?.data; // Assuming the API returns the knowledge bank content
        } else {
            console.error("Error fetching knowledge bank content:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Error fetching knowledge bank content:", error);
        return [];
    }
};









// import { collection, query, where, getDocs } from "firebase/firestore"
// import { db } from "../../firebase/firebaseConfig"

// export const getKnowledgeBankContent = async(majorId: string) => {
//     const knowledgeBankContentRef = collection(db, 'knowledgeBankContent')
//     const queryKnowledgeBankContent = query(knowledgeBankContentRef, where('majorId', '==', majorId))

//     const knowledgeBankContentDocs = await getDocs(queryKnowledgeBankContent)

//     const knowledgeBankContentData = knowledgeBankContentDocs.docs.map(doc => ({...doc.data(), id: doc.id}))

//     return knowledgeBankContentData
// }