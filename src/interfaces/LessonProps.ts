export default interface LessonProps{
    id: string,
    _id:string,
    courseId: string,
    createdAt: unknown,
    description: string,
    duration: string,
    title: string,
    lessonTitle:string,
    lessonDescription:string,
    lessonFile:File | string |null,

}