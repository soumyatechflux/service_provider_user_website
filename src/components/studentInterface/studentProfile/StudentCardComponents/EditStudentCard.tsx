// import { Stack, Box, Button, Input, Select, MenuItem } from '@mui/material'
import { Suspense, lazy, memo, useEffect, useState } from 'react';
const Stack = lazy(() => import('@mui/material/Stack'))
const Box = lazy(() => import('@mui/material/Box'))
const Button = lazy(() => import('@mui/material/Button'))
const Input = lazy(() => import('@mui/material/Input'))
const Select = lazy(() => import('@mui/material/Select'))
const MenuItem = lazy(() => import('@mui/material/MenuItem'))
import StudentCardEditProps from '../../../../interfaces/StudentCardEditProps'
// import { Country, City }  from 'country-state-city'
//eslint-disable-next-line
const ExpandMore = lazy(() => import("@mui/icons-material/ExpandMore"))
import {useQuery } from '@tanstack/react-query';
import {Country, City} from 'country-state-city'
// import { AuthContext } from '../../../authentication/auth/AuthProvider';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
// import { setStudentData } from '../../../helpers/setStudentData';

//eslint-disable-next-line
function EditStudentCard(
{ 
name,
major,
city,
country,
image,
setCity,
setCountry,
setImage,
setMajor,
setName,
setEdit }: StudentCardEditProps) 
{
    
    // const { userData } = useContext(AuthContext);
    const [loading,setLoading]=useState(false);
    const [countries, setCountries] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])

    const { data: countriesData, isSuccess } = useQuery({
        queryFn: () => Country.getAllCountries(),
        queryKey: ['countries'],
        refetchOnMount: false
    })

    function getCitiesOfCountry(country: string)
    {
        if(isSuccess)
        {
            const code = countriesData.find(c => c.name.toString() === country)?.isoCode ?? ''
            return City.getCitiesOfCountry(code)?.map(city => city.name)
        }
    }

    const { data: citiesData, isSuccess: CitySuccess,isLoading, isError } = useQuery({
        queryFn: () => getCitiesOfCountry(country),
        queryKey: ['cities'],
        refetchOnMount: false,
        enabled: !!countriesData
    })

    // useEffect(() => {
    //     refetch()
    // }, [country, refetch])

    console.log(isError)
    console.log(isLoading)

    const handleImageChange = (file: File) => {
        const reader = (readFile: File) =>
            new Promise<string>((resolve) => {
                const fileReader = new FileReader();
                fileReader.onload = () => resolve(fileReader.result as string);
                fileReader.readAsDataURL(readFile);
            });

        reader(file).then((result: string) =>
            setImage(result),
        );
    };
    

    useEffect(() => {
        if(isSuccess) setCountries(countriesData.map(country => country.name))
    }, [isSuccess, countriesData])

    useEffect(() => {
        if(isSuccess && CitySuccess)
        {
            setCities(citiesData ?? [''])
        }
    }, [country, isSuccess, countriesData, citiesData, CitySuccess])

    // const { mutate } = useMutation({
    //     onMutate: () => {
    //         setEdit(false)
    //     },
    //     mutationFn: () => setStudentData(userData.id, { name, image, city, country })
    // })
    function base64ToFile(base64: string, filename: string): File {
        const arr = base64.split(",");
        const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
    
        return new File([u8arr], filename, { type: mime });
    }
    
    const setStudentData = async () => {
        const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
        
        // Get token from session storage
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("Unauthorized: No token found.");
    
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("occupation", major);
            formData.append("city", city);
            formData.append("country", country);
            if (typeof image === "string" && image.startsWith("data:image")) {
                const convertedFile = base64ToFile(image, "uploaded-image.png");
                formData.append("image", convertedFile);
            } else if (image instanceof File) {
                formData.append("image", image);
            } 
            
            
            
            // if (image && image instanceof File) {
            //     formData.append("image", image);
            // } 
         
            setLoading(true)
            const response = await axios.patch( `${BASE_URL}/student/auth/profile `,formData,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("EDIT Student PROFILe",response?.data)
            // console.log("EDIT ADMIN PROFILe",response?.data?.data?.name)
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
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Select
                            defaultValue={major}
                            sx={{
                                width: '200px !important',
                                height: '38px !important',
                                boxShadow: '0px 0px 0px 1px rgba(34,110,159,0.39)',
                                borderRadius: '5px !important',
                                outline: 'none !important',
                                boxSizing: 'border-box !important',
                                background: '#fff',
                                paddingX: 1,
                                '&:hover': {
                                    boxShadow: '0px 0px 0px 1px rgba(34,110,159,0.39)',
                                    background: '#fff',
                                }, fontSize: 14, fontWeight: 500, fontFamily: 'Inter', color: '#000', textAlign: 'center',
                                
                            }}
                            IconComponent={() => <ExpandMore sx={{ borderLeft: '1px solid rgba(34,110,159, 0.2)', paddingLeft: 1, height: '100%', position: 'absolute', left: '80%' }} />}
                            variant='standard'
                            disableUnderline
                            //@ts-expect-error ddd
                            onChange={(e) => setMajor(e.target.value)}
                        >
                            <MenuItem value={major}>{major}</MenuItem>
                        </Select>
                        <Select
                            defaultValue={city}
                            sx={{
                                width: '180px !important',
                                height: '38px !important',
                                boxShadow: '0px 0px 0px 1px rgba(34,110,159,0.39)',
                                borderRadius: '5px !important',
                                outline: 'none !important',
                                boxSizing: 'border-box !important',
                                background: '#fff',
                                paddingX: 1,
                                '&:hover': {
                                    boxShadow: '0px 0px 0px 1px rgba(34,110,159,0.39)',
                                    background: '#fff',
                                }, fontSize: 14, fontWeight: 500, fontFamily: 'Inter', color: '#000', textAlign: 'center',
                                
                            }}
                            IconComponent={() => <ExpandMore sx={{ borderLeft: '1px solid rgba(34,110,159, 0.2)', paddingLeft: 1, height: '100%', position: 'absolute', left: '80%' }} />}                            variant='standard'
                            disableUnderline
                            disabled={isLoading}
                            //@ts-expect-error ddd
                            onChange={(e) => setCity(e.target.value)}
                        >
                            { cities.map((city, index) => <MenuItem value={city} key={index}>{city}</MenuItem>) }
                        </Select>
                        <Select
                            defaultValue={country}
                            sx={{
                                width: '180px !important',
                                height: '38px !important',
                                boxShadow: '0px 0px 0px 1px rgba(34,110,159,0.39)',
                                borderRadius: '5px !important',
                                outline: 'none !important',
                                boxSizing: 'border-box !important',
                                background: '#fff',
                                paddingX: 1,
                                '&:hover': {
                                    boxShadow: '0px 0px 0px 1px rgba(34,110,159,0.39)',
                                    background: '#fff',
                                }, fontSize: 14, fontWeight: 500, fontFamily: 'Inter', color: '#000', textAlign: 'center',
                                
                            }}
                            IconComponent={() => <ExpandMore sx={{ borderLeft: '1px solid rgba(34,110,159, 0.2)', paddingLeft: 1, height: '100%', position: 'absolute', left: '80%' }} />}                            variant='standard'
                            disableUnderline
                            onChange={(e) => {
                                //@ts-expect-error ddd
                                setCountry(e.target.value)
                            }}
                        >
                            { countries.map(country => <MenuItem value={country} key={country}>{country}</MenuItem>) }
                        </Select>
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
                            onClick={() => setStudentData()}
                        >
                             {loading ? <CircularProgress size={24} color="inherit" /> : " Confirm"}
                        </Button>
                    </Stack>
            </Stack>
        </Box>
        </Suspense>
    )
}

