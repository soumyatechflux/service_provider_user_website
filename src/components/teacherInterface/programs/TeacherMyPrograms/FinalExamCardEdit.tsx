
import { Box, Stack, Button, SvgIcon, Typography, Alert } from "@mui/material";
import { useMemo, memo, lazy, createContext, Suspense, useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setProgramFinalExam } from "../../../helpers/setProgramFinalExam";
import axios from "axios";
import { QuestionProps } from "../../../../interfaces/QuestionProps";
import Loader from "../../../Loader";
// import { setProgramFinalExam } from "../../../helpers/setProgramFinalExam";
const EditOptionQuestion = lazy(() => import("./EditOptionQuestionFinalExam"))
// const EditSelectQuestion = lazy(() => import("./EditSelectQuestionFinalExam"))
// const EditFiveOptionQuestion = lazy(() => import("./EditFiveOptionQuestionFinalExam"))

//@ts-expect-error context
export const EditFinalExamContext = createContext()

//@ts-expect-error anytype
function FinalExamCardEdit({ program, setEdited, finalExam,selectedExam }) {
    console.log("SET EDITED",setEdited)
    console.log("SELECTED EXAM",selectedExam)
    const [loading,setLoading]=useState(false)
    const queryClient = useQueryClient()
    const [selectedQuestion, setSelectedQuestion] = useState(-1)
    const [duration, setDuration] = useState(() => {
        if (!finalExam?.duration) return 0; // ✅ Default value if duration is undefined
        return parseInt(finalExam.duration.split(" ")[0]);
    });
    

    const [error, setError] = useState('')

    const fetchQuestions = async (finalExamId: string) => {
        const token = sessionStorage.getItem("token");
        const role = sessionStorage.getItem("role");
    
        const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
    
        try {
            const response = await axios.get(`${BASE_URL}/${role}/questions/${finalExamId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
    
            console.log("Question Response:", response?.data?.data);
            return response?.data?.data || []; // Ensure array return
        } catch (error) {
            console.error("Error fetching questions:", error);
            return []; // Return empty array to prevent crashes
        }
    };
    
    const { data: questions = [] } = useQuery({
        queryKey: ["finalExamEdit", selectedExam?._id, program?._id], // Ensure keys are correct
        queryFn: () => {
            if (!selectedExam?._id) {
                throw new Error("Final Exam ID is missing");
            }
            return fetchQuestions(selectedExam._id);
        },
        enabled: !!selectedExam?._id, // Prevents fetching when ID is missing
    });
    
    console.log("Final Exam Card Edit QUESTION", questions);
    
    console.log("Final Exam Card Edit QUESTION",questions)
    // const { mutate } = useMutation({

        
    //     onMutate: async () => {
    //         const previousData = queryClient.getQueryData(['finalExams', program?._id]);

    //         console.log("hello");
    //         console.log("Question",questions)
    
    //         queryClient.setQueryData(['finalExams', program?._id], (oldData: unknown) => {
    //             if (!Array.isArray(oldData)) return [];
    
    //             const filteredArray = oldData.filter(finalExamData => finalExamData?.id !== finalExam?.id);
    //             return [
    //                 ...filteredArray,
    //                 finalExam ? { ...finalExam, questions } : { title: "FinalExam", questions },
    //             ];
    //         });
    
    //         return () => queryClient.setQueryData(['finalExams', program?._id], previousData);
    //     },
    //     mutationFn: () => setProgramFinalExam(program, questions, duration, selectedExam),
    // });
    

    const mutation = useMutation({
        mutationFn: () => setProgramFinalExam(program, questions, duration, selectedExam,setLoading),
    
        onMutate: async () => {
            const previousData = queryClient.getQueryData(['finalExams', program?._id]);
    
            console.log("hello");
            console.log("Question", questions);
    
            queryClient.setQueryData(['finalExams', program?._id], (oldData: unknown) => {
                if (!Array.isArray(oldData)) return [];
    
                const filteredArray = oldData.filter(finalExamData => finalExamData?.id !== finalExam?.id);
                return [
                    ...filteredArray,
                    finalExam ? { ...finalExam, questions } : { title: "FinalExam", questions },
                ];
            });
    
            return () => queryClient.setQueryData(['finalExams', program?._id], previousData);
        },
    });
    
    const handleAddQuestion = useCallback(() => {
        // Create a default question object
        const defaultQuestion = {
            question: "",
            options: [
                { option: "", is_correct: true },
                { option: "", is_correct: false },
                { option: "", is_correct: false },
                { option: "", is_correct: false },
            ],
            type: "options",
        };

        // Update query client data
        queryClient.setQueryData(
            ["finalExamEdit", selectedExam?._id, program?._id],
            
            (oldData: any[]) => {
                const newData = oldData ? [...oldData, defaultQuestion] : [defaultQuestion];
                return newData;
            }
        );

        // Update selected question to the new question
        setSelectedQuestion(questions.length);

        // Optional: Refetch to ensure data consistency
        // refetch();
    }, [queryClient, selectedExam?._id, program?._id, questions.length]);
    
    
    
    const displayedQuestions = useMemo(() => {
        if (!questions || !Array.isArray(questions)) return []; // ✅ Prevents undefined errors
      
        return questions.map((question: QuestionProps, index: number) => (
          <Suspense key={index}>
            <EditOptionQuestion 
              program={program} 
              finalExam={selectedExam} 
              index={index} 
              question={question} 
            />
          </Suspense>
        ));
      }, [questions, selectedQuestion]); // ✅ Add `selectedQuestion` dependency
      
    

    const canSave =
        questions?.length > 0
            ?
            //@ts-expect-error questionnpm i
            !(questions?.find(question => {
                if (question?.type === 'options') {
                    return question?.question?.length === 0 || question?.options[0]?.length === 0 || question?.options[1]?.length === 0 || question?.options[2]?.length === 0 || question?.options[3]?.length === 0
                }
                else if (question?.type === 'fiveOptions') {
                    return question?.question?.length === 0 || question?.options[0]?.length === 0 || question?.options[1]?.length === 0 || question?.options[2]?.length === 0 || question?.options[3]?.length === 0 || question?.options[4]?.length === 0
                }
                else {
                    return question?.question?.length === 0 || question?.firstCorrect?.length === 0 || question?.secondCorrect?.length === 0 || question?.thirdCorrect?.length === 0 || question?.fourthCorrect?.length === 0 || question?.firstLabel?.length === 0 || question?.secondLabel?.length === 0 || question?.thirdLabel?.length === 0 || question?.fourthLabel?.length === 0
                }
            }))
            :
            true

    // const contextValue = useMemo(() => ({ handleQuestionChange }), [handleQuestionChange]);


    if(loading){
        return <Loader/>
    }
    return (

        <Box
            display='flex'
            flexDirection='column'
            bgcolor='#fff'
            py={2}
            flex={1}
        >
            {error && <Alert severity="error">{error}</Alert>}
            {displayedQuestions?.length > 0 && displayedQuestions[selectedQuestion]}
            <div className='flex flex-row items-center justify-center gap-4 ml-auto'>
                <p className='font-[Inter] font-semibold text-base'>Duration: </p>
                <input
                    value={questions?.duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    placeholder="Duration in Minutes"
                    type="number"
                    className='w-24 px-2 py-3 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.1)] rounded-sm font-[Inter]'
                />
            </div>
            <Stack
                flex={1}
                direction='column'
                justifyContent='space-between'
            >
                {
                    displayedQuestions?.length > 0 &&
                    <Stack
                        direction='row'
                        gap={12}
                        ml='auto'
                        mr='auto'
                        mt={4}
                    >
                        <Button
                            onClick={() => setSelectedQuestion(prev => prev - 1)}
                            disabled={selectedQuestion === 0}
                            sx={{
                                width: '120px',
                                height: '40px',
                                background: '#9D9D9D',
                                color: '#fff',
                                fontFamily: 'Inter',
                                fontSize: 14,
                                textTransform: 'none',
                                fontWeight: 500,
                                border: '0px',
                                borderRadius: '15px',
                                '&:hover': {
                                    background: '#9D9D9D',
                                    opacity: 1
                                },
                            }}
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={() => setSelectedQuestion(prev => prev + 1)}
                            disabled={selectedQuestion === displayedQuestions.length - 1}
                            sx={{
                                width: '120px',
                                height: '40px',
                                background: '#9D9D9D',
                                color: '#fff',
                                fontFamily: 'Inter',
                                fontSize: 14,
                                textTransform: 'none',
                                fontWeight: 500,
                                border: '0px',
                                borderRadius: '15px',
                                '&:hover': {
                                    background: '#9D9D9D',
                                    opacity: 1
                                },
                            }}
                        >
                            Next
                        </Button>
                    </Stack>
                }

                <Button
                    sx={{
                        background: 'linear-gradient(95deg, #226E9F 5.94%, #6A9DBC 95.69%)',
                        color: '#fff',
                        fontFamily: 'Inter',
                        fontSize: 18,
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: '8px',
                        '&:hover': {
                            background: 'linear-gradient(95deg, #226E9F 5.94%, #6A9DBC 95.69%)',
                            opacity: 1
                        },
                        paddingY: 1.95,
                        paddingX: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '160px',
                        alignSelf: 'flex-end'
                    }}
                    onClick={handleAddQuestion}
                >
                    <SvgIcon sx={{ fontSize: 20, fontWeight: 400 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                            <path d="M9.5 0V19M0 9.5H19" stroke="white" strokeWidth="2" />
                        </svg>
                    </SvgIcon>
                    <Typography noWrap fontFamily='Inter' fontSize={14}>Add Question</Typography>
                </Button>

            </Stack>
            <Stack
                flex={1}
                justifyContent='flex-end'
                direction='row'
                mt={3}
                pb={6}
                alignItems='center'
            >
                <Stack
                    gap={1.5}
                    flex={1}
                    minHeight='75px'
                >

                </Stack>
                <Stack
                    direction='row'
                    gap={3}
                    mt='auto'
                >
                    <Button
                        sx={{
                            width: '120px',
                            height: '35px',
                            background: '#fff',
                            color: '#226E9F',
                            fontFamily: 'Inter',
                            fontSize: 14,
                            textTransform: 'none',
                            fontWeight: 500,
                            border: '1px solid #226E9F',
                            borderRadius: '8px',
                            '&:hover': {
                                background: '#fff',
                                opacity: 1
                            },
                        }}
                        onClick={() => {
                            setEdited('')
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{
                            width: '120px',
                            height: '35px',
                            background: '#6A9DBC',
                            color: '#fff',
                            fontFamily: 'Inter',
                            fontSize: 14,
                            textTransform: 'none',
                            fontWeight: 500,
                            border: '1px solid #6A9DBC',
                            borderRadius: '8px',
                            '&:hover': {
                                background: '#6A9DBC',
                                opacity: 1
                            },
                        }}
                        onClick={() => {
                            if (canSave) {
                                setEdited('')
                               mutation.mutate()
                            }
                            else {
                                setError('Please Enter All Details!')
                            }
                        }}
                        disabled={mutation.isPending} // Disable button while loading
                    >
                        {mutation.isPending ? "confirming..." : "Confirm"}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    )
}

const memoizedFinalExamCardEdit = memo(FinalExamCardEdit)
export default memoizedFinalExamCardEdit