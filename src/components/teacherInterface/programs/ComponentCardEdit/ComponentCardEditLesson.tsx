import { useEffect, useMemo, useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Box, Stack, Button, SvgIcon, Typography, Input, InputLabel, Alert, CircularProgress, Dialog } from "@mui/material"
// import { setLessonData } from "../../../helpers/setLessonData"
// import { setDeleteLesson } from "../../../helpers/setDeleteLesson"
import { getStorage, ref, uploadBytesResumable } from "firebase/storage"
import axios from "axios"
import LessonProps from "../../../../interfaces/LessonProps"

//@ts-expect-error anytype
export default function ComponentCardEditLesson({ course, setEdited, lesson, order, setAdded }) 
{

    console.log("LESSON",lesson,order)
    const queryClient = useQueryClient()

    const [title, setTitle] = useState(lesson?.lessonTitle ?? '')
    const [description, setDescription] = useState(lesson?.lessonDescription ?? '')
    // const [file, setFile] = useState(lesson ? {name: lesson?.content?.content} : {})
    const [file, setFile] = useState(lesson ?. lessonFile)
    const [duration, setDuration] = useState(lesson?.duration ?? '')
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(false)
    const [fileType, setFileType] = useState((lesson && lesson?.content && lesson?.content?.type) && lesson?.content?.type === 'Videos/' ? 'video/mp4' : lesson?.content?.type === 'Pdfs/' ? 'pdf' : '');
    const [progress, setProgress] = useState(-1)
    const [error, setError] = useState('')
    const token = sessionStorage.getItem('token');
    const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
    const role= sessionStorage.getItem("role")
    useEffect(() => {
        if(lesson && lesson.title !== title)
        {
            setTitle(lesson.title)
            setDescription(lesson.description)
            setFile({name: lesson.content?.content})
            setDuration(lesson?.duration)
            setFileType((lesson && lesson?.content && lesson?.content?.type) && lesson?.content?.type === 'Videos/' ? 'video/mp4' : lesson?.content?.type === 'Pdfs/' ? 'pdf' : '')
        }

        return () => {
            close()
        }
    }, [lesson]);
    console.log(duration)
    
    const isUpdate = !!lesson?._id;

    const initialLesson = useRef({ title, description, fileType });

    const hasChanges = useMemo(() => {
        return (
            title !== initialLesson.current.title ||
            description !== initialLesson.current.description ||
            fileType !== initialLesson.current.fileType ||
            (!isUpdate && file) // Ensure file is required only when creating a new lesson
        );
    }, [title, description, file, fileType, isUpdate]);
    
    const canSave = useMemo(() => {
        return isUpdate ? hasChanges : (title && description && fileType && file);
    }, [title, description, file, fileType, isUpdate, hasChanges]);
const handleUploadFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSave ) {
        setError("Please fill in all required fields");
        return;
    }

    setPageLoading(true);

    const storage = getStorage();
    const storagePath = fileType === "video/mp4" ? "Videos/" : "Pdfs/";
    const storageRef = ref(storage, storagePath + file.name);

    if (!isUpdate && file) {
        // Upload only for new lessons
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
            },
            (error) => {
                setError(error.message);
                setPageLoading(false);
            },
            async () => saveLessonData()
        );
    } else {
        saveLessonData();
    }
};

