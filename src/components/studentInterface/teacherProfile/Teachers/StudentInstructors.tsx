import { Avatar, Box, Stack, Typography } from "@mui/material";
import { getTeachers } from "../../../helpers/getTeachers";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";


interface TeacherPrompts{
    name:string
    title:string
    _id:string
}

export default function StudentInstructors({ disabled }: { disabled?: boolean }) 
{
    const navigate = useNavigate()

    const { data: teachers } = useQuery({
        queryKey: ['teachers'],
        queryFn: () => getTeachers()
    })

    return (
        <Box
            mx={14}
            borderRadius='20px'
            overflow='hidden'
            height='auto'
            boxShadow='0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
            my={8}
        >
            <Box
                p={2}
                px={4}
                bgcolor='#D0EBFC'
            >
                <Typography
                    fontWeight={900}
                    fontFamily='Inter'
                    fontSize={24}
                >
                    Available Instructors
                </Typography>
            </Box>
            <Stack
                flex={1}
                direction='row'
                justifyContent='flex-start'
                alignItems='center'
                overflow='auto'
                px={4}
                py={2}
                gap={{xs: 4, sm: 6, lg: 12}}
            >
                {teachers?.map((teacher :TeacherPrompts) => (
                    <Stack
                        key={teacher._id}
                        direction='column'
                        gap={1}
                        alignItems='center'
                        justifyContent='center'
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#fcfcfc',
                            }
                        }}
                        onClick={() => !disabled && navigate(`/teacherprofile/${teacher._id}`)}
                    >
                        {/*//@ts-expect-error image */}
                        <Avatar src={teacher?.image} sx={{ width: {xs: 50, sm: 65, lg: 81}, height: {xs: 50, sm: 65, lg: 81} }} />
                        <Typography
                            fontWeight={700}
                            fontFamily='Inter'
                            fontSize={18}
                            textAlign='center'
                        >
                            {teacher?.name}
                        </Typography>
                        <Typography
                            fontWeight={500}
                            fontFamily='Inter'
                            fontSize={14}
                            textAlign='center'
                        >
                            {teacher?.title}
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        </Box>
    )
}
