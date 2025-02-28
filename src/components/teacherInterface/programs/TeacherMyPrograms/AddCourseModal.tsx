import { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Alert } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
// import CourseProps from "../../../../interfaces/CourseProps";
import ProgramProps from "../../../../interfaces/ProgramProps";

const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;

interface CourseAddModalProps {
    program: ProgramProps;
    open: boolean;
    handleClose: () => void;
}

export default function AddCourseModal({ program, open, handleClose }: CourseAddModalProps) {
    const queryClient = useQueryClient();
    const [courseName, setCourseName] = useState("");
    const [error,setError]=useState("");
    const [reset,setReset]=useState("");

    async function addCourse(course: { programId: string; courseName: string }) {

    
        try {
            const token = sessionStorage.getItem("token");
            const role = sessionStorage.getItem("role");
            const response = await axios.post(
                `${BASE_URL}/${role}/course/add`,
                { programId: course.programId, courseName: course.courseName }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if(response?.status===200 && response?.data?.success){
                setError("")
                setReset(response?.data?.message)
                setTimeout(() => {
                    setReset("");
                }, 2000);
            }
            else{
                setReset("")
                setError(response?.data?.message);
                setTimeout(() => {
                    setError("");
                }, 2000);
            }
            return response.data;
        } catch (error) {
            console.error("Error adding course:", error);
            throw new Error("Failed to add course.");
        }
    }
    
   
    const { mutateAsync, isPending } = useMutation({
        mutationFn: addCourse, 
        onSuccess: () => {
            // ✅ Invalidate queries to refetch course list
            queryClient.invalidateQueries({ queryKey: ["courses", program._id] });
            handleClose();
        },
    });
    
    const handleSubmit = async () => {
        if (!courseName.trim()) return;
        await mutateAsync({ programId: String(program._id), courseName }); // Convert `_id` to string
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
                <Typography variant="h6">Add a New Course</Typography>
                <TextField
                    fullWidth
                    label="Course Name"
                    variant="outlined"
                    // value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    sx={{ mt: 2 }}
                />
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button onClick={handleClose} sx={{ mr: 2 }} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit} // ✅ Now correctly defined
                        disabled={isPending}
                        variant="contained"
                    >
                        {isPending ? "Adding..." : "Add Course"}
                    </Button>

                    {error && !reset && <Alert severity="error">{error}</Alert>}
                    {reset && !error && <Alert severity="success">{reset}</Alert>}
                </Box>
            </Box>
        </Modal>
    );
}