const saveLessonData = async () => {
    const apiUrl = isUpdate
        ? `${BASE_URL}/${role}/assessment/${lesson._id}` // PATCH
        : `${BASE_URL}/${role}/assessment/add`; // POST

    const method = isUpdate ? "patch" : "post";

    const requestData = new FormData();
   // Append only changed fields
      // Append only changed fields (avoid sending undefined)
if (title && title !== initialLesson.current.title) {
    requestData.append("lessonTitle", title);
}

if (!isUpdate || course?._id !== lesson?.courseId) {
    requestData.append("courseId", course?._id ?? "");
}

if (description && description !== initialLesson.current.description) {
    requestData.append("lessonDescription", description);
}

// Append file only if creating a new lesson or file has changed
if (!isUpdate && file) {
    requestData.append("lessonFile", file);
} else if (fileType !== initialLesson.current.fileType && file) {
    requestData.append("lessonFile", file);
}
    try {
        const response = await axios[method](apiUrl, requestData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response?.status === 200 && response.data?.success) {
            const newLesson = response.data;

            queryClient.setQueryData(["lessons", course.programId, course._id], (oldData: any = []) => {
                const filteredArray = oldData?.filter((lessonData: LessonProps) => lessonData._id !== lesson?._id) || [];
                return [...filteredArray, newLesson];
            });
            {/*//@ts-expect-error lesson*/}
            await queryClient.invalidateQueries(["lessons", course?.programId, course?._id]);

            setPageLoading(false);
            setAdded(false);
            setEdited(false);
            setError("");
        } else {
            throw new Error(response.data.message || "Failed to save lesson");
        }
    } catch  {
        console.error("Error uploading lesson:", error);
        // setError(error.response?.data?.message || "Something went wrong");
        setPageLoading(false);
    }
};