const memoizedEditStudentCard = memo(EditStudentCard)
export default memoizedEditStudentCard










// // import { Stack, Box, Button, Input, Select, MenuItem } from '@mui/material'
// import { Suspense, lazy, memo, useEffect, useState, useContext } from 'react';
// const Stack = lazy(() => import('@mui/material/Stack'))
// const Box = lazy(() => import('@mui/material/Box'))
// const Button = lazy(() => import('@mui/material/Button'))
// const Input = lazy(() => import('@mui/material/Input'))
// const Select = lazy(() => import('@mui/material/Select'))
// const MenuItem = lazy(() => import('@mui/material/MenuItem'))
// import StudentCardEditProps from '../../../../interfaces/StudentCardEditProps'
// // import { Country, City }  from 'country-state-city'
// //eslint-disable-next-line
// const ExpandMore = lazy(() => import("@mui/icons-material/ExpandMore"))
// import { useMutation, useQuery } from '@tanstack/react-query';
// import {Country, City} from 'country-state-city'
// import { AuthContext } from '../../../authentication/auth/AuthProvider';
// // import { setStudentData } from '../../../helpers/setStudentData';

// //eslint-disable-next-line
// function EditStudentCard(
// { 
// name,
// major,
// city,
// country,
// image,
// setCity,
// setCountry,
// setImage,
// setMajor,
// setName,
// setEdit }: StudentCardEditProps) 
// {
//     //@ts-expect-error context
//     const { userData } = useContext(AuthContext)

//     const [countries, setCountries] = useState<string[]>([])
//     const [cities, setCities] = useState<string[]>([])

