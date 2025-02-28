
import axios from "axios";

export const getKnowledgeBank = async () => {
    const role = sessionStorage.getItem('role'); 
    const token=sessionStorage.getItem('token')
    const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;

    try {
        let endpoint = '';

        if (role === 'teacher') {
            endpoint = `${BASE_URL}/teacher/knowledge_bank`;
        } else if (role === 'admin') {
            endpoint = `${BASE_URL}/admin/knowledge_bank`;
        } else {
            throw new Error('Invalid role');
        }

        const response = await axios.get(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', 
            }
        });
        const knowledgeBankData = response?.data?.data;

        // console.log('API Response:', userData); 
        
        if (!knowledgeBankData) {
            throw new Error('No data returned from API');
        }

        return knowledgeBankData || {}; 
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }

}



// import { collection, getDocs, query, where } from "firebase/firestore"
// import { db } from "../../firebase/firebaseConfig"

// export const getKnowledgeBank = async ({ isAdmin, teacherId, teacherIds }: { isAdmin: boolean, teacherId?: string, teacherIds?: string[] }) => {
//     const knowledgeBankRef = collection(db, 'knowledgeBank')

//     if (isAdmin) {
//         const knowledgeBankDocs = await getDocs(knowledgeBankRef)

//         const knowledgeBankData = knowledgeBankDocs.docs.map(doc => ({ ...doc.data(), id: doc.id }))

//         return knowledgeBankData
//     }
//     else if (teacherId) {
//         const knowledgeBankQuery = query(knowledgeBankRef, where('teacherId', '==', teacherId))
//         const knowledgeBankDocs = await getDocs(knowledgeBankQuery)

//         const knowledgeBankData = knowledgeBankDocs.docs.map(doc => ({ ...doc.data(), id: doc.id }))

//         return knowledgeBankData
//     }
//     else if (teacherIds?.length) {
//         const knowledgeBankQuery = query(knowledgeBankRef, where('teacherId', 'in', teacherIds))

//         const knowledgeBankDocs = await getDocs(knowledgeBankQuery)

//         const knowledgeBankData = knowledgeBankDocs.docs.map(doc => ({ ...doc.data(), id: doc.id }))

//         return knowledgeBankData
//     }
// }