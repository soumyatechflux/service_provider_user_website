import { useState } from "react";
import { Typography, Modal, Box, TextField, Button, Alert } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ProgramProps from "../../../../interfaces/ProgramProps";

const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;

interface AddFinalExamModalProps {
    program: ProgramProps;
    open: boolean;
    handleClose: () => void;
}

export default function AddFinalExamModal({ program, open, handleClose }: AddFinalExamModalProps) {
    const queryClient = useQueryClient();
    const [examName, setExamName] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    // const [loading,setLoading]=useState(false);

    async function addExam(exam: { programId: string; examName: string }) {
        try {
            const token = sessionStorage.getItem("token");
            const role = sessionStorage.getItem("role");
            const response = await axios.post(
                `${BASE_URL}/${role}/exams/add`,
                { programId: exam.programId, examName: exam.examName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response?.status === 200 && response?.data?.success) {
                setError("");
                setSuccess(response?.data?.message);
                setTimeout(() => {
                    setSuccess("");
                    handleClose(); // Close modal after success
                }, 2000);
            } else {
                setSuccess("");
                setError(response?.data?.message);
                setTimeout(() => {
                    setError("");
                }, 2000);
            }

            return response.data;
        } catch (error) {
            console.error("Error adding exam:", error);
            throw new Error("Failed to add exam.");
        }
    }
    

    const { mutateAsync, isPending } = useMutation({
        mutationFn: addExam,
        onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["finalExams", program._id] }); // ✅ This refetches the exams list
        },
    });


    const handleSubmit = async () => {
        if (!examName.trim()) return;
        await mutateAsync({ programId: String(program._id), examName });
    };

    return (
        <>
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
                <Typography variant="h6">Add a New Exam</Typography>
                <TextField
                    fullWidth
                    label="Exam Name"
                    variant="outlined"
                    onChange={(e) => setExamName(e.target.value)}
                    sx={{ mt: 2 }}
                />
                <Box my={2} display="flex" justifyContent="flex-end">
                    <Button onClick={handleClose} sx={{ mr: 2 }} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isPending} variant="contained">
                        {isPending ? "Adding..." : "Add Exam"}
                    </Button>
                </Box>

                {error && !success && <Alert severity="error">{error}</Alert>}
                {success && !error && <Alert severity="success">{success}</Alert>}
            </Box>
        </Modal>

        {/* <Dialog open={loading} PaperProps={{ style: { background: 'transparent', backgroundColor: 'transparent', overflow: 'hidden', boxShadow: 'none' } }}>
                <CircularProgress size='46px' sx={{ color: '#FF7E00' }} />
            </Dialog> */}
        </>
        
    );
}
