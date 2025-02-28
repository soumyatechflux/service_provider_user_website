import { Box, Stack, SvgIcon, Typography, Avatar, Button, CircularProgress, Dialog } from "@mui/material";
import ProgramProps from "../../../../interfaces/ProgramProps";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAssessmentsData } from "../../../helpers/getAssessmentsData";
import { getCoursesData } from "../../../helpers/getCoursesData";
import { getLessonsData } from "../../../helpers/getLessonsData";
import { getQuizzesData } from "../../../helpers/getQuizzesData";
import { getStudentCount } from "../../../helpers/getStudentCount";
// import { getStudentRequest } from "../../../helpers/getStudentRequest";
import { getTeacherDataFromProgram } from "../../../helpers/getTeacherDataFromProgram";
import { useNavigate } from "react-router-dom";
import { setStudentRepurchaseProgram } from "../../../helpers/setStudentRepurchaseProgram";
import { useContext, useState } from "react";
import { AuthContext } from "../../../authentication/auth/AuthProvider";
import { loadStripe } from '@stripe/stripe-js'
import axios from "axios";
import { and, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";

export default function ProgramCurrentExpired(program: ProgramProps) {
    const queryClient = useQueryClient()

    const navigate = useNavigate()

    //@ts-expect-error context
    const { userData } = useContext(AuthContext)

    const [loading, setLoading] = useState(false)

    const { data: prereqsData } = useQuery({
        queryKey: ['preReqData', program?.id ?? ''],
        //@ts-expect-error err program
        queryFn: () => getProgramsData(program?.prerequisites),
        refetchOnMount: false,
        enabled: !!program.prerequisites
    })

    const { data: teacherData } = useQuery({
        queryKey: ['teacherData', program.id],
        queryFn: () => getTeacherDataFromProgram(program),
        refetchOnMount: false,
    })

    const { data: studentCount } = useQuery({
        queryKey: ['studentCount', program?.id ?? ''],
        queryFn: () => getStudentCount(program?.id),
        refetchOnMount: true,

    })

    const { data: courses } = useQuery({
        queryKey: ['courses', program?.id ?? ''],
        queryFn: () => getCoursesData(program),
        refetchOnMount: true,
        enabled: !!program.id
    })

    const { data: assessments } = useQuery({
        queryKey: ['assessments', program?.id ?? ''],
        queryFn: () => getAssessmentsData(courses),
        enabled: !!courses,
        refetchOnMount: true
    })

    const { data: lessons } = useQuery({
        queryKey: ['lessons', program?.id ?? ''],
        queryFn: () => getLessonsData(courses._id, courses.programId),
        enabled: !!courses,
        refetchOnMount: true
    })

    const { data: quizzes } = useQuery({
        queryKey: ['quizzes', program?.id ?? ''],
        queryFn: () => getQuizzesData(courses),
        enabled: !!courses,
        refetchOnMount: true
    })

    const { data: studentProgram } = useQuery({
        queryKey: ['studentProgram', program?.id ?? '', userData.id],
        queryFn: async () => {
            const studentProgramCollection = collection(db, 'studentProgram')
            const queryStudentProgram = query(studentProgramCollection, and(where('studentId', '==', userData.id), where('programId', '==', program.id)))
            const studentProgramDocs = await getDocs(queryStudentProgram)
            if (studentProgramDocs.docs.length > 0) return { ...studentProgramDocs.docs[0].data(), id: studentProgramDocs.docs[0].id }
            else return null
        },
        enabled: !!program.id
    })

    // const { data: studentRequest } = useQuery({
    //     queryKey: ['studentRequest', program?.id ?? ''],
    //     queryFn: () => getStudentRequest(userData?.id, program.id),
    //     enabled: !!program.id
    // })

    const materialCount = (courses?.length ?? [].length) + (assessments?.length ?? [].length) + (lessons?.length ?? [].length) + (quizzes?.length ?? [].length)

    const { mutate } = useMutation({
        onMutate: () => {
            const previousData = queryClient.getQueryData(['currentPrograms', userData?.id])

            queryClient.setQueryData(['currentPrograms', userData?.id], (oldData: unknown) => {
                //@ts-expect-error oldData
                const filteredData = oldData ? oldData.slice().filter(programData => programData.id !== program.id) : []
                return filteredData ? [...filteredData, { ...program, expired: false }] : [{ ...program, expired: false }]
            })

            return () => queryClient.setQueryData(['currentPrograms', userData?.id], previousData)
        },
        mutationFn: () => handleStudentRequestProgram()
    })

    const handleStudentRequestProgram = async () => {
        setLoading(true)
        await setStudentRepurchaseProgram(userData?.id, program)
        await handlePayment()
        queryClient.invalidateQueries({
            queryKey: ['studentRequest', program?.id]
        })
        queryClient.invalidateQueries({
            queryKey: ['currentPrograms', userData?.id],
        })
        queryClient.invalidateQueries({
            queryKey: ['explorePrograms', userData?.id],
        })
    }

    const handlePayment = async () => {
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

        const headers = {
            "Content-Type": "application/json"
        }

        const postProgram = { ...program, image: '' }

        const body = {
            program: postProgram,
            studentId: userData.id
        }

        const response = await axios.post('https://engmestripeapi.vercel.app/create-checkout-session', body, {
            headers
        })
        // const response = await axios.post('http://localhost:3001/create-checkout-session', body, {
        //     headers
        // })

        const session = response.data

        const result = await stripe?.redirectToCheckout({
            sessionId: session.id
        })

        if (result?.error) {
            console.error(result.error)
        }
    }

    //@ts-expect-error prereq
    const displayedPrereqs = prereqsData?.map(preqreq => <Typography sx={{ textDecoration: 'underline', cursor: 'pointer' }} fontSize={18} fontFamily='Inter' fontWeight={400}>{preqreq.name}</Typography>)
    return (
        <Box
            display='flex'
            flexDirection='column'
            borderRadius='20px'
            height='auto'
            overflow='hidden'
        >
            <Dialog open={loading} PaperProps={{ style: { background: 'transparent', backgroundColor: 'transparent', overflow: 'hidden', boxShadow: 'none' } }}>
                <CircularProgress size='46px' sx={{ color: '#FF7E00' }} />
            </Dialog>
            <Box
                p={3}
                display='flex'
                flexDirection='row'
                justifyContent='space-between'
                alignItems='center'
                bgcolor='#F8F8F8'
                // mx={14}
                flex={1}
            // width='100%'
            >
                <Stack
                    width={{ xs: '40%', sm: '40%', lg: '35%' }}
                    direction='row'
                >
                    <Stack
                        direction='column'
                        gap={2}
                        bgcolor='#F8F8F8'
                        flex={1}
                    >
                        <Stack
                            alignItems='center'
                            justifyContent='space-between'
                            direction='row'
                        >

                            <Typography
                                fontSize={26}
                                fontWeight={900}
                                fontFamily='Inter'
                            >
                                {program?.name}
                            </Typography>

                            <SvgIcon sx={{ fontSize: 24 }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path d="M6.14963 19.1713C4.44636 20.0668 2.90407 18.9476 3.22957 17.0498L3.99423 12.5915L0.755079 9.43408C-0.622893 8.09089 -0.0350361 6.27823 1.87044 6.00135L6.34684 5.35089L8.34874 1.2946C9.20037 -0.431002 11.106 -0.432061 11.9581 1.2946L13.96 5.35089L18.4364 6.00135C20.3407 6.27806 20.9306 8.09007 19.5518 9.43408L16.3126 12.5915L17.0773 17.0498C17.4026 18.9464 15.8616 20.0673 14.1572 19.1713L10.1534 17.0664L6.14963 19.1713ZM9.22844 15.0107C9.77849 14.7215 10.5263 14.7204 11.0784 15.0107L14.7783 16.9559L14.0717 12.836C13.9667 12.2235 14.1967 11.5119 14.6434 11.0765L17.6367 8.15877L13.5001 7.55768C12.8851 7.46832 12.2795 7.02965 12.0034 6.47029L10.1534 2.72187L8.30348 6.47029C8.02846 7.02755 7.4241 7.46799 6.80681 7.55768L2.67018 8.15877L5.66347 11.0765C6.10847 11.5103 6.3406 12.2211 6.23515 12.836L5.52853 16.9559L9.22844 15.0107Z" fill="#FF7E00" />
                                </svg>
                            </SvgIcon>
                        </Stack>
                        <Stack
                            direction='row'
                            justifyContent='space-between'
                            alignItems='center'
                        >
                            <Typography fontSize={16} fontWeight={400} fontFamily='Inter'>Nanodegree Program</Typography>
                            <Stack
                                direction='row'
                                gap={1}
                                alignItems='center'
                                justifyContent='center'
                            >
                                <SvgIcon sx={{ fontSize: 20 }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                                        <path d="M7.72751 0.779696C7.89978 0.258006 8.63774 0.258004 8.81001 0.779694L10.2205 5.05112C10.2976 5.28465 10.5158 5.44239 10.7618 5.44239H15.3064C15.8608 5.44239 16.0889 6.15367 15.6379 6.47609L11.9772 9.09309C11.7741 9.23822 11.6891 9.49854 11.7674 9.73552L13.1694 13.9812C13.3423 14.5047 12.7452 14.9443 12.2967 14.6236L8.60025 11.9811C8.40198 11.8394 8.13554 11.8394 7.93727 11.9811L4.24085 14.6236C3.79234 14.9443 3.19523 14.5047 3.36811 13.9812L4.77012 9.73552C4.84837 9.49854 4.76337 9.23822 4.56036 9.09309L0.899615 6.47609C0.448606 6.15367 0.676701 5.44239 1.2311 5.44239H5.77575C6.02168 5.44239 6.23988 5.28465 6.317 5.05112L7.72751 0.779696Z" fill="#FF9F06" />
                                    </svg>
                                </SvgIcon>
                                <Typography
                                    fontSize={16}
                                    fontFamily='Poppins'
                                    fontWeight={700}
                                    sx={{ color: '#004643' }}
                                >
                                    {program.averageRating}
                                </Typography>
                                <Typography
                                    fontFamily='Inter'
                                    fontSize={16}
                                    fontWeight={400}
                                // ml={0.5}
                                >
                                    ({program.totalFeedbacks})
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack
                    width={{ xs: '40%', sm: '40%', lg: '30%' }}
                >
                    <Typography
                        fontSize={18}
                        fontWeight={400}
                        fontFamily='Inter'
                    >
                        {program.description}
                    </Typography>
                </Stack>
            </Box>
            <Box
            >
                <Stack
                    flexWrap='wrap'
                    gap={{ xs: 2, sm: 2, lg: 6 }}
                    direction='row'
                    pl={9}
                    pb={2}
                    pt={4}
                    bgcolor='#F8F8F8'
                >
                    <Typography fontSize={18} fontFamily='Inter' fontWeight={600}>Prerequisites:</Typography>
                    {displayedPrereqs}
                </Stack>
                <Box
                    px={6}
                    pl={10}
                    bgcolor='#E8E8E8'
                    py={4}
                // width='100%'
                >
                    <Typography fontSize={18} fontFamily='Inter' fontWeight={600}>Taught By:</Typography>

                    <Stack
                        ml={2}
                        direction='row'
                        justifyContent='space-between'
                    >
                        <Stack
                            direction='row'
                            gap={2}
                            mt={4}
                            alignItems='center'
                        // mr={7}
                        >
                            {/*//@ts-expect-error error*/}
                            <Avatar onClick={() => navigate(`/teacherprofile/${teacherData?.id}`)} src={teacherData?.image} sx={{ width: '70px', height: '70px', cursor: 'pointer' }} />
                            <Stack
                                direction='column'
                                justifyContent='center'
                                gap={0.5}
                            >
                                {/*//@ts-expect-error error*/}
                                <Typography onClick={() => navigate(`/teacherprofile/${teacherData?.id}`)} sx={{ color: '#000', cursor: 'pointer' }} fontFamily='Inter' fontSize={12} fontWeight={600}>{teacherData?.name} | {teacherData?.title}</Typography>
                                <Stack
                                    direction='row'
                                    justifyContent='space-between'
                                    gap={1}
                                >
                                    {/*//@ts-expect-error error*/}
                                    <Typography fontFamily='Inter' fontSize={12} fontWeight={500}>{teacherData?.university}</Typography>
                                    <Stack
                                        direction='row'
                                        alignItems='center'
                                        gap={0.5}
                                    >
                                        {/* <SvgIcon sx={{ fontSize: 12 }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                                                <path d="M5.98199 1.22337C6.11981 0.806014 6.71018 0.806015 6.84799 1.22337L7.9764 4.64051C8.03809 4.82733 8.21265 4.95352 8.4094 4.95352H12.0451C12.4886 4.95352 12.6711 5.52254 12.3103 5.78048L9.38171 7.87408C9.2193 7.99018 9.1513 8.19844 9.2139 8.38802L10.3355 11.7846C10.4738 12.2034 9.99612 12.555 9.63731 12.2985L6.68018 10.1845C6.52157 10.0711 6.30841 10.0711 6.1498 10.1845L3.19268 12.2985C2.83387 12.555 2.35618 12.2034 2.49448 11.7846L3.61609 8.38802C3.67869 8.19844 3.61069 7.99018 3.44828 7.87408L0.519688 5.78048C0.158882 5.52254 0.341356 4.95352 0.784878 4.95352H4.42058C4.61733 4.95352 4.79189 4.82733 4.85359 4.64051L5.98199 1.22337Z" fill="#FF9F06"/>
                                            </svg>
                                        </SvgIcon> */}
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack
                            direction='column'
                            mr={12}
                        >
                            <Stack
                                direction='row'
                                gap={6}
                            >
                                <Box display='flex' flexDirection='column' bgcolor='#D0EBFC' alignItems='center' justifyContent='center' textAlign='center' width='68px' border='1px solid #226E9F' borderRadius='10px' height='60px'>
                                    <Typography fontWeight={600} fontFamily='Inter' fontSize={20}>{Object.keys(program?.finalExams ?? []).length}</Typography>
                                    <Typography fontSize={9} fontWeight={500} fontFamily='Inter'>Model Exam(s)</Typography>
                                </Box>
                                <Box display='flex' flexDirection='column' bgcolor='#D0EBFC' alignItems='center' justifyContent='center' textAlign='center' width='68px' border='1px solid #226E9F' borderRadius='10px' height='60px'>
                                    <Typography fontWeight={600} fontFamily='Inter' fontSize={20}>{studentCount}</Typography>
                                    <Typography fontSize={9} fontWeight={500} fontFamily='Inter'>Student(s)</Typography>
                                </Box>
                                <Box display='flex' flexDirection='column' bgcolor='#D0EBFC' alignItems='center' justifyContent='center' textAlign='center' width='68px' border='1px solid #226E9F' borderRadius='10px' height='60px'>
                                    <Typography fontWeight={600} fontFamily='Inter' fontSize={20}>{materialCount > 1 ? `${materialCount - 1}+` : materialCount}</Typography>
                                    <Typography fontSize={9} fontWeight={500} fontFamily='Inter'>Material(s)</Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Stack>

                    <Stack
                        mt={7}
                        ml={-6}
                        justifyContent='space-between'
                        direction='row'
                    >
                        <Stack
                            direction='row'
                            gap={1}
                            flexWrap='wrap'
                            height='fit-content'
                        >
                            <Box
                                bgcolor='#D0EBFC'
                                sx={{
                                    border: '1.5px solid',
                                    borderRadius: '20px',
                                    borderColor: '#6A9DBC'
                                }}
                                px={1.5}
                                py={0.5}
                            >
                                <Typography fontSize={12} fontWeight={400} fontFamily='Inter'>{program?.duration}</Typography>
                            </Box>
                            <Box
                                bgcolor='#D0EBFC'
                                sx={{
                                    border: '1.5px solid',
                                    borderRadius: '20px',
                                    borderColor: '#6A9DBC'
                                }}
                                px={1.5}
                                py={0.5}
                            >
                                <Typography fontSize={12} fontWeight={400} fontFamily='Inter'>Completion Certificate</Typography>
                            </Box>
                            <Box
                                bgcolor='#D0EBFC'
                                sx={{
                                    border: '1.5px solid',
                                    borderRadius: '20px',
                                    borderColor: '#6A9DBC'
                                }}
                                px={1.5}
                                py={0.5}
                            >
                                <Typography fontSize={12} fontWeight={400} fontFamily='Inter'>{program?.level}</Typography>
                            </Box>
                            <Box
                                bgcolor='#D0EBFC'
                                sx={{
                                    border: '1.5px solid',
                                    borderRadius: '20px',
                                    borderColor: '#6A9DBC'
                                }}
                                px={1.5}
                                py={0.5}
                            >
                                <Typography fontSize={12} fontWeight={400} fontFamily='Inter'>{program?.expiry}</Typography>
                            </Box>
                        </Stack>
                        {
                            //@ts-expect-error extended
                            studentProgram?.extended ? (
                                <Button
                                    sx={{
                                        marginLeft: 'auto',
                                        marginRight: 11,
                                        marginTop: -4,
                                        width: '320px',
                                        height: '50px',
                                        background: '#fff',
                                        color: '#226E9F',
                                        fontFamily: 'Inter',
                                        fontSize: 14,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        border: '1px solid #226E9F',
                                        borderRadius: '15px',
                                        '&:hover': {
                                            background: '#fff',
                                            opacity: 1
                                        },
                                        paddingX: 6
                                    }}
                                    onClick={() => mutate()}
                                >
                                    This program expired.
                                    Repurchase to complete
                                </Button>
                            ) : (
                                <Button
                                    sx={{
                                        marginLeft: 'auto',
                                        marginRight: 11,
                                        marginTop: -4,
                                        width: '320px',
                                        height: '50px',
                                        background: '#fff',
                                        color: '#226E9F',
                                        fontFamily: 'Inter',
                                        fontSize: 14,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        border: '1px solid #226E9F',
                                        borderRadius: '15px',
                                        '&:hover': {
                                            background: '#fff',
                                            opacity: 1
                                        },
                                        paddingX: 6
                                    }}
                                    onClick={async () => {
                                        if (studentProgram?.id !== null && typeof studentProgram?.id === 'string') {
                                            setLoading(true)
                                            const studentProgramDoc = doc(db, 'studentProgram', studentProgram?.id)
                                            //@ts-expect-error endDate
                                            const newDate = studentProgram.endDate.toDate()
                                            newDate.setDate(newDate.getDate() + 90)
                                            await updateDoc(studentProgramDoc, { extended: true, endDate: newDate })
                                            window.location.reload()
                                            navigate(`/programs/current/${program.id}`)
                                            setLoading(false)
                                        }
                                    }}
                                >
                                    Extend 90 Days For Free!
                                </Button>
                            )
                        }
                    </Stack>

                </Box>
            </Box>
        </Box>
    )
}
