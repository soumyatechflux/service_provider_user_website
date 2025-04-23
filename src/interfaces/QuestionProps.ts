
export interface OptionProps{
    option:string
    is_correct:boolean
    questionId:string
    _id:string
}

export type QuestionProps = {
    examId: string
    question: string
    explanation: string
    duration: string
    questionFile: string
    _id: string
    options:OptionProps

}