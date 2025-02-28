import { Box, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import ExamQuestionOptions from './ExamQuestionOptions'
import ExamQuestionSelects from './ExamQuestionSelects'
import ExamQuestionTwoOptions from './ExamQuestionTwoOptions'
import ExamFiveQuestionThreeOptions from './ExamFiveQuestionThreeOptions'
import { Timestamp } from 'firebase/firestore'

interface Props {
    id: string,
    questions: [],
    majorId: string,
    title: string
    duration?: string
}

export default function QuizBank(ebContent: Props) {
    const [number, setNumber] = useState(0)
    const [examEnded, setExamEnded] = useState(false)

    const duration = ebContent?.duration?.split(' ')[0] ?? '0'
    const durationInMinutes = parseInt(duration ?? 0)
    const [timeDifference, setTimeDifference] = useState<number>()

    const startTime = useMemo(() => new Date(), [])
    const endTime = useMemo(() => {
        const end = new Date()
        end.setMinutes(end.getMinutes() + durationInMinutes)
        return end
    }, [durationInMinutes])

    console.log(endTime)

    // const displayedQuestions = ebContent?.questions?.map((question, index) =>
    //     //@ts-expect-error errrrr
    //     question.type === 'options' ?
    //         //@ts-expect-error errrrr
    //         question.correctOption.length > 1 ?
    //             <ExamQuestionTwoOptions key={index} examEnded={examEnded} setNumber={setNumber} question={question} index={index} total={ebContent?.questions?.length} /> :
    //             <ExamQuestionOptions key={index} examEnded={examEnded} setNumber={setNumber} question={question} index={index} total={ebContent?.questions?.length} /> :
    //         //@ts-expect-error errrrr
    //         question.type === 'fiveOptions' ?
    //             //@ts-expect-error errrrr
    //             question.correctOption.length > 2 ?
    //                 <ExamFiveQuestionThreeOptions key={index} examEnded={examEnded} setNumber={setNumber} question={question} index={index} total={ebContent?.questions?.length} /> :
    //                 //@ts-expect-error errrrr
    //                 question.correctOption.length > 1 ?
    //                     <ExamQuestionTwoOptions key={index} examEnded={examEnded} setNumber={setNumber} question={question} index={index} total={ebContent?.questions?.length} /> :
    //                     <ExamQuestionOptions key={index} examEnded={examEnded} setNumber={setNumber} question={question} index={index} total={ebContent?.questions?.length} /> :
    //             <ExamQuestionSelects key={index} examEnded={examEnded} setNumber={setNumber} question={question} index={index} total={ebContent?.questions?.length} />
    // )

    // function handleNext()
    // {
    //     setSelectedOption(0)
    //     setNumber(prev => prev + 1)
    // }
    useEffect(() => {
        const interval = setInterval(() => {
            if (startTime && endTime) {
                const difference = endTime.getTime() - Timestamp.now().toMillis()
                if (difference > 0) {
                    setTimeDifference(difference)
                }
                else {
                    setExamEnded(true)
                }
            }
        }, 1000)

        return () => clearInterval(interval)
        //eslint-disable-next-line
    }, [startTime, endTime, timeDifference])

    return (
        <Stack
            flex={1}
            mt={8}
            mb={8}
            alignItems='center'
        >
            <Box
                boxShadow='0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                textAlign='center'
                borderRadius='15px'
                mr={34}
                mt={4}
                display='flex'
                justifyContent='center'
                alignItems='center'
                height='60px'
                width='180px'
                ml='auto'
            >
                <Typography fontSize={16} fontFamily='Inter' fontWeight={500}>
                    {timeDifference ? Math.floor(timeDifference / (1000 * 60 * 60)).toString().length > 1 ? Math.floor(timeDifference / (1000 * 60 * 60)) : `0${timeDifference && Math.floor(timeDifference / (1000 * 60 * 60))}` : '00'}:{timeDifference ? Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)).toString().length > 1 ? Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)) : `0${timeDifference && Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))}` : '00'}:{timeDifference ? Math.floor((timeDifference % (1000 * 60)) / 1000).toString().length > 1 ? Math.floor((timeDifference % (1000 * 60)) / 1000) : `0${timeDifference && Math.floor((timeDifference % (1000 * 60)) / 1000)}` : '00'}
                </Typography>
            </Box>
            <Stack
                width='fit-content'
                boxShadow='0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                direction='column'
                gap={4}
                alignItems='center'
                py={8}
                px={32}
                borderRadius='15px'
            >
                {/* <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    // alignSelf='stretch'
                    // mx={14}
                    width='760px'
                    >
                    <Typography></Typography>
                    <Typography>Q{number}: What color is an Orange</Typography>
                    <Typography sx={{ justifySelf: 'flex-end' }}>{number}/{4}</Typography>
                </Stack>
                <Stack 
                    flex={1}
                    gap={4}
                    >
                    <Box
                        boxShadow={selectedOption === 1 ? '0px 0px 0px 2px rgba(0,195,66,1)' :'0px 0px 0px 1px rgba(0,0,0,1)'}
                        borderRadius='10px'
                        sx={{
                            textIndent: '25px',
                            cursor: 'pointer'
                        }}
                        width='790px'
                        position='relative'
                        py={2}
                        onClick={() => setSelectedOption(1)}
                        >
                            <Typography>Orange</Typography>
                            {
                                selectedOption === 1 &&
                                <SvgIcon sx={{ position: 'absolute', left: '94%', top: '28%' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="27" viewBox="0 0 28 27" fill="none">
                                        <circle cx="13.5312" cy="13.5" r="13" fill="#00C342" stroke="#00C342"/>
                                        <path d="M13.5312 26C16.0035 26 18.4203 25.2669 20.4759 23.8934C22.5315 22.5199 24.1336 20.5676 25.0797 18.2835C26.0258 15.9995 26.2734 13.4861 25.7911 11.0614C25.3087 8.63661 24.1182 6.40933 22.3701 4.66117C20.6219 2.91301 18.3946 1.7225 15.9699 1.24019C13.5451 0.757874 11.0318 1.00542 8.7477 1.95151C6.46363 2.89761 4.5114 4.49976 3.13788 6.55538C1.76436 8.61099 1.03125 11.0277 1.03125 13.5C1.03125 16.8152 2.34821 19.9946 4.69241 22.3388C7.03662 24.683 10.216 26 13.5312 26ZM7.04261 13.8295C7.25552 13.6179 7.54354 13.4991 7.84375 13.4991C8.14396 13.4991 8.43197 13.6179 8.64488 13.8295L11.2585 16.4432L17.8381 9.86364C18.0555 9.67747 18.3351 9.58019 18.6211 9.59124C18.9071 9.60229 19.1784 9.72085 19.3808 9.92323C19.5831 10.1256 19.7017 10.3969 19.7127 10.6829C19.7238 10.9689 19.6265 11.2485 19.4403 11.4659L12.054 18.8523C11.8411 19.0639 11.553 19.1827 11.2528 19.1827C10.9526 19.1827 10.6646 19.0639 10.4517 18.8523L7.04261 15.4432C6.9361 15.3375 6.85156 15.2119 6.79387 15.0734C6.73618 14.9349 6.70648 14.7864 6.70648 14.6364C6.70648 14.4864 6.73618 14.3378 6.79387 14.1993C6.85156 14.0609 6.9361 13.9352 7.04261 13.8295Z" fill="white"/>
                                    </svg>
                                </SvgIcon>
                            }
                    </Box>
                    <Box
                        boxShadow={selectedOption === 2 ? '0px 0px 0px 2px rgba(255,0,0,1)' :'0px 0px 0px 1px rgba(0,0,0,1)'}
                        borderRadius='10px'
                        sx={{
                            textIndent: '25px',
                            cursor: 'pointer'
                        }}
                        width='790px'
                        position='relative'
                        py={2}
                        onClick={() => setSelectedOption(2)}
                        >
                            <Typography>Orange</Typography>
                            {
                                selectedOption === 2 &&
                                <SvgIcon sx={{ position: 'absolute', left: '94%', top: '28%', background: '#ff0000', borderRadius: '50%' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="25" viewBox="0 0 26 25" fill="none">
                                        <path d="M18.0637 16.2672C18.1851 16.3907 18.2531 16.5569 18.2531 16.73C18.2531 16.9032 18.1851 17.0694 18.0637 17.1929L17.2241 18.0324C17.1007 18.1538 16.9345 18.2218 16.7613 18.2218C16.5882 18.2218 16.4219 18.1538 16.2985 18.0324L12.5313 14.2724L8.76403 18.0396C8.64057 18.161 8.47435 18.229 8.3012 18.229C8.12806 18.229 7.96184 18.161 7.83837 18.0396L6.99882 17.2001C6.87743 17.0766 6.8094 16.9104 6.8094 16.7372C6.8094 16.5641 6.87743 16.3979 6.99882 16.2744L10.7589 12.5L6.99164 8.73278C6.87025 8.60931 6.80223 8.44309 6.80223 8.26995C6.80223 8.0968 6.87025 7.93058 6.99164 7.80712L7.8312 6.96756C7.95466 6.84617 8.12088 6.77815 8.29403 6.77815C8.46717 6.77815 8.63339 6.84617 8.75686 6.96756L12.5313 10.7276L16.2985 6.96039C16.4219 6.839 16.5882 6.77097 16.7613 6.77097C16.9345 6.77097 17.1007 6.839 17.2241 6.96039L18.0637 7.79994C18.1851 7.92341 18.2531 8.08962 18.2531 8.26277C18.2531 8.43592 18.1851 8.60213 18.0637 8.7256L14.3036 12.5L18.0637 16.2672ZM12.5313 0C10.059 0 7.64224 0.733112 5.58663 2.10663C3.53101 3.48015 1.92886 5.43238 0.982761 7.71645C0.0366661 10.0005 -0.210876 12.5139 0.27144 14.9386C0.753755 17.3634 1.94426 19.5907 3.69242 21.3388C5.44058 23.087 7.66786 24.2775 10.0926 24.7598C12.5174 25.2421 15.0307 24.9946 17.3148 24.0485C19.5989 23.1024 21.5511 21.5002 22.9246 19.4446C24.2981 17.389 25.0312 14.9723 25.0312 12.5C25.0312 9.18479 23.7143 6.00537 21.3701 3.66116C19.0259 1.31696 15.8465 0 12.5313 0Z" fill="white"/>
                                    </svg>
                                </SvgIcon>
                            }
                    </Box>
                    <Box
                        boxShadow={selectedOption === 3 ? '0px 0px 0px 2px rgba(255,0,0,1)' :'0px 0px 0px 1px rgba(0,0,0,1)'}
                        borderRadius='10px'
                        sx={{
                            textIndent: '25px',
                            cursor: 'pointer'
                        }}
                        width='790px'
                        position='relative'
                        py={2}
                        onClick={() => setSelectedOption(3)}
                        >
                            <Typography>Orange</Typography>
                            {
                                selectedOption === 3 &&
                                <SvgIcon sx={{ position: 'absolute', left: '94%', top: '28%', background: '#ff0000', borderRadius: '50%' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="25" viewBox="0 0 26 25" fill="none">
                                        <path d="M18.0637 16.2672C18.1851 16.3907 18.2531 16.5569 18.2531 16.73C18.2531 16.9032 18.1851 17.0694 18.0637 17.1929L17.2241 18.0324C17.1007 18.1538 16.9345 18.2218 16.7613 18.2218C16.5882 18.2218 16.4219 18.1538 16.2985 18.0324L12.5313 14.2724L8.76403 18.0396C8.64057 18.161 8.47435 18.229 8.3012 18.229C8.12806 18.229 7.96184 18.161 7.83837 18.0396L6.99882 17.2001C6.87743 17.0766 6.8094 16.9104 6.8094 16.7372C6.8094 16.5641 6.87743 16.3979 6.99882 16.2744L10.7589 12.5L6.99164 8.73278C6.87025 8.60931 6.80223 8.44309 6.80223 8.26995C6.80223 8.0968 6.87025 7.93058 6.99164 7.80712L7.8312 6.96756C7.95466 6.84617 8.12088 6.77815 8.29403 6.77815C8.46717 6.77815 8.63339 6.84617 8.75686 6.96756L12.5313 10.7276L16.2985 6.96039C16.4219 6.839 16.5882 6.77097 16.7613 6.77097C16.9345 6.77097 17.1007 6.839 17.2241 6.96039L18.0637 7.79994C18.1851 7.92341 18.2531 8.08962 18.2531 8.26277C18.2531 8.43592 18.1851 8.60213 18.0637 8.7256L14.3036 12.5L18.0637 16.2672ZM12.5313 0C10.059 0 7.64224 0.733112 5.58663 2.10663C3.53101 3.48015 1.92886 5.43238 0.982761 7.71645C0.0366661 10.0005 -0.210876 12.5139 0.27144 14.9386C0.753755 17.3634 1.94426 19.5907 3.69242 21.3388C5.44058 23.087 7.66786 24.2775 10.0926 24.7598C12.5174 25.2421 15.0307 24.9946 17.3148 24.0485C19.5989 23.1024 21.5511 21.5002 22.9246 19.4446C24.2981 17.389 25.0312 14.9723 25.0312 12.5C25.0312 9.18479 23.7143 6.00537 21.3701 3.66116C19.0259 1.31696 15.8465 0 12.5313 0Z" fill="white"/>
                                    </svg>
                                </SvgIcon>
                            }
                    </Box>
                    <Box
                        boxShadow={selectedOption === 4 ? '0px 0px 0px 2px rgba(255,0,0,1)' :'0px 0px 0px 1px rgba(0,0,0,1)'}
                        borderRadius='10px'
                        sx={{
                            textIndent: '25px',
                            cursor: 'pointer'
                        }}
                        width='790px'
                        position='relative'
                        py={2}
                        onClick={() => setSelectedOption(4)}
                        >
                            <Typography>Orange</Typography>
                            {
                                selectedOption === 4 &&
                                <SvgIcon sx={{ position: 'absolute', left: '94%', top: '28%', background: '#ff0000', borderRadius: '50%' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="25" viewBox="0 0 26 25" fill="none">
                                        <path d="M18.0637 16.2672C18.1851 16.3907 18.2531 16.5569 18.2531 16.73C18.2531 16.9032 18.1851 17.0694 18.0637 17.1929L17.2241 18.0324C17.1007 18.1538 16.9345 18.2218 16.7613 18.2218C16.5882 18.2218 16.4219 18.1538 16.2985 18.0324L12.5313 14.2724L8.76403 18.0396C8.64057 18.161 8.47435 18.229 8.3012 18.229C8.12806 18.229 7.96184 18.161 7.83837 18.0396L6.99882 17.2001C6.87743 17.0766 6.8094 16.9104 6.8094 16.7372C6.8094 16.5641 6.87743 16.3979 6.99882 16.2744L10.7589 12.5L6.99164 8.73278C6.87025 8.60931 6.80223 8.44309 6.80223 8.26995C6.80223 8.0968 6.87025 7.93058 6.99164 7.80712L7.8312 6.96756C7.95466 6.84617 8.12088 6.77815 8.29403 6.77815C8.46717 6.77815 8.63339 6.84617 8.75686 6.96756L12.5313 10.7276L16.2985 6.96039C16.4219 6.839 16.5882 6.77097 16.7613 6.77097C16.9345 6.77097 17.1007 6.839 17.2241 6.96039L18.0637 7.79994C18.1851 7.92341 18.2531 8.08962 18.2531 8.26277C18.2531 8.43592 18.1851 8.60213 18.0637 8.7256L14.3036 12.5L18.0637 16.2672ZM12.5313 0C10.059 0 7.64224 0.733112 5.58663 2.10663C3.53101 3.48015 1.92886 5.43238 0.982761 7.71645C0.0366661 10.0005 -0.210876 12.5139 0.27144 14.9386C0.753755 17.3634 1.94426 19.5907 3.69242 21.3388C5.44058 23.087 7.66786 24.2775 10.0926 24.7598C12.5174 25.2421 15.0307 24.9946 17.3148 24.0485C19.5989 23.1024 21.5511 21.5002 22.9246 19.4446C24.2981 17.389 25.0312 14.9723 25.0312 12.5C25.0312 9.18479 23.7143 6.00537 21.3701 3.66116C19.0259 1.31696 15.8465 0 12.5313 0Z" fill="white"/>
                                    </svg>
                                </SvgIcon>
                            }
                    </Box>
                </Stack> */}
                {ebContent?.questions?.map((question, index) =>
                    //@ts-expect-error errrrr
                    question.type === 'options' ?
                        //@ts-expect-error errrrr
                        question.correctOption.length > 1 ?
                            <ExamQuestionTwoOptions setExamEnded={setExamEnded} hidden={index !== number} key={index} examEnded={examEnded} setNumber={setNumber} question={question} index={index} total={ebContent?.questions?.length} /> :
                            <ExamQuestionOptions setExamEnded={setExamEnded} hidden={index !== number} key={index} examEnded={examEnded} setNumber={setNumber} question={question} index={index} total={ebContent?.questions?.length} /> :
                        //@ts-expect-error errrrr
                        question.type === 'fiveOptions' ?
                            //@ts-expect-error errrrr
                            question.correctOption.length > 2 ?
                                <ExamFiveQuestionThreeOptions setExamEnded={setExamEnded} hidden={index !== number} key={index} examEnded={examEnded} setNumber={setNumber} question={question} index={index} total={ebContent?.questions?.length} /> :
                                //@ts-expect-error errrrr
                                question.correctOption.length > 1 ?
                                    <ExamQuestionTwoOptions setExamEnded={setExamEnded} hidden={index !== number} key={index} examEnded={examEnded} setNumber={setNumber} question={question} index={index} total={ebContent?.questions?.length} /> :
                                    <ExamQuestionOptions setExamEnded={setExamEnded} hidden={index !== number} key={index} examEnded={examEnded} setNumber={setNumber} question={question} index={index} total={ebContent?.questions?.length} /> :
                            <ExamQuestionSelects setExamEnded={setExamEnded} hidden={index !== number} key={index} examEnded={examEnded} setNumber={setNumber} question={question} index={index} total={ebContent?.questions?.length} />
                )}
                {/* <Stack
                    direction='row'
                    gap={2}
                    >
                    <Button
                        sx={{
                            width: '180px',
                            height: '54px',
                            background: '#D0EBFC',
                            color: '#000',
                            fontFamily: 'Inter',
                            fontSize: 14,
                            textTransform: 'none',
                            fontWeight: 500,
                            border: '0px',
                            borderRadius: '15px',
                            '&:hover': {
                                background: '#FEF4EB',
                                opacity: 1
                            },
                            marginBottom: 3
                        }}
                        // onClick={handleNext}
                        >
                        Skip
                    </Button>
                    <Button
                        sx={{
                            width: '180px',
                            height: '54px',
                            background: '#226E9F',
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
                            marginBottom: 3
                        }}
                        >
                        Next
                    </Button>
                </Stack> */}
                {/* {
                    selectedOption !== 1 &&
                    <Stack
                        bgcolor='#FEF4EB'
                        borderRadius='20px'
                        width='740px'
                        p={3}
                        textAlign='center'
                        border='2px solid #FF9F06'
                    >
                        <Typography
                            fontWeight={500}
                            fontFamily='Inter'
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </Typography>
                    </Stack>
                } */}
            </Stack>
        </Stack>
    )
}
