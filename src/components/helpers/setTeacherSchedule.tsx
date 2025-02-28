import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"

export const setTeacherSchedule = async(teacherScheduleId: string, numberOfDays: number, slots: [], hourlyRate: string) => {
    const teacherScheduleDoc = doc(db, 'teacherSchedule', teacherScheduleId)
    const teacherScheduleData = await getDoc(teacherScheduleDoc)

    const newTeacherSchedule = {
        ...teacherScheduleData.data(),
        numberOfDays,
        slots: slots.slice(0, numberOfDays),
        hourlyRate
    }

    await updateDoc(teacherScheduleDoc, newTeacherSchedule)
}