const { mutate: mutateDelete } = useMutation({
    mutationFn: async () => {
        setPageLoading(true);
        const response = await axios.delete(`${BASE_URL}/${role}/assessment/${lesson?._id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Ensure token is available
            },
        });
        return response.data;
    },
    onSuccess: async (data) => {
        if (data.success) {
            // ✅ Invalidate and refetch the lessons list after successful deletion
            await queryClient.invalidateQueries({ queryKey: ["lessons", course.programId, course._id] });
        }
        setPageLoading(false);
    },
    onError: (error) => {
        console.error("Error deleting lesson:", error);
        setPageLoading(false);
    },
});
    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files && event.target.files[0])
        {
            const uploadedFile = event.target.files[0];
    
            if (uploadedFile) {
                // Check if the file type is either PDF or MP4
                const allowedTypes = ['application/pdf', 'video/mp4'];
                if (allowedTypes.includes(uploadedFile.type)) {
                    setLoading(true)
                    setFile(uploadedFile);
                    const fileType = uploadedFile.type;
                    setFileType(fileType);
                    if(fileType === 'video/mp4')
                    {
                        const video = document.createElement('video')

                        const objectURL = window.URL.createObjectURL(uploadedFile as File)

                        video.addEventListener('loadedmetadata', () => {
                            setDuration(video.duration);
                            setLoading(false)
                        })

                        video.src = objectURL
                    }
                    else
                    {
                        setDuration(0);
                        const xhr = new XMLHttpRequest();

                        xhr.open('GET', URL.createObjectURL(uploadedFile as File), true);
                        xhr.responseType = 'arraybuffer'

                        xhr.onload = () => {
                            setLoading(false);
                        }

                        xhr.send();
                    }
                }
            }
        }
    }

    return (
        <Box
            display='flex'
            flexDirection='column' 
            bgcolor='#fff'
            py={2}
        >
            <Dialog open={pageLoading} PaperProps={{ style: { background: 'transparent', backgroundColor: 'transparent', overflow: 'hidden', boxShadow: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' } }}>
                <CircularProgress size='46px' sx={{ color: '#FF7E00' }} />
                <Typography sx={{ color: '#FF7E00', mt: 1 }} >{progress}%</Typography>
            </Dialog>
            
            <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
            >
                <Button
                    sx={{
                        flex: 1,
                        background: '#fff',
                        color: '#fff',
                        fontFamily: 'Inter',
                        fontSize: 18,
                        textTransform: 'none',
                        fontWeight: 500,
                        border: '1px solid rgba(34,110,159, 0.5)',
                        borderRadius: '8px',
                        '&:hover': {
                            background: '#fff',
                            opacity: 1
                        },
                        paddingY: 1.25,
                        paddingX: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        maxWidth: '160px',
                    }}
                    onClick={() => mutateDelete()}
                >
                    <SvgIcon sx={{ fontSize: 28, fontWeight: 400 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="28" viewBox="0 0 23 28" fill="none">
                            <path d="M21.3043 3.44928C21.8646 3.44928 22.3188 3.90348 22.3188 4.46377C22.3188 5.02406 21.8646 5.47826 21.3043 5.47826H21.2901C21.178 5.47826 21.0838 5.56709 21.0796 5.68195L20.3492 25.4028C20.2958 26.8426 19.0924 28 17.6522 28H4.66668C3.22572 28 2.02292 26.8405 1.96967 25.4028L1.23927 5.68195C1.2351 5.56946 1.14337 5.47826 1.02875 5.47826H1.01449C0.454204 5.47826 0 5.02406 0 4.46377C0 3.90348 0.454204 3.44928 1.01449 3.44928H5.9605C6.07195 3.44928 6.18764 3.3606 6.21763 3.25565L6.54843 2.09784C6.88779 0.910056 8.09449 0 9.32988 0H12.989C14.2245 0 15.431 0.909729 15.7704 2.09784L16.1012 3.25565C16.1318 3.36259 16.2459 3.44928 16.3583 3.44928H21.3043ZM10.3478 9.13043V22.9275C10.3478 23.3758 10.7112 23.7391 11.1594 23.7391C11.6077 23.7391 11.971 23.3758 11.971 22.9275V9.13043C11.971 8.6822 11.6077 8.31884 11.1594 8.31884C10.7112 8.31884 10.3478 8.6822 10.3478 9.13043ZM5.88441 9.15429L6.29021 22.9514C6.30338 23.3994 6.67727 23.752 7.12531 23.7388C7.57335 23.7256 7.92587 23.3517 7.91269 22.9037L7.5069 9.10657C7.49372 8.65854 7.11983 8.30601 6.67179 8.31919C6.22375 8.33237 5.87123 8.70626 5.88441 9.15429ZM14.8119 9.10657L14.4061 22.9037C14.393 23.3517 14.7455 23.7256 15.1935 23.7388C15.6416 23.752 16.0155 23.3994 16.0286 22.9514L16.4344 9.15429C16.4476 8.70626 16.0951 8.33237 15.647 8.31919C15.199 8.30601 14.8251 8.65854 14.8119 9.10657ZM8.47798 3.44928H13.8409C13.9557 3.44928 14.0218 3.36322 13.9914 3.25706L13.8195 2.65525C13.7289 2.33831 13.3187 2.02899 12.989 2.02899H9.32988C9.00032 2.02899 8.58982 2.33857 8.49935 2.65525L8.3274 3.25706C8.29676 3.3643 8.36448 3.44928 8.47798 3.44928Z" fill="#226E9F"/>
                        </svg>
                    </SvgIcon>
                    <Typography noWrap sx={{ color: '#6A9DBC' }} fontFamily='Inter' fontSize={14}>Delete Lesson</Typography>
                </Button>
                <Stack
                    direction='row'
                    gap={2}
                >
                    <Button
                        sx={{
                            flex: 1,
                            background: 'linear-gradient(95deg, #226E9F 5.94%, #6A9DBC 95.69%)',
                            color: '#fff',
                            fontFamily: 'Inter',
                            fontSize: 18,
                            textTransform: 'none',
                            fontWeight: 500,
                            border: '1px solid linear-gradient(95deg, #226E9F 5.94%, #6A9DBC 95.69%)',
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
                        }}
                    >
                        <SvgIcon sx={{ fontSize: 20, fontWeight: 400 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M8.17479 0H10.8252C11.4319 0 11.9109 0.478992 11.9109 1.05378V7.12101H17.9462C18.521 7.12101 19 7.6 19 8.17479V10.8252C19 11.4319 18.521 11.9109 17.9462 11.9109H11.9109V17.9462C11.9109 18.521 11.4319 19 10.8252 19H8.17479C7.6 19 7.12101 18.521 7.12101 17.9462V11.9109H1.05378C0.478992 11.9109 0 11.4319 0 10.8252V8.17479C0 7.6 0.478992 7.12101 1.05378 7.12101H7.12101V1.05378C7.12101 0.478992 7.6 0 8.17479 0Z" fill="white"/>
                            </svg>
                        </SvgIcon>
                        <Typography noWrap fontFamily='Inter' fontSize={14}>Add Materials</Typography>
                    </Button>
                    <Button
                        sx={{
                            flex: 1,
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
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            setEdited('')
                            setAdded('quiz')
                        }}
                    >
                        <SvgIcon sx={{ fontSize: 38, fontWeight: 400 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
                            <mask id="mask0_254_1843" maskUnits="userSpaceOnUse" x="0" y="0" width="43" height="43">
                                <path d="M43 0H0V43H43V0Z" fill="white"/>
                            </mask>
                            <g mask="url(#mask0_254_1843)">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5.5148 21.9244L6.25968 22.6693V23.8882H7.47858L8.02031 24.4469C8.13881 24.5654 8.25732 24.65 8.39275 24.7347C8.68054 24.887 8.95141 24.9547 9.27306 24.9547C9.61165 24.9547 9.88251 24.887 10.1703 24.7347C10.2719 24.6669 10.3735 24.5992 10.4581 24.5146L12.9467 22.2969V24.8701C12.9467 25.0394 12.9128 25.1917 12.8113 25.361C12.7266 25.5134 12.6081 25.6319 12.4557 25.7166C12.3034 25.8012 12.151 25.852 11.9648 25.852H5.27779C5.09157 25.852 4.93921 25.8012 4.78684 25.7166C4.63448 25.6319 4.51598 25.5134 4.43133 25.361C4.32976 25.1917 4.2959 25.0394 4.2959 24.8701V18.1831C4.2959 17.9969 4.32976 17.8445 4.43133 17.6921C4.51598 17.5398 4.63448 17.4213 4.78684 17.3366C4.93921 17.2351 5.09157 17.2012 5.27779 17.2012H11.9648C12.151 17.2012 12.3034 17.2351 12.4557 17.3366C12.6081 17.4213 12.7266 17.5229 12.8113 17.6752L10.9829 19.3004V19.165H7.6648C7.52936 19.0803 7.39393 19.0295 7.24157 18.9788C6.91991 18.8941 6.63212 18.8941 6.32739 18.9788C6.00574 19.0634 5.7518 19.1988 5.5148 19.4358C5.29472 19.6559 5.14236 19.9099 5.05771 20.2315C4.97306 20.5362 4.97306 20.824 5.05771 21.1457C5.14236 21.4504 5.27779 21.7043 5.5148 21.9244ZM18.6518 12.5118C18.2963 12.5118 17.9916 12.4272 17.6699 12.2579C17.3652 12.0717 17.1282 11.8516 16.9589 11.5299C16.7727 11.2252 16.688 10.9205 16.688 10.565C16.688 10.1925 16.7727 9.88781 16.9589 9.58309C17.1282 9.26143 17.3652 9.04135 17.6699 8.85513C17.9916 8.68584 18.2963 8.6012 18.6518 8.6012H36.7321C37.0876 8.6012 37.4093 8.68584 37.714 8.85513C38.0357 9.04135 38.2557 9.26143 38.442 9.58309C38.6113 9.88781 38.6959 10.1925 38.6959 10.565C38.6959 10.9205 38.6113 11.2252 38.442 11.5299C38.2557 11.8516 38.0357 12.0717 37.714 12.2579C37.4093 12.4272 37.0876 12.5118 36.7321 12.5118H18.6518ZM18.6518 23.465C18.2963 23.465 17.9916 23.3803 17.6699 23.211C17.3652 23.0248 17.1282 22.8047 16.9589 22.4831C16.7727 22.1784 16.688 21.8736 16.688 21.5181C16.688 21.1457 16.7727 20.841 16.9589 20.5362C17.1282 20.2146 17.3652 19.9945 17.6699 19.8083C17.9916 19.639 18.2963 19.5543 18.6518 19.5543H36.7321C37.0876 19.5543 37.4093 19.639 37.714 19.8083C38.0357 19.9945 38.2557 20.2146 38.442 20.5362C38.6113 20.841 38.6959 21.1457 38.6959 21.5181C38.6959 21.8736 38.6113 22.1784 38.442 22.4831C38.2557 22.8047 38.0357 23.0248 37.714 23.211C37.4093 23.3803 37.0876 23.465 36.7321 23.465H18.6518ZM18.6518 34.4181C18.2963 34.4181 17.9916 34.3335 17.6699 34.1642C17.3652 33.978 17.1282 33.7579 16.9589 33.4362C16.7727 33.1315 16.688 32.8268 16.688 32.4713C16.688 32.0988 16.7727 31.7941 16.9589 31.4894C17.1282 31.1677 17.3652 30.9477 17.6699 30.7614C17.9916 30.5921 18.2963 30.5075 18.6518 30.5075H36.7321C37.0876 30.5075 37.4093 30.5921 37.714 30.7614C38.0357 30.9477 38.2557 31.1677 38.442 31.4894C38.6113 31.7941 38.6959 32.0988 38.6959 32.4713C38.6959 32.8268 38.6113 33.1315 38.442 33.4362C38.2557 33.7579 38.0357 33.978 37.714 34.1642C37.4093 34.3335 37.0876 34.4181 36.7321 34.4181H18.6518ZM6.07346 21.3827C5.93802 21.2473 5.87031 21.1118 5.81952 20.9425C5.76873 20.7563 5.76873 20.604 5.81952 20.4347C5.87031 20.2654 5.95495 20.113 6.07346 19.9945C6.20889 19.8591 6.34432 19.7914 6.51362 19.7406C6.69984 19.6898 6.8522 19.6898 7.02149 19.7406C7.20771 19.7914 7.34314 19.876 7.46165 19.9945L9.32385 21.8567L17.9916 14.1032C18.127 13.9847 18.2794 13.9169 18.4487 13.8662C18.6179 13.8323 18.7872 13.8492 18.9565 13.9C19.1258 13.9508 19.2613 14.0354 19.3798 14.1709C19.4983 14.3063 19.5829 14.4587 19.6168 14.628C19.6506 14.7973 19.6337 14.9666 19.5829 15.1358C19.5321 15.3051 19.4475 15.4406 19.312 15.5591L9.9333 23.9221C9.88251 23.9729 9.83173 24.0067 9.76401 24.0406C9.61165 24.1421 9.45928 24.176 9.27306 24.176C9.10377 24.176 8.95141 24.1421 8.78212 24.0406C8.7144 24.0067 8.64669 23.9559 8.57897 23.8882L6.07346 21.3827ZM4.78684 14.7803C4.63448 14.6788 4.51598 14.5772 4.43133 14.4248C4.32976 14.2555 4.2959 14.1032 4.2959 13.9339V7.22994C4.2959 7.04372 4.32976 6.89135 4.43133 6.73899C4.51598 6.58663 4.63448 6.46813 4.78684 6.38348C4.93921 6.28191 5.09157 6.24805 5.27779 6.24805H11.9648C12.151 6.24805 12.3034 6.28191 12.4557 6.38348C12.6081 6.46813 12.7266 6.58663 12.8113 6.73899C12.9128 6.89135 12.9467 7.04372 12.9467 7.22994V13.9339C12.9467 14.1032 12.9128 14.2555 12.8113 14.4248C12.7266 14.5772 12.6081 14.6788 12.4557 14.7803C12.3034 14.865 12.151 14.9158 11.9648 14.9158H5.27779C5.09157 14.9158 4.93921 14.865 4.78684 14.7803ZM6.25968 12.952H10.9829V8.21183H6.25968V12.952ZM4.78684 36.6358C4.63448 36.5343 4.51598 36.4327 4.43133 36.2803C4.32976 36.111 4.2959 35.9587 4.2959 35.7894V29.0854C4.2959 28.8992 4.32976 28.7469 4.43133 28.5945C4.51598 28.4421 4.63448 28.3236 4.78684 28.239C4.93921 28.1374 5.09157 28.1036 5.27779 28.1036H11.9648C12.151 28.1036 12.3034 28.1374 12.4557 28.239C12.6081 28.3236 12.7266 28.4421 12.8113 28.5945C12.9128 28.7469 12.9467 28.8992 12.9467 29.0854V35.7894C12.9467 35.9587 12.9128 36.111 12.8113 36.2803C12.7266 36.4327 12.6081 36.5343 12.4557 36.6358C12.3034 36.7205 12.151 36.7713 11.9648 36.7713H5.27779C5.09157 36.7713 4.93921 36.7205 4.78684 36.6358ZM6.25968 34.8075H10.9829V30.0673H6.25968V34.8075Z" fill="white"/>
                            </g>
                        </svg>
                        </SvgIcon>
                        <Typography textAlign='left' noWrap fontFamily='Inter' fontSize={14}>Add Quiz</Typography>
                    </Button>
                </Stack>
            </Stack>
            {
                error &&
                <Alert sx={{ mt: 4 }} severity="error">{error}</Alert>
            }
            <Stack
                direction='row'
                gap={18}
                mt={8}
                mb={2}
            >
                <Stack
                    gap={1.5}
                >
                    <InputLabel sx={{ color: '#000', fontSize: 16, fontFamily: 'Inter', fontWeight: 600 }} id='LessonTitle'>Lesson's Title</InputLabel>
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
                <Stack
                    gap={1.5}
                    flex={1}
                >
                    <InputLabel sx={{ color: '#000', fontSize: 16, fontFamily: 'Inter', fontWeight: 600 }} id='LessonDescription'>Lesson's Description</InputLabel>
                    <Input 
                        color='primary' 
                        disableUnderline
                        aria-labelledby='LessonDescription'
                        sx={{
                            border: '1px solid rgba(0, 0, 0, 0.20)',
                            background: '#fff',
                            borderRadius: '5px',
                            paddingX: 1,
                            paddingY: 0.5,
                            flex: 1,
                            bgcolor: '#F8F8F8'
                        }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Stack>
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
                            mr: 'auto',
                            mt: 2,
                            gap: 1.5,
                            alignSelf: 'flex-start',
                            '&:hover': {
                                bgcolor: '#fff'
                            },
                            overflow: 'hidden'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            hidden
                            accept=".pdf, .mp4"
                            onChange={(e) => onFileChange(e)}
                            type="file"
                        />
                        {
                            loading &&
                            <Box width='100%' height='100%' display='flex' alignItems='center' justifyContent='center' sx={{ position: 'absolute', opacity: '0.35', bgcolor: '#000' }}>
                                <CircularProgress sx={{ position: 'absolute' }} />
                            </Box>
                        }
                        {
                            fileType === '' ?
                            <SvgIcon sx={{ fontSize: 42 }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="30" viewBox="0 0 36 30" fill="none">
                                    <path d="M18.8633 11.6064V29.1412C18.8633 29.6064 18.4673 30 17.9994 30C17.5314 30 17.1354 29.6064 17.1354 29.1412V11.6064L13.7155 15.1849C13.3915 15.5428 12.8155 15.5428 12.4556 15.2207C12.0956 14.8987 12.0956 14.3261 12.4196 13.9683L17.3514 8.85097C17.5314 8.67205 17.7474 8.56469 17.9994 8.56469C18.2513 8.56469 18.4673 8.67205 18.6473 8.85097L23.5792 13.9683C23.9031 14.3261 23.9031 14.8629 23.5432 15.2207C23.3632 15.3997 23.1472 15.4712 22.9312 15.4712C22.7152 15.4712 22.4632 15.3639 22.2832 15.1849L18.8633 11.6064ZM35.9987 15.5786C35.8907 11.3917 32.9028 7.13329 27.431 7.13329C27.287 7.13329 27.143 7.13329 26.999 7.13329C26.639 5.45138 25.8831 3.94841 24.6951 2.73171C23.4352 1.44345 21.7792 0.548818 19.9433 0.190966C16.1994 -0.560522 12.5635 0.942454 10.5116 4.05576C8.3877 3.80527 6.33577 4.48518 4.71583 5.91659C3.05989 7.38378 2.19592 9.45932 2.30392 11.6064C0.82797 13.0021 0 14.9345 0 16.9384C0 21.0179 3.34788 24.3102 7.41573 24.3102H14.4715C14.9395 24.3102 15.3355 23.9165 15.3355 23.4513C15.3355 22.9861 14.9395 22.5925 14.4715 22.5925H7.41573C4.28385 22.5925 1.76394 20.0517 1.76394 16.9742C1.76394 15.3281 2.51991 13.7535 3.81586 12.6442C4.03186 12.4653 4.13985 12.179 4.13985 11.8927C3.95986 10.1035 4.64383 8.42155 5.97579 7.20486C7.30774 6.02395 9.07168 5.52295 10.8356 5.88081C11.1956 5.95238 11.5916 5.77345 11.7716 5.45138C13.3555 2.66014 16.4154 1.26452 19.6193 1.94444C22.1392 2.44543 24.9831 4.37783 25.4151 8.20684C25.4511 8.45734 25.5591 8.67205 25.7391 8.81519C25.9191 8.95833 26.1711 9.0299 26.4231 8.99411C26.747 8.95833 27.107 8.92254 27.467 8.92254C32.0389 8.92254 34.1988 12.4295 34.2708 15.6502C34.3428 18.9424 32.2548 22.3778 27.431 22.5925H21.5272C21.0592 22.5925 20.6633 22.9861 20.6633 23.4513C20.6633 23.9165 21.0592 24.3102 21.5272 24.3102H27.431H27.467C30.1669 24.167 32.4348 23.165 33.9828 21.4116C35.3147 19.8728 36.0347 17.7973 35.9987 15.5786Z" fill="#226E9F"/>
                                </svg>
                            </SvgIcon>
                            :
                            fileType === 'video/mp4' ?
                            <SvgIcon sx={{ fontSize: 42 }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="76" height="56" viewBox="0 0 76 56" fill="none">
                                    <path d="M66.8568 0H9.14323C4.10087 0 0 4.10087 0 9.14195V46.7324C0 51.7735 4.10087 55.8743 9.14323 55.8743H66.8568C71.8991 55.8743 76 51.7735 76 46.7324V9.14195C76 4.10087 71.8991 0 66.8568 0ZM72.9527 9.14195V9.48197H66.3545V3.04732H66.8568C70.2183 3.04732 72.9527 5.78037 72.9527 9.14195ZM18.9523 43.345V12.5293H57.8101V43.345H18.9523ZM53.7646 9.48197V3.04732H60.2585V9.48197H53.7646ZM47.67 9.48197H41.4968V3.04732H47.67V9.48197ZM35.4022 9.48197H28.9083V3.04732H35.4022V9.48197ZM22.8124 9.48197H15.4478V3.04732H22.8124V9.48197ZM15.905 12.5293V43.345H3.04732V12.5293H15.905ZM22.8124 46.3924V52.827H15.4478V46.3924H22.8124ZM28.9083 46.3924H35.4022V52.827H28.9083V46.3924ZM41.4968 46.3924H47.67V52.827H41.4968V46.3924ZM53.7646 46.3924H60.2585V52.827H53.7646V46.3924ZM60.8574 43.345V12.5293H72.9527V43.345H60.8574ZM9.14323 3.04732H9.35317V9.48197H3.04732V9.14195C3.04732 5.78037 5.78166 3.04732 9.14323 3.04732ZM3.04732 46.7324V46.3924H9.35317V52.827H9.14323C5.78166 52.827 3.04732 50.094 3.04732 46.7324ZM66.8568 52.827H66.3545V46.3924H72.9527V46.7324C72.9527 50.094 70.2183 52.827 66.8568 52.827Z" fill="#226E9F"/>
                                    <path d="M47.5965 24.8891L34.1863 17.1459C31.2832 15.4702 28.9082 16.8406 28.9082 20.1945V35.6783C28.9082 39.0322 31.2832 40.4026 34.1863 38.7269L47.5965 30.9837C50.4996 29.3081 50.4996 26.5647 47.5965 24.8891Z" fill="#226E9F"/>
                                </svg>
                            </SvgIcon>
                            :
                            <SvgIcon sx={{ fontSize: 42 }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="92" viewBox="0 0 80 92" fill="none">
                                    <path d="M47.027 0H1.62162C0.726025 0 0 0.735532 0 1.64286V90.3571C0 91.2645 0.726025 92 1.62162 92H33.5135H49.4595H65.4054C66.301 92 67.027 91.2645 67.027 90.3571V72.8333H18.9189V35.5952H67.027V21.3571H48.6486C47.8057 21.3571 47.113 20.7056 47.0344 19.8725L47.027 19.7143V0ZM80 38.881H22.1622V69.5476H80V38.881ZM66.0072 46.2931C66.8095 46.2931 67.575 46.3893 68.3034 46.5818C69.0319 46.7744 69.7938 47.0453 70.5891 47.3947L69.5334 49.9724L68.9425 49.7351C68.3783 49.5171 67.8943 49.3574 67.4905 49.2558C66.9521 49.1203 66.4224 49.0525 65.9016 49.0525C65.2822 49.0525 64.8072 49.1987 64.4763 49.4911C64.1455 49.7834 63.9801 50.1649 63.9801 50.6355C63.9801 50.9279 64.047 51.1828 64.1807 51.4002C64.3145 51.6177 64.5274 51.8281 64.8195 52.0313C65.1116 52.2345 65.8031 52.5999 66.894 53.1276C68.3369 53.8264 69.3257 54.527 69.8606 55.2293C70.3956 55.9317 70.663 56.7927 70.663 57.8123C70.663 59.2242 70.1615 60.3365 69.1586 61.1494C68.1556 61.9622 66.7603 62.3687 64.9725 62.3687C63.3256 62.3687 61.8687 62.0549 60.6018 61.4275V58.3471C61.6434 58.8177 62.525 59.1493 63.2464 59.3418C63.9678 59.5343 64.6277 59.6306 65.2259 59.6306C65.9438 59.6306 66.4946 59.4915 66.8782 59.2134C67.2617 58.9354 67.4535 58.5218 67.4535 57.9727C67.4535 57.6661 67.3691 57.3934 67.2002 57.1545C67.0312 56.9157 66.7831 56.6857 66.4559 56.4647L66.2639 56.3431C65.9703 56.1665 65.5257 55.9312 64.9302 55.6372L64.4552 55.4058C63.5121 54.9566 62.8048 54.5252 62.3332 54.1116C61.8616 53.698 61.4851 53.2167 61.2035 52.6677C60.922 52.1186 60.7812 51.4769 60.7812 50.7425C60.7812 49.3591 61.244 48.2718 62.1695 47.4803C63.0951 46.6888 64.3743 46.2931 66.0072 46.2931ZM36.9109 46.5177L40.2365 52.1436L43.4987 46.5177H47.0249L42.1791 54.272L47.3944 62.1548H43.6571L40.0676 56.24L36.478 62.1548H32.973L38.0933 54.0902L33.3003 46.5177H36.9109ZM52.6098 46.5177V59.4167H58.8704V62.1548H49.337V46.5177H52.6098ZM66.5521 17.3084L50.2703 0.813762V18.0714L66.9787 18.0718C66.908 17.7852 66.7617 17.5207 66.5521 17.3084Z" fill="#226E9F"/>
                                </svg>
                            </SvgIcon>
                        }
                        <Typography fontWeight={400} fontFamily='Inter' sx={{ cursor: 'pointer', color: '#226E9F' }}>{fileType === '' ? "Upload Program's Content" : file?.name}</Typography>
                    </Button>
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
                            setAdded('')
                        }}
                    >
                        Cancel
                    </Button>
                    <form onSubmit={handleUploadFile}>

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
                            type='submit'
                            // onClick={async (e) => {
                            //     if(canSave)
                            //     {
                            //         handleUploadFile(e)
                            //         // await mutateAsync()
                            //         setEdited('')
                            //         setAdded('')
                            //     }
                            //     else
                            //     {
                            //         setError('Please Enter All Details!')
                            //     }
                            // }}
                        >
                            Confirm
                        </Button>
                    </form>
                </Stack>
            </Stack>
        </Box>
    )
}
