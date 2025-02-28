// import { doc, collection, addDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore"
// import { getStorage, ref, uploadBytes } from "firebase/storage"
// import { db } from "../../firebase/firebaseConfig"
// import { setNotification } from "./setNotification"

// export const setKnowledgeBankContent = async(majorId: string, title: string, file: unknown, kbContentId?: string) => {
//     if(kbContentId)
//     {
//         const knowledgeBankRef = doc(db, 'knowledgeBank', majorId)
//         const knowledgeBankContentRef = doc(db, 'knowledgeBankContent', kbContentId)

//         await updateDoc(knowledgeBankRef, { content: arrayRemove(kbContentId) })
//         await deleteDoc(knowledgeBankContentRef)
//     }
//     else
//     {
//         const knowledgeBankRef = doc(db, 'knowledgeBank', majorId)
//         const knowledgeBankContentRef = collection(db, 'knowledgeBankContent')
    
//         const storage = getStorage()
//         //@ts-expect-error file
//         const storageRef = ref(storage, 'KnowledgeBank/' + file.name)
    
//         //@ts-expect-error file
//         await uploadBytes(storageRef, file)
    
//         const knowledgeBankContentCreated = {
//             majorId,
//             title,
//             type: 'KnowledgeBank/',
//             //@ts-expect-error file
//             content: file.name
//         }
    
//         const newknowledgeBankContent = await addDoc(knowledgeBankContentRef, knowledgeBankContentCreated)
    
//         await setNotification(`${title} has been added to the Knowledge Bank!`, ['all'], [''], '/knowledgeBank')
//         await updateDoc(knowledgeBankRef, { content: arrayUnion(newknowledgeBankContent.id) })
//     }
// }


import { doc, collection, addDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "../../firebase/firebaseConfig";
import { setNotification } from "./setNotification";

export const setKnowledgeBankContent = async (majorId: string, title: string, file: File, kbContentId?: string) => {
    if (kbContentId) {
        const knowledgeBankRef = doc(db, 'knowledgeBank', majorId);
        const knowledgeBankContentRef = doc(db, 'knowledgeBankContent', kbContentId);

        await updateDoc(knowledgeBankRef, { content: arrayRemove(kbContentId) });
        await deleteDoc(knowledgeBankContentRef);
    } else {
        const knowledgeBankRef = doc(db, 'knowledgeBank', majorId);
        const knowledgeBankContentRef = collection(db, 'knowledgeBankContent');

        const storage = getStorage();
        const fileExtension = file.name.split('.').pop()?.toLowerCase(); // Ensure lowercase
        const filePath = `KnowledgeBank/${file.name}`;

        // Allowed file types (Including CSV)
        const allowedTypes: Record<string, string> = {
            'pdf': 'application/pdf',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xls': 'application/vnd.ms-excel',
            'csv': 'text/csv',
            'mp4': 'video/mp4',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        };

        if (!fileExtension || !allowedTypes[fileExtension]) {
            alert("Unsupported file type. Please upload a PDF, Word, Excel, CSV, or MP4 file.");
            return;
        }

        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, file);

        const knowledgeBankContentCreated = {
            majorId,
            title,
            type: allowedTypes[fileExtension], // Store actual file type
            content: file.name
        };

        const newknowledgeBankContent = await addDoc(knowledgeBankContentRef, knowledgeBankContentCreated);

        await setNotification(`${title} has been added to the Knowledge Bank!`, ['all'], [''], '/knowledgeBank');
        await updateDoc(knowledgeBankRef, { content: arrayUnion(newknowledgeBankContent.id) });
    }
};
