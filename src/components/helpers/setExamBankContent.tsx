import { doc, collection, addDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"
import { setNotification } from "./setNotification"

export const setExamBankContent = async(majorId: string, title: string, ebContentId?: string) => {
    if(ebContentId)
    {
        const examBankRef = doc(db, 'examBank', majorId)
        const examBankContentRef = doc(db, 'examBankContent', ebContentId)

        await updateDoc(examBankRef, { content: arrayRemove(ebContentId) })
        await deleteDoc(examBankContentRef)
    }
    else
    {
        const examBankRef = doc(db, 'examBank', majorId)
        const examBankContentRef = collection(db, 'examBankContent')
    
    
        const examBankContentCreated = {
            majorId,
            title,
            questions: []
        }
    
        const newexamBankContent = await addDoc(examBankContentRef, examBankContentCreated)
    
        await setNotification(`${title} has been added to the Exam Bank!`, ['all'], [''], '/examBank')
        await updateDoc(examBankRef, { content: arrayUnion(newexamBankContent.id) })
    }
}