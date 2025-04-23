import { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FinalExamProps } from "../../../../interfaces/FinalExamProps";

const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;

// ✅ API Call to Update Exam
async function updateExam(examId: string, examName: string) {
    try {
        const token = sessionStorage.getItem("token");
        const role = sessionStorage.getItem("role"); 
        const response = await axios.patch(
            `${BASE_URL}/${role}/exams/${examId}`, // ✅ Updated API Endpoint for Exams
            { examName: examName }, // ✅ Send updated exam name
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating exam:", error);
        throw new Error("Failed to update exam.");
    }
}

// ✅ Props Interface for the Modal
interface EditExamModalProps {
    exam: FinalExamProps; // ✅ Exam object
    open: boolean;
    handleClose: () => void;
}

export default function UpdateExamModal({ exam, open, handleClose }: EditExamModalProps) {
    const queryClient = useQueryClient();
    const [examName, setExamName] = useState(exam.examName);

    useEffect(() => {
        if (exam) {
            setExamName(exam.examName);
        }
    }, [exam]);

    // ✅ Use Mutation for Updating Exam
    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => updateExam(exam._id, examName),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["finalExams"] }); // ✅ Ensure it matches `useQuery`
            handleClose(); // ✅ Close modal after updating
        },
    });

    const handleSubmit = async () => {
        if (!examName.trim()) return;
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
                <Typography variant="h6">Edit Exam</Typography>
                <TextField
                    fullWidth
                    label="Exam Name"
                    variant="outlined"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
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
                        {isPending ? "Updating..." : "Update Exam"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
