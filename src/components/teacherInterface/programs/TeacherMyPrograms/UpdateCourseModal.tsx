import { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import CourseProps from "../../../../interfaces/CourseProps";

const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;

async function updateCourse(courseId: string, courseName: string) {
    try {
        const token = sessionStorage.getItem("token"); // Adjust if using another auth method
        const role = sessionStorage.getItem("role"); 
        const response = await axios.patch(
            `${BASE_URL}/${role}/course/${courseId}`,
            { courseName: courseName }, // ✅ Send updated course name
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating course:", error);
        throw new Error("Failed to update course.");
    }
}

interface EditCourseModalProps {
    course:CourseProps; // Course object
    open: boolean;
    handleClose: () => void;
    
}

export default function UpdateCourseModal({ course, open, handleClose }: EditCourseModalProps) {
    const queryClient = useQueryClient();
    const [courseName, setCourseName] = useState(course.courseName);

    useEffect(() => {
        if (course) {
            setCourseName(course.courseName);
        }
    }, [course]);

    // const { mutateAsync, isPending } = useMutation({

    //     mutationFn: () => updateCourse(course._id, courseName),
    //     onSuccess: (updatedCourse) => {
    //         queryClient.setQueryData(["courses"], updatedCourse);
    //         handleClose(); // ✅ Close modal after updating
    //     },
    // });
    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => updateCourse(course._id, courseName),
        onSuccess: () => {
            // ✅ Correct way to invalidate queries in TypeScript
            queryClient.invalidateQueries({ queryKey: ["courses"] }); 
            handleClose(); // ✅ Close modal after updating
        },
    });
    
    

    const handleSubmit = async () => {
        if (!courseName.trim()) return;
        await mutateAsync();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "white",
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 24,
                }}
            >
                <Typography variant="h6">Edit Course</Typography>
                <TextField
                    fullWidth
                    label="Course Name"
                    variant="outlined"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    sx={{ mt: 2 }}
                />
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button onClick={handleClose} sx={{ mr: 2 }} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending}
                        variant="contained"
                    >
                        {isPending ? "Updating..." : "Update Course"}
                    </Button>

                </Box>
            </Box>
        </Modal>
    );
}
