import axios from "axios";

export async function getUserData() {
    const role = sessionStorage.getItem('role'); 
    const token=sessionStorage.getItem('token')
    const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;

    try {
        let endpoint = '';

        if (role === 'teacher') {
            endpoint = `${BASE_URL}/teacher/profile`;
        } else if (role === 'admin') {
            endpoint = `${BASE_URL}/admin/auth/profile`;
        } else if (role === 'student') {
            endpoint = `${BASE_URL}/student/profile`;
        } else {
            throw new Error('Invalid role');
        }

        const response = await axios.get(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', 
            }
        });
        const userData = response?.data?.data;

        // console.log('API Response:', userData); 
        
        if (!userData) {
            throw new Error('No data returned from API');
        }

        return userData || {}; 
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}




// import { doc, getDoc } from "firebase/firestore"
// import { db } from "../../firebase/firebaseConfig"

// export async function getUserData(uid: string)
//     {
//         try
//         {
//             const userRef = doc(db, 'students', uid ?? '')
//             const userSnapshot = await getDoc(userRef);
//             console.log("USER PROFILE",userSnapshot)
    
//             if(userSnapshot.exists())
//             {
//                 const userData = {...userSnapshot.data(), id: userSnapshot.id, role: 'student'}
//                 return userData
//             }
//             else
//             {
//                 const userRef = doc(db, 'teachers', uid ?? '')
//                 const userSnapshot = await getDoc(userRef)
        
//                 if(userSnapshot.exists())
//                 {
//                     const userData = {...userSnapshot.data(), id: userSnapshot.id, role: userSnapshot.data().email === import.meta.env.VITE_ADMIN_EMAIL ? 'admin' : 'teacher'}
//                     return userData
//                 }
//                 else
//                 {
//                     return null
//                 }
//             }
//         }
//         catch(e)
//         {
//             console.error(e)
//             return null
//         }
//     }