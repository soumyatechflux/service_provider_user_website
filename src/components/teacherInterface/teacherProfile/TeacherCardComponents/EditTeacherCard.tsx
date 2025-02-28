// import { Stack, Box, Button, Input, Select, MenuItem } from '@mui/material'
import { Suspense, lazy, memo, useState } from 'react';
const Stack = lazy(() => import('@mui/material/Stack'))
const Box = lazy(() => import('@mui/material/Box'))
const Button = lazy(() => import('@mui/material/Button'))
import axios from "axios";
import { CircularProgress, Input } from '@mui/material';
// type NameType = { firstname: string; lastName: string; };
 
//eslint-disable-next-line
function EditTeacherCard({ 
    title, 
    name, 
    image, 
    university, 
    setTitle, 
    setName, 
    // setIsNameEdited,
    setImage, 
    setUniversity, 
    setEdit 
  }: { 
    title: string; 
    name: string; 
    image: string | File;  // ✅ Accept both string and File
    university: string; 
    setUniversity: React.Dispatch<React.SetStateAction<string>>; 
    setName: React.Dispatch<React.SetStateAction<string>>; 
    // setIsNameEdited: React.Dispatch<React.SetStateAction<boolean>>;  
    setImage: React.Dispatch<React.SetStateAction<string | File>>;  // ✅ Allow File type
    setTitle: React.Dispatch<React.SetStateAction<string>>; 
    setEdit: React.Dispatch<React.SetStateAction<boolean>>; 
  }) {


    // const [editedName, setHasEditedName] = useState("");
    const [loading,setLoading]=useState(false);
    console.log("name",name)

    const handleImageChange = (file: File) => {
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        
        if (!validTypes.includes(file.type)) {
            alert("Invalid image format. Please upload a JPG or PNG file.");
            return;
        }
    
        setImage(file); // Store the file correctly
    };
  const setTeacherData = async () => {
        const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
        
        // Get token from session storage
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("Unauthorized: No token found.");
    
        try {
            const formData = new FormData();
            // formData.append("name", `${name.firstname} ${name.lastName}` || `${name.lastName}`);
            formData.append("name", name);
            formData.append("title", title);
            formData.append("university", university);
    
          // ✅ Ensure 'image' is correctly appended as a File object
        if (image && image instanceof File) {
            formData.append("image", image);
        } 
        // else {
        //     throw new Error("Invalid image format. Please upload a valid file.");
        // }


            const role=sessionStorage.getItem("role")
            let url = '';
            if(role === 'teacher'){
                url=`${BASE_URL}/teacher/auth/profile` ;
            }
            if(role === 'admin'){
                url=`${BASE_URL}/admin/auth/profile`;
            }
                
            setLoading(true)
            const response = await axios.patch( `${url}`,formData,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("EDIT ADMIN PROFILe",response?.data)
            console.log("EDIT ADMIN PROFILe",response?.data?.data?.name)
            // setHasEditedName(response?.data?.data?.name)
            setEdit(false);
    
            return response.data;
        } catch (error) {
            setLoading(false);
            console.error("Error updating teacher data:", error);
            throw error;
        }
        finally{
            setLoading(false);
        }
    };


    
    // if(loading){
    //     return <Loader/>
    // }

    return (
        <Suspense>
        <Box
            width='100%'
            height='100%'
            display='flex'
            alignItems='center'
            gap={4}
        >
            <Box
                position='relative'
                width='250px'
                minWidth='250px'
                height='250px'
                borderRadius='50%'
                overflow='hidden'
                mx={2}
                border='4px solid rgba(0, 0, 0, 0.80)'
                display='flex'
                alignItems='center'
                justifyContent='center'
                sx={{
                    backgroundImage: `url(${image})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'
                }}
            >
                <Box
                    position='absolute'
                    bgcolor='#000'
                    width='100%'
                    height='100%'
                    sx={{
                        opacity: 0.5
                    }}
                >
                    
                </Box>
                <Button
                    //@ts-expect-error ddd
                    component='label'
                    sx={{
                        zIndex: 3,
                        position: 'relative',
                        background: '#FEF4EB',
                        color: '#000',
                        border: '1px solid #000',
                        fontSize: 14,
                        fontWeight: 500,
                        fontFamily: 'Inter',
                        paddingX: 2.5,
                        paddingY: 1,
                        '&:hover': {
                            background: '#FEF4EB',
                            opacity: 1,
                        }
                    }}
                >
                    Edit Photo
                    <input
                        hidden
                        accept="image/*"
                        width='100%'
                        height='100%'
                        type="file"
                        onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                            handleImageChange(e.target.files![0]);
                        }}
                    />
                </Button>
            </Box>
            <Stack
                direction='column'
                gap={8}
                alignItems='center'
            >
                <Stack
                    direction='row'
                    gap={4}
                    alignItems='center'
                    justifyContent='space-between'
                    flexWrap='wrap'
                    mr={4}
                >
                    <Input 
                        value={name} 
                        color='primary' 
                        disableUnderline
                        sx={{
                            border: '1px solid #226E9F',
                            width: '280px',
                            background: '#fff',
                            borderRadius: '5px',
                            paddingX: 1,
                            paddingY: 0.5,
                        }}
                        placeholder='Name'
                        onChange={(e) => {
                            // const [first, ...last] = e.target.value.split(" ");
                            setName(e.target.value);
                            // setIsNameEdited(true); // Mark as edited
                          }} 
                    />
                   

                    <Input 
                        value={title} 
                        color='primary' 
                        disableUnderline
                        sx={{
                            border: '1px solid #226E9F',
                            width: '280px',
                            background: '#fff',
                            borderRadius: '5px',
                            paddingX: 1,
                            paddingY: 0.5,
                        }}
                        placeholder='Title'
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Input 
                        value={university} 
                        color='primary' 
                        disableUnderline
                        sx={{
                            border: '1px solid #226E9F',
                            width: '280px',
                            background: '#fff',
                            borderRadius: '5px',
                            paddingX: 1,
                            paddingY: 0.5,
                        }}
                        placeholder='University'
                        onChange={(e) => setUniversity(e.target.value)}
                    />
                </Stack>
                <Stack
                    direction='row'
                    gap={3.5}
                    alignItems='center'
                    justifyContent='space-evenly'
                >
                    <Button
                        sx={{
                            width: '180px',
                            height: '45px',
                            background: '#fff',
                            color: '#000',
                            fontFamily: 'Inter',
                            fontSize: 14,
                            textTransform: 'none',
                            fontWeight: 600,
                            border: '2px solid #226E9F',
                            '&:hover': {
                                background: '#fff',
                                opacity: 1
                            }
                        }}
                        onClick={() => setEdit(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{
                            width: '180px',
                            height: '45px',
                            background: '#D0EBFC',
                            color: '#000',
                            fontFamily: 'Inter',
                            fontSize: 14,
                            textTransform: 'none',
                            fontWeight: 600,
                            border: '2px solid #226E9F',
                            '&:hover': {
                                background: '#D0EBFC',
                                opacity: 1
                            }
                        }}
                        onClick={() => {
                            
                            setTeacherData();
                        }}
                        
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : " Confirm"}
                       
                    </Button>
                </Stack>
            </Stack>
        </Box>
        </Suspense>
    )
}

const memoizedEditTeacherCard = memo(EditTeacherCard)
export default memoizedEditTeacherCard