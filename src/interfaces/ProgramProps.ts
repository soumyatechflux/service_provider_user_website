interface FinalExamProps{
    'Version 1'?: string,
    'Version 2'?: string,
    'Version 3'?: string,
}

export default interface ProgramProps{
    id: string,
    _id?: number,
    category?: string,
    certificateRequest?: string,
    courses?: string[],
    description?: string,
    duration?: string,
    finalExams?: FinalExamProps,
    image?: string,
    name?: string,
    teacherId?: string,
    teacherShare?: string,
    totalFeedbacks?: number,
    averageRating?: number,
    prerequisites?: string[],
    paused?: boolean,
    expiry?: string,
    price?: string,
    level?: string,
    discount?: number,
    examBank?: boolean,
    knowledgeBank?: boolean,
    engineering?: boolean,
    projectManagement?: boolean,
    certificate?: boolean,
}