//     const { data: countriesData, isSuccess } = useQuery({
//         queryFn: () => Country.getAllCountries(),
//         queryKey: ['countries'],
//         refetchOnMount: false
//     })

//     function getCitiesOfCountry(country: string)
//     {
//         if(isSuccess)
//         {
//             const code = countriesData.find(c => c.name.toString() === country)?.isoCode ?? ''
//             return City.getCitiesOfCountry(code)?.map(city => city.name)
//         }
//     }

//     const { data: citiesData, isSuccess: CitySuccess, refetch, isLoading, isError } = useQuery({
//         queryFn: () => getCitiesOfCountry(country),
//         queryKey: ['cities'],
//         refetchOnMount: false,
//         enabled: !!countriesData
//     })

//     useEffect(() => {
//         refetch()
//     }, [country, refetch])

//     console.log(isError)
//     console.log(isLoading)

//     const handleImageChange = (file: File) => {
//         const reader = (readFile: File) =>
//             new Promise<string>((resolve) => {
//                 const fileReader = new FileReader();
//                 fileReader.onload = () => resolve(fileReader.result as string);
//                 fileReader.readAsDataURL(readFile);
//             });

//         reader(file).then((result: string) =>
//             setImage(result),
//         );
//     };
    

//     useEffect(() => {
//         if(isSuccess) setCountries(countriesData.map(country => country.name))
//     }, [isSuccess, countriesData])

//     useEffect(() => {
//         if(isSuccess && CitySuccess)
//         {
//             setCities(citiesData ?? [''])
//         }
//     }, [country, isSuccess, countriesData, citiesData, CitySuccess])

//     const { mutate } = useMutation({
//         onMutate: () => {
//             setEdit(false)
//         },
//         mutationFn: () => setStudentData(userData.id, { name, image, city, country })
//     })

//     return (
//         <Suspense>
//         <Box
//             width='100%'
//             height='100%'
//             display='flex'
//             alignItems='center'
//             gap={4}
//         >
//             <Box
//                 position='relative'
//                 width='250px'
//                 minWidth='250px'
//                 height='250px'
//                 borderRadius='50%'
//                 overflow='hidden'
//                 mx={2}
//                 border='4px solid rgba(0, 0, 0, 0.80)'
//                 display='flex'
//                 alignItems='center'
//                 justifyContent='center'
//                 sx={{
//                     backgroundImage: `url(${image})`,
//                     backgroundRepeat: 'no-repeat',
//                     backgroundSize: 'cover'
//                 }}
//             >
//                 <Box
//                     position='absolute'
//                     bgcolor='#000'
//                     width='100%'
//                     height='100%'
//                     sx={{
//                         opacity: 0.5
//                     }}
//                 >
                    
//                 </Box>
//                 <Button
//                     //@ts-expect-error ddd
//                     component='label'
//                     sx={{
//                         zIndex: 3,
//                         position: 'relative',
//                         background: '#FEF4EB',
//                         color: '#000',
//                         border: '1px solid #000',
//                         fontSize: 14,
//                         fontWeight: 500,
//                         fontFamily: 'Inter',
//                         paddingX: 2.5,
//                         paddingY: 1,
//                         '&:hover': {
//                             background: '#FEF4EB',
//                             opacity: 1,
//                         }
//                     }}
//                 >
//                     Edit Photo
//                     <input
//                         hidden
//                         accept="image/*"
//                         width='100%'
//                         height='100%'
//                         type="file"
//                         onChange={(
//                             e: React.ChangeEvent<HTMLInputElement>,
//                         ) => {
//                             handleImageChange(e.target.files![0]);
//                         }}
//                     />
//                 </Button>
//             </Box>
//             <Stack
//                 direction='column'
//                 gap={8}
//                 alignItems='center'
//             >
//                     <Stack
//                         direction='row'
//                         gap={4}
//                         alignItems='center'
//                         justifyContent='space-between'
//                         flexWrap='wrap'
//                         mr={4}
//                     >
//                         <Input 
//                             value={name} 
//                             color='primary' 
//                             disableUnderline
//                             sx={{
//                                 border: '1px solid #226E9F',
//                                 width: '280px',
//                                 background: '#fff',
//                                 borderRadius: '5px',
//                                 paddingX: 1,
//                                 paddingY: 0.5,
//                             }}
//                             onChange={(e) => setName(e.target.value)}
//                         />
//                         <Select
//                             defaultValue={major}
//                             sx={{
//                                 width: '200px !important',
//                                 height: '38px !important',
//                                 boxShadow: '0px 0px 0px 1px rgba(34,110,159,0.39)',
//                                 borderRadius: '5px !important',
//                                 outline: 'none !important',
//                                 boxSizing: 'border-box !important',
//                                 background: '#fff',
//                                 paddingX: 1,
//                                 '&:hover': {
//                                     boxShadow: '0px 0px 0px 1px rgba(34,110,159,0.39)',
//                                     background: '#fff',
//                                 }, fontSize: 14, fontWeight: 500, fontFamily: 'Inter', color: '#000', textAlign: 'center',
                                
