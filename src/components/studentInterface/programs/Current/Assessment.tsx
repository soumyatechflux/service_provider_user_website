import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useContext, useEffect, useState } from "react";
import ExamQuestionOptions from "./ExamQuestionOptions";
// import ExamQuestionSelects from "./ExamQuestionSelects";
// import ExamQuestionPic from "./ExamQuestionPic";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { AuthContext } from "../../../authentication/auth/AuthProvider";
import { getExamSession } from "../../../helpers/getExamSession";
import { setExamSessionTime } from "../../../helpers/setExamSessionTime";
import ExamQuestionSelects from "./ExamQuestionSelects";
import ExamQuestionTwoOptions from "./ExamQuestionTwoOptions";
import ExamFiveQuestionThreeOptions from "./ExamFiveQuestionThreeOptions";
import { setSubmitExamSessionAssessment } from "../../../helpers/setSubmitExamSessionAssessment";

export default function Assessment() {
    //@ts-expect-error context
    const { userData } = useContext(AuthContext)
    const queryClient = useQueryClient()

    const navigate = useNavigate()

    const [timeDifference, setTimeDifference] = useState<number>()

    const { data: examSession, isLoading } = useQuery({
        queryKey: ['examSession'],
        queryFn: () => getExamSession(userData.id)
    })


    const { mutate: mutateSession } = useMutation({
        onMutate: () => {
            const previousData = queryClient.getQueryData(['examSession'])

            queryClient.setQueryData(['examSession'], () => {
                return []
            })

            return () => queryClient.setQueryData(['examSession'], previousData)
        },
        mutationFn: () => handleSetExamSessionTime()
    })

    //@ts-expect-error test
    const startTime = (examSession[0]?.startTime)?.toDate()
    //@ts-expect-error test
    const endTime = (examSession[0]?.endTime)?.toDate()

    // const [index, setIndex] = useState(Number(localStorage.getItem('index')) || 0)
    // const [questions, setQuestions] = useState<number[]>([])


    const { id } = useParams()

    const getAssessment = async (id: string) => {
        const assessmentRef = doc(db, 'assessments', id)
        const assessmentDoc = await getDoc(assessmentRef)

        const assessmentData = { ...assessmentDoc.data(), id: assessmentDoc.id }

        return assessmentData
    }

    const { data: assessment } = useQuery({
        queryKey: ['examSessionAssessment'],
        queryFn: () => getAssessment(id ?? '')
    })

    const handleSetExamSessionTime = async () => {
        //@ts-expect-error course
        const courseDoc = doc(db, 'courses', assessment?.courseId)
        const courseData = await getDoc(courseDoc)
        //@ts-expect-error session
        await setExamSessionTime(examSession[0]?.id ?? '', userData.id, `/programs/current/${courseData.data()?.programId}`)
        //await queryClient.invalidateQueries({ queryKey: ['examSession'] })
    }

    // console.log(assessment)

    useEffect(() => {
        const interval = setInterval(() => {
            if (startTime && endTime) {
                const difference = endTime - Timestamp.now().toMillis()
                if (difference > 0) {
                    setTimeDifference(difference)
                }
                else {
                    mutateSession()
                    navigate('/')
                }
            }
        }, 1000)

        return () => clearInterval(interval)
        //eslint-disable-next-line
    }, [startTime, endTime, timeDifference])

    // useEffect(() => {

    // }, [])

    // useEffect(() => {
    //     setQuestions([1, 2, 3, 4])
    // }, [])

    // useEffect(() => {
    //     localStorage.setItem('index', JSON.stringify(index))
    // }, [index])

    // //@ts-expect-error errrrr
    // const displayedQuestions = assessment?.questions?.map((question, index) =>
    //     question.type === 'options' ?
    //         question.correctOption.length > 1 ?
    //             //@ts-expect-error errrrr
    //             <ExamQuestionTwoOptions assessmentId={assessment.id} question={question} index={index} total={assessment?.questions?.length} /> :
    //             //@ts-expect-error errrrr
    //             <ExamQuestionOptions assessmentId={assessment.id} question={question} index={index} total={assessment?.questions?.length} /> :
    //         question.type === 'fiveOptions' ?
    //             question.correctOption.length > 2 ?
    //                 //@ts-expect-error errrrr
    //                 <ExamFiveQuestionThreeOptions assessmentId={assessment.id} question={question} index={index} total={assessment?.questions?.length} /> :
    //                 question.correctOption.length > 1 ?
    //                     //@ts-expect-error errrrr
    //                     <ExamQuestionTwoOptions assessmentId={assessment.id} question={question} index={index} total={assessment?.questions?.length} /> :
    //                     //@ts-expect-error errrrr
    //                     <ExamQuestionOptions assessmentId={assessment.id} question={question} index={index} total={assessment?.questions?.length} /> :
    //             //@ts-expect-error errrrr
    //             <ExamQuestionSelects assessmentId={assessment.id} question={question} index={index} total={assessment?.questions?.length} />
    // )

    const handleExitExam = async () => {
        if (assessment?.id) {
            await setSubmitExamSessionAssessment(userData.id, assessment.id)
        }
        await queryClient.invalidateQueries({ queryKey: ['examSession'] })
        navigate('/')
    }

    if (isLoading) return <></>
    else return (
        <Box
            width='100%'
            position='relative'
        >
            <Stack
                justifyContent='space-between'
                direction='row'
            >
                <Stack
                    direction='column'
                    bgcolor='#D0EBFC'
                    px={12}
                    py={4}
                >
                    <Typography sx={{ color: '#FF7E00' }} fontSize={16} fontFamily='Inter' fontWeight={800}>Assessment</Typography>
                </Stack>
                <Box
                    boxShadow='0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                    textAlign='center'
                    borderRadius='15px'
                    mr={14}
                    mt={4}
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    height='60px'
                    width='180px'
                >
                    <Typography fontSize={16} fontFamily='Inter' fontWeight={500}>
                        {timeDifference ? Math.floor(timeDifference / (1000 * 60 * 60)).toString().length > 1 ? Math.floor(timeDifference / (1000 * 60 * 60)) : `0${timeDifference && Math.floor(timeDifference / (1000 * 60 * 60))}` : '00'}:{timeDifference ? Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)).toString().length > 1 ? Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)) : `0${timeDifference && Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))}` : '00'}:{timeDifference ? Math.floor((timeDifference % (1000 * 60)) / 1000).toString().length > 1 ? Math.floor((timeDifference % (1000 * 60)) / 1000) : `0${timeDifference && Math.floor((timeDifference % (1000 * 60)) / 1000)}` : '00'}
                    </Typography>
                </Box>
            </Stack>
            <Box
                width='100%'
                display='flex'
                justifyContent='center'
                alignItems='center'
            >
                {

                    // <ExamQuestionOptions 
                    //     number={questions[index]} 
                    //     setIndex={setIndex}
                    //     total={questions.length}
                    // />
                    // : index === 1 ?
                    // <ExamQuestionSelects
                    //     number={questions[index]} 
                    //     setIndex={setIndex}
                    //     total={questions.length}
                    // />
                    // : index === 2 ?
                    // <ExamQuestionPic
                    //     number={questions[index]} 
                    //     setIndex={setIndex}
                    //     total={questions.length}
                    // />
                    // :
                    // <ExamQuestionOptions 
                    //     number={questions[index]} 
                    //     setIndex={setIndex}
                    //     total={questions.length}
                    // />
                    //@ts-expect-error lastQuestion
                    assessment?.questions?.length && assessment?.questions?.map((question, index) =>
                        question.type === 'options' ?
                            question.correctOption.length > 1 ?
                                //@ts-expect-error errrrr
                                <ExamQuestionTwoOptions hidden={index !== Number(examSession[0]?.lastQuestion)} key={index} assessmentId={assessment.id} question={question} index={index} total={assessment?.questions?.length} /> :
                                //@ts-expect-error errrrr
                                <ExamQuestionOptions hidden={index !== Number(examSession[0]?.lastQuestion)} key={index} assessmentId={assessment.id} question={question} index={index} total={assessment?.questions?.length} /> :
                            question.type === 'fiveOptions' ?
                                question.correctOption.length > 2 ?
                                    //@ts-expect-error errrrr
                                    <ExamFiveQuestionThreeOptions hidden={index !== Number(examSession[0]?.lastQuestion)} key={index} assessmentId={assessment.id} question={question} index={index} total={assessment?.questions?.length} /> :
                                    question.correctOption.length > 1 ?
                                        //@ts-expect-error errrrr
                                        <ExamQuestionTwoOptions hidden={index !== Number(examSession[0]?.lastQuestion)} key={index} assessmentId={assessment.id} question={question} index={index} total={assessment?.questions?.length} /> :
                                        //@ts-expect-error errrrr
                                        <ExamQuestionOptions hidden={index !== Number(examSession[0]?.lastQuestion)} key={index} assessmentId={assessment.id} question={question} index={index} total={assessment?.questions?.length} /> :
                                //@ts-expect-error errrrr
                                <ExamQuestionSelects hidden={index !== Number(examSession[0]?.lastQuestion)} key={index} assessmentId={assessment.id} question={question} index={index} total={assessment?.questions?.length} />
                    )
                }
            </Box>
            <div className='absolute flex flex-col gap-2 w-fit text-left items-end justify-end text-[#FF7E00] font-[Inter] bottom-10 left-5 z-50'>
                <button className='bg-[#FF7E00] text-white px-4 py-2 rounded-md' onClick={() => handleExitExam()}>
                    Exit Exam
                </button>
            </div>
        </Box>
    )
}
