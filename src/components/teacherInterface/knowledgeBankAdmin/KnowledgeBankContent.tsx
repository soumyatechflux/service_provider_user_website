import { useMutation, useQuery } from "@tanstack/react-query"
import { getKnowledgeBankContent } from "../../helpers/getKnowledgeBankContent"
import { Box, Button, CircularProgress, Dialog, Grid, IconButton, Input, InputLabel, Stack, SvgIcon, Typography } from "@mui/material"
import { useState } from "react"
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import axios, { AxiosError } from "axios"
interface KnowledgeBankContent {
    id: string,
    _id: string,
    major: string,
    content: string[]
}

export default function KnowledgeBankContent({ _id }: KnowledgeBankContent) {
    const [add, setAdd] = useState(false);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState(null)
    const [loading, setLoading] = useState(false)
    const[isUpload,setIsUpload]=useState(false);
    const [fileUploads, setFileUploads] = useState<{ [key: string]: File[] }>({});
    const token = sessionStorage.getItem("token") || ""; 
    const role = sessionStorage.getItem('role');

    const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;

    const { data: knowledgeBankContent, refetch } = useQuery({
        queryKey: ['knowledgeBankContent', _id],
        queryFn: () => getKnowledgeBankContent(_id, token)
    })

    console.log("IDDDD:", _id)

    console.log("KnowledgebankContentFile", knowledgeBankContent?.[0])


    // Handle file upload
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setIsUpload(true);
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);

            setFileUploads((prev) => ({
                ...prev,
                [id]: [...(prev[id] || []), ...selectedFiles],
            }));
        }
    };

    const handleUploadFiles = async (id: string) => {
        if (!fileUploads[id]?.length) return alert("No files to upload!");

        const formData = new FormData();
        formData.append("knowledge_bank_file_title_id", id);

        // Append each selected file
        fileUploads[id].forEach((file) => {
            formData.append("file", file);
        });

        try {
            setLoading(true)
            const response = await axios.post(`${BASE_URL}/${role}/knowledge_bank/filetitle/add`, formData, {
                headers: { "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}` // Include token
                 },

            });

            console.log("Upload Success:", response.data);
            alert("Files uploaded successfully!");
            setIsUpload(false);
            setFileUploads((prev) => ({ ...prev, [id]: [] })); // Clear uploaded files
            refetch();
            
        } catch (error) {
            setLoading(false)
            console.error("Upload Error:", error);
            alert("File upload failed!");
        }
        finally{
            setLoading(false)
        }
    };
     const handleRemoveFile = async (id: string,index: number) => {

        console.log("DELETE FILE ID",id)
        console.log(index)
        try {
            setLoading(true)
            const response = await axios.delete(`${BASE_URL}/${role}/knowledge_bank/files/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("File Deleted:", response.data);
            alert("File deleted successfully!");
            refetch()
        } catch (error) {
            setLoading(false);
            console.error("Delete Error:", error);
            alert("Failed to delete file!");
        }
        finally{
            setLoading(false);
        }
    };

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const uploadedFile = event.target.files[0];

            if (uploadedFile) {
                // Define allowed file MIME types
                const allowedTypes = [
                    "application/pdf",
                    "application/msword", // .doc
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
                    "application/vnd.ms-excel", // .xls
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
                    "text/csv", // .csv
                    "text/plain", // .txt
                    "application/vnd.ms-powerpoint", // .ppt
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
                    "video/mp4", // .mp4
                    "video/quicktime", // .mov
                    "video/x-msvideo", // .avi
                    "video/x-ms-wmv", // .wmv
                    "video/x-matroska" // .mkv
                ];

                if (allowedTypes.includes(uploadedFile.type)) {
                    //@ts-expect-error file
                    setFile(uploadedFile);
                    //@ts-expect-error file
                    setFileType(uploadedFile.type);
                } else {
                    alert("Invalid file type. Please upload a valid file.");
                }
            }
        }
    };
    const { mutate: mutateAdd } = useMutation({
        mutationFn: async () => {
            if (!file) {
                throw new Error("File is missing");
            }
            try {
                const formData = new FormData();
                formData.append("knowledge_bank_id", _id);
                formData.append("title", title);
                formData.append("file", file);

                const response = await axios.post(
                    `${BASE_URL}/${role}/knowledge_bank/files/add`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "Authorization": `Bearer ${token}` // Include token
                        }
                    }
                );
                
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<{ message: string }>;
                throw new Error(axiosError.response?.data?.message || "Failed to upload file");
            }

        },

        onMutate: () => {
            setLoading(true);
        },

        onSettled: async () => {
            setTitle('');
            await refetch(); // Refresh UI after upload
            setLoading(false);
        },
    });


    const { mutate: mutateDelete } = useMutation({
        mutationFn: async (kbContentId: string) => {
            if (!kbContentId) return Promise.reject("kbContentId is required");

            try {
                const response = await fetch(`${BASE_URL}/${role}/knowledge_bank/filetitle/${kbContentId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Use your token here
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to delete file");
                }

                return response.json();
            } catch (error) {
                return Promise.reject(error);
            }
        },

        onMutate: () => {
            setLoading(true);
        },
        onSuccess: async () => {
            await refetch(); // Refresh UI after deletion
        },
        onSettled: () => {
            setLoading(false);
        },
    });
    //@ts-expect-error file
    const displayedContent = knowledgeBankContent?.map(kbContent => {
        console.log("KB ID:", kbContent?.knowledge_bank_id)
        console.log("KB Folder ID:", kbContent?.knowledge_bank_file_title_id)
        console.log("whole Info:", kbContent)

        return (
            <Grid item xs={12} key={kbContent.id}>
                <Stack
                    // direction='column'
                    // position='relative'
                    width='100%'
                    px={1}
                    py={2}
                    bgcolor='#FEF4EB'
                    borderRadius='15px'
                    alignItems='center'
                    justifyContent='center'
                    gap={1}
                    pb={2}
                    height='auto'
                    key={kbContent.id}
                    mx='20%'
                >

                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                        >
                            <SvgIcon sx={{ fontSize: 56 }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="49" height="48" viewBox="0 0 49 48" fill="none">
                                    <path d="M47.2568 13.7539L45.9999 12.497C44.9577 11.457 43.2704 11.457 42.2282 12.497L39.7143 15.0109L35.5858 19.1393V0.888889C35.586 0.398097 35.1882 0.000127556 34.6974 0C34.6973 0 34.6976 0 34.6974 0H10.6969C10.6754 0.00171156 10.654 0.00543424 10.6331 0.0111198C10.4209 0.0228907 10.2202 0.111516 10.0685 0.260445L0.290717 10.0382C0.136032 10.1965 0.0467072 10.4073 0.040557 10.6286C0.0388955 10.6419 0.0302735 10.6527 0.0302735 10.6667V47.1111C0.0301459 47.6019 0.427908 47.9999 0.9187 48C0.918546 48 0.918854 48 0.9187 48H34.6969C35.1876 48.0003 35.5855 47.6028 35.5858 47.1121C35.5858 47.1118 35.5858 47.1115 35.5858 47.1111V29.3333C35.5808 29.2948 35.5731 29.2566 35.5628 29.2192L44.743 20.0391L47.2568 17.5252C48.3049 16.4884 48.3259 14.8104 47.2891 13.7623C47.2824 13.7554 47.2756 13.7486 47.2568 13.7539ZM42.2993 19.9688L39.7846 17.4544L40.3428 16.8963L42.8575 19.4106L42.2993 19.9688ZM22.7438 39.5243L22.1152 38.8956L40.4137 20.5971L41.0424 21.2257L22.7438 39.5243ZM19.361 38.6551L21.0986 40.3928L18.4921 41.2613L19.361 38.6551ZM20.2294 37.0095L38.5277 18.7113L39.1566 19.3402L20.8583 37.6385L20.2294 37.0095ZM9.80805 3.03472V9.77778H3.06499L9.80805 3.03472ZM33.8081 46.2222H1.80805V11.5556H10.6969C11.1879 11.5556 11.5858 11.1576 11.5858 10.6667V1.77778H33.8081V20.9171L18.3441 36.3811C18.2531 36.4742 18.1841 36.5864 18.1421 36.7095C18.1388 36.7172 18.132 36.72 18.1292 36.7283L16.446 41.7778H5.36361C4.87269 41.7778 4.47472 42.1757 4.47472 42.6667C4.47472 43.1576 4.87269 43.5556 5.36361 43.5556H16.9192C16.9569 43.5506 16.9943 43.5431 17.031 43.533C17.0471 43.5456 17.0664 43.5534 17.0867 43.5556C17.1823 43.5557 17.2773 43.5401 17.3679 43.5095L23.0251 41.6241C23.034 41.6212 23.0367 41.6137 23.0449 41.6102C23.1675 41.5683 23.2793 41.4998 23.3723 41.4097L33.8081 30.974V46.2222ZM45.9999 16.2682L44.1144 18.1537L41.5998 15.6393L43.4851 13.7539C43.8328 13.4076 44.3951 13.4076 44.7429 13.7539L45.9998 15.0109C46.3462 15.3584 46.3462 15.9206 45.9999 16.2682ZM20.4747 16.8889H31.1414C31.6322 16.889 32.0301 16.4913 32.0303 16.0005C32.0303 16.0003 32.0303 16.0006 32.0303 16.0005V3.55556C32.0304 3.06476 31.6326 2.66679 31.1418 2.66667C31.1417 2.66667 31.142 2.66667 31.1418 2.66667H20.4747C19.9838 2.66667 19.5858 3.06464 19.5858 3.55556V16C19.5858 16.4909 19.9838 16.8889 20.4747 16.8889ZM21.3636 4.44444H30.2525V15.1111H21.3636V4.44444ZM5.36361 20.4444H21.3636C21.8545 20.4444 22.2525 20.8424 22.2525 21.3333C22.2525 21.8243 21.8545 22.2222 21.3636 22.2222H5.36361C4.87269 22.2222 4.47472 21.8243 4.47472 21.3333C4.47472 20.8424 4.87269 20.4444 5.36361 20.4444ZM22.2525 26.6667C22.2526 27.1575 21.8549 27.5554 21.3641 27.5556C21.3639 27.5556 21.3642 27.5556 21.3641 27.5556H5.36361C4.87269 27.5556 4.47472 27.1576 4.47472 26.6667C4.47472 26.1757 4.87269 25.7778 5.36361 25.7778H21.3636C21.8544 25.7776 22.2524 26.1759 22.2525 26.6667C22.2525 26.6668 22.2525 26.6665 22.2525 26.6667ZM19.5858 32C19.586 32.4908 19.1882 32.8888 18.6974 32.8889C18.6972 32.8889 18.6976 32.8889 18.6974 32.8889H5.36361C4.87269 32.8889 4.47472 32.4909 4.47472 32C4.47472 31.5091 4.87269 31.1111 5.36361 31.1111H18.6969C19.1877 31.111 19.5857 31.5092 19.5858 32C19.5858 32.0002 19.5858 31.9998 19.5858 32ZM16.0303 37.3333C16.0304 37.8241 15.6326 38.2221 15.1418 38.2222C15.1417 38.2222 15.142 38.2222 15.1418 38.2222H5.36361C4.87269 38.2222 4.47472 37.8243 4.47472 37.3333C4.47472 36.8424 4.87269 36.4444 5.36361 36.4444H15.1414C15.6322 36.4443 16.0301 36.8425 16.0303 37.3333C16.0303 37.3335 16.0303 37.3332 16.0303 37.3333ZM30.7855 17.9557C31.1781 18.2494 31.2584 18.8058 30.9647 19.1984C30.9643 19.199 30.9639 19.1995 30.9634 19.2001L28.2968 22.7556C28.1424 22.9618 27.9061 23.0907 27.6492 23.1089C27.6275 23.1102 27.6067 23.1111 27.5858 23.1111C27.3501 23.1112 27.124 23.0175 26.9574 22.8507L25.1796 21.0729C24.8356 20.7227 24.8407 20.16 25.1909 19.816C25.5366 19.4764 26.0907 19.4764 26.4365 19.816L27.4894 20.869L29.5415 18.1333C29.836 17.7407 30.3929 17.6613 30.7855 17.9557ZM25.1796 42.4062C24.8356 42.056 24.8407 41.4933 25.1909 41.1493C25.5366 40.8097 26.0907 40.8097 26.4365 41.1493L27.4894 42.2023L29.5415 39.467C29.8348 39.0736 30.3915 38.9924 30.785 39.2857C31.1784 39.579 31.2596 40.1357 30.9663 40.5292C30.9653 40.5304 30.9644 40.5317 30.9634 40.533L28.2967 44.0886C28.1425 44.2948 27.9061 44.4238 27.6492 44.4419C27.6275 44.4436 27.6067 44.4444 27.5858 44.4444C27.3501 44.4445 27.124 44.3508 26.9574 44.184L25.1796 42.4062ZM3.58583 13.3333C3.58583 12.8424 3.9838 12.4444 4.47472 12.4444H8.91916C9.41008 12.4444 9.80805 12.8424 9.80805 13.3333C9.80805 13.8243 9.41008 14.2222 8.91916 14.2222H4.47472C3.9838 14.2222 3.58583 13.8243 3.58583 13.3333ZM12.4747 13.3333C12.4747 12.8424 12.8727 12.4444 13.3636 12.4444H15.1414C15.6323 12.4444 16.0303 12.8424 16.0303 13.3333C16.0303 13.8243 15.6323 14.2222 15.1414 14.2222H13.3636C12.8727 14.2222 12.4747 13.8243 12.4747 13.3333ZM4.47472 16.8889C3.9838 16.8889 3.58583 16.4909 3.58583 16C3.58583 15.5091 3.9838 15.1111 4.47472 15.1111H8.91916C9.41008 15.1111 9.80805 15.5091 9.80805 16C9.80805 16.4909 9.41008 16.8889 8.91916 16.8889H4.47472ZM12.4747 16C12.4747 15.5091 12.8727 15.1111 13.3636 15.1111H15.1414C15.6323 15.1111 16.0303 15.5091 16.0303 16C16.0303 16.4909 15.6323 16.8889 15.1414 16.8889H13.3636C12.8727 16.8889 12.4747 16.4909 12.4747 16ZM12.4747 8C12.4747 7.50908 12.8727 7.11111 13.3636 7.11111H15.1414C15.6323 7.11111 16.0303 7.50908 16.0303 8C16.0303 8.49092 15.6323 8.88889 15.1414 8.88889H13.3636C12.8727 8.88889 12.4747 8.49092 12.4747 8ZM12.4747 5.33333C12.4747 4.84241 12.8727 4.44444 13.3636 4.44444H15.1414C15.6323 4.44444 16.0303 4.84241 16.0303 5.33333C16.0303 5.82425 15.6323 6.22222 15.1414 6.22222H13.3636C12.8727 6.22222 12.4747 5.82425 12.4747 5.33333ZM12.4747 10.6667C12.4747 10.1757 12.8727 9.77778 13.3636 9.77778H15.1414C15.6323 9.77778 16.0303 10.1757 16.0303 10.6667C16.0303 11.1576 15.6323 11.5556 15.1414 11.5556H13.3636C12.8727 11.5556 12.4747 11.1576 12.4747 10.6667Z" fill="black" />
                                </svg>
                            </SvgIcon>
                            {/* Left Side - Typography */}
                            <Typography fontSize={16} fontWeight={600} fontFamily="Inter">
                                {kbContent?.title}
                            </Typography>
                        </Stack>
                        {/* Right Side - Buttons */}
                        <Stack direction="row" spacing={2}>
                            <Button
                                sx={{
                                    width: { xs: '50px', xl: '90px' },
                                    height: '50px',
                                    background: '#D30000',
                                    color: '#fff',
                                    fontFamily: 'Inter',
                                    fontSize: 14,
                                    textTransform: 'none',
                                    fontWeight: 400,
                                    border: '0',
                                    borderRadius: '10px',
                                    '&:hover': {
                                        background: '#D30000',
                                        opacity: 1
                                    }
                                }}
                                onClick={() => {
                                    mutateDelete(kbContent?._id)
                                }}
                            >
                                Delete
                            </Button>

                            {/* Upload Button */}
                            <Button
                                component="label"
                                sx={{
                                    width: { xs: "110px", xl: "120px" },
                                    height: "50px",
                                    background: "#D30000",
                                    color: "#fff",
                                    fontFamily: "Inter",
                                    fontSize: 14,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    borderRadius: "10px",
                                    "&:hover": {
                                        background: "#D30000",
                                        opacity: 1,
                                    },
                                }}
                            >
                                <CloudUploadIcon sx={{ mr: 1 }} />
                                Upload
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp4,.jpg,.png,.jpeg"
                                    onChange={(event) => handleFileChange(event, kbContent._id)}
                                />
                            </Button>
                        </Stack>
                    </Stack>


                    {/* File Previews */}
                    <Box display="flex" flexWrap="wrap" gap={2} sx={{ mt: 2, width: "100%",height:"200px", overflowY: "auto", }} >
                        {/* Show API files first (Existing files) */}
                        {kbContent?.files?.map((file: { _id: string; filePath: string }, _index: number) => {
                            const fileType = file.filePath.split(".").pop()?.toLowerCase() || "";

                            return (
                                <Stack
                                    key={file._id}
                                    direction="row"
                                    alignItems="center"
                                    gap={1}
                                    p={1}
                                    border="1px solid #ccc"
                                    borderRadius="10px"
                                    width="fit-content"
                                    // height={"50px"}
                                >
                                    {/* Display file preview based on file type */}
                                    {["jpg", "jpeg", "png"].includes(fileType) ? (
                                        <img src={file.filePath} alt="Preview" width={100} height={100} />
                                    ) : ["mp4"].includes(fileType) ? (
                                        <video src={file.filePath} width={150} height={100} controls />
                                    ) : fileType === "pdf" ? (
                                        <iframe src={file.filePath} width="150" height="100" title="PDF Preview" />
                                    ) : (
                                        <Typography>{file.filePath.split("/").pop()}</Typography>
                                    )}

                                    {/* Remove File Button */}
                                    <IconButton onClick={() => handleRemoveFile(file._id, _index)} sx={{ color: "red" }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            );
                        })}


                        {/* Show newly uploaded files */}
                        {fileUploads[kbContent._id]?.map((file, index) => {
                            const fileURL = URL.createObjectURL(file);
                            const fileType = file.type.split("/")[0];

                            return (
                                <Stack
                                    key={index}
                                    direction="row"
                                    alignItems="center"
                                    gap={1}
                                    p={1}
                                    border="1px solid #ccc"
                                    borderRadius="10px"
                                    width="fit-content"
                                >
                                    {/* Display preview for uploaded files */}
                                    {fileType === "image" ? (
                                        <img src={fileURL} alt="Preview" width={100} height={100} />
                                    ) : fileType === "video" ? (
                                        <video src={fileURL} width={150} height={100} controls />
                                    ) : file.type === "application/pdf" ? (
                                        <iframe src={fileURL} width="150" height="100" title="PDF Preview" />
                                    ) : (
                                        <Typography>{file.name}</Typography>
                                    )}

                                    {/* Remove File Button */}
                                    <IconButton onClick={() => handleRemoveFile(kbContent._id, index)} sx={{ color: "red" }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            );
                        })}
                    </Box>


                    
            {/* Upload to Server Button */}
            
            {isUpload &&<Button
                onClick={() => handleUploadFiles(kbContent._id)}
                sx={{
                    background: "#28a745",
                    color: "#fff",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "8px",
                    "&:hover": { background: "#218838" },
                }}
            >
               {loading?"Loading...":"Upload to Server"} 
            </Button>}


                </Stack>
            </Grid>
        )
    })



    return (
        <>
            <Stack
                width='100%'
            >
                <Stack
                >
                    <Dialog open={loading} PaperProps={{ style: { background: 'transparent', backgroundColor: 'transparent', overflow: 'hidden', boxShadow: 'none' } }}>
                        <CircularProgress size='46px' sx={{ color: '#FF7E00' }} />
                    </Dialog>
                    <Stack
                        direction='row'
                        justifyContent='flex-end'
                    >
                        {
                            add &&
                            <>
                                <Button
                                    component="label"
                                    sx={{
                                        width: "fit-content",
                                        color: "#2ed480",
                                        textTransform: "capitalize",
                                        fontSize: 16,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        alignSelf: 'flex-start',
                                        '&:hover': {
                                            bgcolor: '#fff'
                                        },
                                        ml: 'auto'
                                    }}
                                >
                                    <input
                                        hidden
                                        accept=".pdf,.xls,.xlsx,.csv,.doc,.docx,.txt,.ppt,.pptx,.mp4,.mov,.avi,.wmv,.mkv"
                                        onChange={(e) => onFileChange(e)}
                                        type="file"
                                    />
                                    {
                                        fileType === null ?
                                            <SvgIcon sx={{ fontSize: 42 }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="30" viewBox="0 0 36 30" fill="none">
                                                    <path d="M18.8633 11.6064V29.1412C18.8633 29.6064 18.4673 30 17.9994 30C17.5314 30 17.1354 29.6064 17.1354 29.1412V11.6064L13.7155 15.1849C13.3915 15.5428 12.8155 15.5428 12.4556 15.2207C12.0956 14.8987 12.0956 14.3261 12.4196 13.9683L17.3514 8.85097C17.5314 8.67205 17.7474 8.56469 17.9994 8.56469C18.2513 8.56469 18.4673 8.67205 18.6473 8.85097L23.5792 13.9683C23.9031 14.3261 23.9031 14.8629 23.5432 15.2207C23.3632 15.3997 23.1472 15.4712 22.9312 15.4712C22.7152 15.4712 22.4632 15.3639 22.2832 15.1849L18.8633 11.6064ZM35.9987 15.5786C35.8907 11.3917 32.9028 7.13329 27.431 7.13329C27.287 7.13329 27.143 7.13329 26.999 7.13329C26.639 5.45138 25.8831 3.94841 24.6951 2.73171C23.4352 1.44345 21.7792 0.548818 19.9433 0.190966C16.1994 -0.560522 12.5635 0.942454 10.5116 4.05576C8.3877 3.80527 6.33577 4.48518 4.71583 5.91659C3.05989 7.38378 2.19592 9.45932 2.30392 11.6064C0.82797 13.0021 0 14.9345 0 16.9384C0 21.0179 3.34788 24.3102 7.41573 24.3102H14.4715C14.9395 24.3102 15.3355 23.9165 15.3355 23.4513C15.3355 22.9861 14.9395 22.5925 14.4715 22.5925H7.41573C4.28385 22.5925 1.76394 20.0517 1.76394 16.9742C1.76394 15.3281 2.51991 13.7535 3.81586 12.6442C4.03186 12.4653 4.13985 12.179 4.13985 11.8927C3.95986 10.1035 4.64383 8.42155 5.97579 7.20486C7.30774 6.02395 9.07168 5.52295 10.8356 5.88081C11.1956 5.95238 11.5916 5.77345 11.7716 5.45138C13.3555 2.66014 16.4154 1.26452 19.6193 1.94444C22.1392 2.44543 24.9831 4.37783 25.4151 8.20684C25.4511 8.45734 25.5591 8.67205 25.7391 8.81519C25.9191 8.95833 26.1711 9.0299 26.4231 8.99411C26.747 8.95833 27.107 8.92254 27.467 8.92254C32.0389 8.92254 34.1988 12.4295 34.2708 15.6502C34.3428 18.9424 32.2548 22.3778 27.431 22.5925H21.5272C21.0592 22.5925 20.6633 22.9861 20.6633 23.4513C20.6633 23.9165 21.0592 24.3102 21.5272 24.3102H27.431H27.467C30.1669 24.167 32.4348 23.165 33.9828 21.4116C35.3147 19.8728 36.0347 17.7973 35.9987 15.5786Z" fill="#226E9F" />
                                                </svg>
                                            </SvgIcon>
                                            :
                                            fileType === 'video/mp4' ?
                                                <SvgIcon sx={{ fontSize: 42 }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="76" height="56" viewBox="0 0 76 56" fill="none">
                                                        <path d="M66.8568 0H9.14323C4.10087 0 0 4.10087 0 9.14195V46.7324C0 51.7735 4.10087 55.8743 9.14323 55.8743H66.8568C71.8991 55.8743 76 51.7735 76 46.7324V9.14195C76 4.10087 71.8991 0 66.8568 0ZM72.9527 9.14195V9.48197H66.3545V3.04732H66.8568C70.2183 3.04732 72.9527 5.78037 72.9527 9.14195ZM18.9523 43.345V12.5293H57.8101V43.345H18.9523ZM53.7646 9.48197V3.04732H60.2585V9.48197H53.7646ZM47.67 9.48197H41.4968V3.04732H47.67V9.48197ZM35.4022 9.48197H28.9083V3.04732H35.4022V9.48197ZM22.8124 9.48197H15.4478V3.04732H22.8124V9.48197ZM15.905 12.5293V43.345H3.04732V12.5293H15.905ZM22.8124 46.3924V52.827H15.4478V46.3924H22.8124ZM28.9083 46.3924H35.4022V52.827H28.9083V46.3924ZM41.4968 46.3924H47.67V52.827H41.4968V46.3924ZM53.7646 46.3924H60.2585V52.827H53.7646V46.3924ZM60.8574 43.345V12.5293H72.9527V43.345H60.8574ZM9.14323 3.04732H9.35317V9.48197H3.04732V9.14195C3.04732 5.78037 5.78166 3.04732 9.14323 3.04732ZM3.04732 46.7324V46.3924H9.35317V52.827H9.14323C5.78166 52.827 3.04732 50.094 3.04732 46.7324ZM66.8568 52.827H66.3545V46.3924H72.9527V46.7324C72.9527 50.094 70.2183 52.827 66.8568 52.827Z" fill="#226E9F" />
                                                        <path d="M47.5965 24.8891L34.1863 17.1459C31.2832 15.4702 28.9082 16.8406 28.9082 20.1945V35.6783C28.9082 39.0322 31.2832 40.4026 34.1863 38.7269L47.5965 30.9837C50.4996 29.3081 50.4996 26.5647 47.5965 24.8891Z" fill="#226E9F" />
                                                    </svg>
                                                </SvgIcon>
                                                :
                                                <SvgIcon sx={{ fontSize: 42 }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="92" viewBox="0 0 80 92" fill="none">
                                                        <path d="M47.027 0H1.62162C0.726025 0 0 0.735532 0 1.64286V90.3571C0 91.2645 0.726025 92 1.62162 92H33.5135H49.4595H65.4054C66.301 92 67.027 91.2645 67.027 90.3571V72.8333H18.9189V35.5952H67.027V21.3571H48.6486C47.8057 21.3571 47.113 20.7056 47.0344 19.8725L47.027 19.7143V0ZM80 38.881H22.1622V69.5476H80V38.881ZM66.0072 46.2931C66.8095 46.2931 67.575 46.3893 68.3034 46.5818C69.0319 46.7744 69.7938 47.0453 70.5891 47.3947L69.5334 49.9724L68.9425 49.7351C68.3783 49.5171 67.8943 49.3574 67.4905 49.2558C66.9521 49.1203 66.4224 49.0525 65.9016 49.0525C65.2822 49.0525 64.8072 49.1987 64.4763 49.4911C64.1455 49.7834 63.9801 50.1649 63.9801 50.6355C63.9801 50.9279 64.047 51.1828 64.1807 51.4002C64.3145 51.6177 64.5274 51.8281 64.8195 52.0313C65.1116 52.2345 65.8031 52.5999 66.894 53.1276C68.3369 53.8264 69.3257 54.527 69.8606 55.2293C70.3956 55.9317 70.663 56.7927 70.663 57.8123C70.663 59.2242 70.1615 60.3365 69.1586 61.1494C68.1556 61.9622 66.7603 62.3687 64.9725 62.3687C63.3256 62.3687 61.8687 62.0549 60.6018 61.4275V58.3471C61.6434 58.8177 62.525 59.1493 63.2464 59.3418C63.9678 59.5343 64.6277 59.6306 65.2259 59.6306C65.9438 59.6306 66.4946 59.4915 66.8782 59.2134C67.2617 58.9354 67.4535 58.5218 67.4535 57.9727C67.4535 57.6661 67.3691 57.3934 67.2002 57.1545C67.0312 56.9157 66.7831 56.6857 66.4559 56.4647L66.2639 56.3431C65.9703 56.1665 65.5257 55.9312 64.9302 55.6372L64.4552 55.4058C63.5121 54.9566 62.8048 54.5252 62.3332 54.1116C61.8616 53.698 61.4851 53.2167 61.2035 52.6677C60.922 52.1186 60.7812 51.4769 60.7812 50.7425C60.7812 49.3591 61.244 48.2718 62.1695 47.4803C63.0951 46.6888 64.3743 46.2931 66.0072 46.2931ZM36.9109 46.5177L40.2365 52.1436L43.4987 46.5177H47.0249L42.1791 54.272L47.3944 62.1548H43.6571L40.0676 56.24L36.478 62.1548H32.973L38.0933 54.0902L33.3003 46.5177H36.9109ZM52.6098 46.5177V59.4167H58.8704V62.1548H49.337V46.5177H52.6098ZM66.5521 17.3084L50.2703 0.813762V18.0714L66.9787 18.0718C66.908 17.7852 66.7617 17.5207 66.5521 17.3084Z" fill="#226E9F" />
                                                    </svg>
                                                </SvgIcon>
                                    }
                                    {/*//@ts-expect-error file*/}
                                    <Typography fontWeight={400} fontFamily='Inter' sx={{ cursor: 'pointer', color: '#226E9F' }}>{fileType === null ? "Upload Program's Content" : file?.name}</Typography>
                                </Button>
                                <Stack
                                    gap={1.5}
                                    mx={6}
                                    mb={3}
                                >
                                    <InputLabel sx={{ color: '#000', fontSize: 16, fontFamily: 'Inter', fontWeight: 600 }} id='LessonTitle'>Title</InputLabel>
                                    <Input
                                        color='primary'
                                        disableUnderline
                                        aria-labelledby='LessonTitle'
                                        sx={{
                                            border: '1px solid rgba(0, 0, 0, 0.20)',
                                            width: '420px',
                                            background: '#fff',
                                            borderRadius: '5px',
                                            paddingX: 1,
                                            paddingY: 0.5,
                                            flex: 1,
                                            bgcolor: '#F8F8F8'
                                        }}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Stack>
                            </>
                        }
                        <Button
                            sx={{
                                background: 'linear-gradient(95deg, #FF7E00 5.94%, #FF9F06 95.69%)',
                                color: '#fff',
                                fontFamily: 'Inter',
                                fontSize: 18,
                                textTransform: 'none',
                                fontWeight: 500,
                                border: '1px solid linear-gradient(95deg, #FF7E00 5.94%, #FF9F06 95.69%)',
                                borderRadius: '8px',
                                '&:hover': {
                                    background: 'linear-gradient(95deg, #FF7E00 5.94%, #FF9F06 95.69%)',
                                    opacity: 1
                                },
                                paddingY: 1,
                                paddingX: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: 1,
                                width: '160px',
                                ml: 2,
                                maxHeight: '50px',
                                minHeight: '50px',
                                mt: 3,
                                mb: 2
                            }}
                            onClick={() => {
                                if (!add) {
                                    setAdd(true)
                                }
                                else if (add && !title) {
                                    setAdd(false)
                                }
                                else if (add && title) {
                                    mutateAdd()
                                }
                            }}
                        >
                            <SvgIcon sx={{ fontSize: 20, fontWeight: 400 }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8.17479 0H10.8252C11.4319 0 11.9109 0.478992 11.9109 1.05378V7.12101H17.9462C18.521 7.12101 19 7.6 19 8.17479V10.8252C19 11.4319 18.521 11.9109 17.9462 11.9109H11.9109V17.9462C11.9109 18.521 11.4319 19 10.8252 19H8.17479C7.6 19 7.12101 18.521 7.12101 17.9462V11.9109H1.05378C0.478992 11.9109 0 11.4319 0 10.8252V8.17479C0 7.6 0.478992 7.12101 1.05378 7.12101H7.12101V1.05378C7.12101 0.478992 7.6 0 8.17479 0Z" fill="white" />
                                </svg>
                            </SvgIcon>
                            <Typography textAlign='left' noWrap fontFamily='Inter' fontSize={14}>Add Files</Typography>
                        </Button>
                    </Stack>

                    <Grid container spacing={2} justifyContent='space-between' alignItems='center' columns={16}>
                        {displayedContent}
                    </Grid>
                </Stack>
            </Stack>
        </>
    )
}



