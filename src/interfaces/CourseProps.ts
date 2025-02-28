export default interface CourseProps {
    id: string,
    _id:string,
    assessments?: string[],
    quizzes?: string[],
    lessons?: string[],
    createdAt: unknown,
    duration: number,
    programId: string,
    addedBy:string,
    courseName:string,
}

// export default interface CourseProps {
//     id?: string;
//     _id?: string;
//     programId: string;
//     courseName: string;
//     createdAt?: string;
//     duration?: number;
//     addedBy?: string;
//     assessments?: string[],
//     quizzes?: string[],
//     lessons?: string[],
// }