//                             }}
//                             IconComponent={() => <ExpandMore sx={{ borderLeft: '1px solid rgba(34,110,159, 0.2)', paddingLeft: 1, height: '100%', position: 'absolute', left: '80%' }} />}
//                             variant='standard'
//                             disableUnderline
//                             //@ts-expect-error ddd
//                             onChange={(e) => setMajor(e.target.value)}
//                         >
//                             <MenuItem value={major}>{major}</MenuItem>
//                         </Select>
//                         <Select
//                             defaultValue={city}
//                             sx={{
//                                 width: '180px !important',
//                                 height: '38px !important',
//                                 boxShadow: '0px 0px 0px 1px rgba(34,110,159,0.39)',
//                                 borderRadius: '5px !important',
//                                 outline: 'none !important',
//                                 boxSizing: 'border-box !important',
//                                 background: '#fff',
//                                 paddingX: 1,
//                                 '&:hover': {
//                                     boxShadow: '0px 0px 0px 1px rgba(34,110,159,0.39)',
//                                     background: '#fff',
//                                 }, fontSize: 14, fontWeight: 500, fontFamily: 'Inter', color: '#000', textAlign: 'center',
                                
//                             }}
//                             IconComponent={() => <ExpandMore sx={{ borderLeft: '1px solid rgba(34,110,159, 0.2)', paddingLeft: 1, height: '100%', position: 'absolute', left: '80%' }} />}                            variant='standard'
//                             disableUnderline
//                             disabled={isLoading}
//                             //@ts-expect-error ddd
//                             onChange={(e) => setCity(e.target.value)}
//                         >
//                             { cities.map((city, index) => <MenuItem value={city} key={index}>{city}</MenuItem>) }
//                         </Select>
//                         <Select
//                             defaultValue={country}
//                             sx={{
//                                 width: '180px !important',
//                                 height: '38px !important',
//                                 boxShadow: '0px 0px 0px 1px rgba(34,110,159,0.39)',
//                                 borderRadius: '5px !important',
//                                 outline: 'none !important',
//                                 boxSizing: 'border-box !important',
//                                 background: '#fff',
//                                 paddingX: 1,
//                                 '&:hover': {
//                                     boxShadow: '0px 0px 0px 1px rgba(34,110,159,0.39)',
//                                     background: '#fff',
//                                 }, fontSize: 14, fontWeight: 500, fontFamily: 'Inter', color: '#000', textAlign: 'center',
                                
//                             }}
//                             IconComponent={() => <ExpandMore sx={{ borderLeft: '1px solid rgba(34,110,159, 0.2)', paddingLeft: 1, height: '100%', position: 'absolute', left: '80%' }} />}                            variant='standard'
//                             disableUnderline
//                             onChange={(e) => {
//                                 //@ts-expect-error ddd
//                                 setCountry(e.target.value)
//                             }}
//                         >
//                             { countries.map(country => <MenuItem value={country} key={country}>{country}</MenuItem>) }
//                         </Select>
//                     </Stack>
//                     <Stack
//                         direction='row'
//                         gap={3.5}
//                         alignItems='center'
//                         justifyContent='space-evenly'
//                     >
//                         <Button
//                             sx={{
//                                 width: '180px',
//                                 height: '45px',
//                                 background: '#fff',
//                                 color: '#000',
//                                 fontFamily: 'Inter',
//                                 fontSize: 14,
//                                 textTransform: 'none',
//                                 fontWeight: 600,
//                                 border: '2px solid #226E9F',
//                                 '&:hover': {
//                                     background: '#fff',
//                                     opacity: 1
//                                 }
//                             }}
//                             onClick={() => setEdit(false)}
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             sx={{
//                                 width: '180px',
//                                 height: '45px',
//                                 background: '#D0EBFC',
//                                 color: '#000',
//                                 fontFamily: 'Inter',
//                                 fontSize: 14,
//                                 textTransform: 'none',
//                                 fontWeight: 600,
//                                 border: '2px solid #226E9F',
//                                 '&:hover': {
//                                     background: '#D0EBFC',
//                                     opacity: 1
//                                 }
//                             }}
//                             onClick={() => mutate()}
//                         >
//                             Confirm
//                         </Button>
//                     </Stack>
//             </Stack>
//         </Box>
//         </Suspense>
//     )
// }

// const memoizedEditStudentCard = memo(EditStudentCard)
// export default memoizedEditStudentCard