import FormControl from "@mui/material/FormControl";
import { Alert, Box, Button, Stack, TextField, Typography, CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./Login";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TeacherLogIn() {
    //@ts-expect-error context
    const { setSelectedPage } = useContext(LoginContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reset, setReset] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loader state
    const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
    const navigate=useNavigate()

    interface InstructorLoginData {
        email: string;
        password: string;
    }

    const logIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data: InstructorLoginData = {
            email: email,
            password: password,
        };
        
        setLoading(true); // Start loading

        try {
            const response = await axios.post(`${BASE_URL}/admin/auth/login`, data);
            if (response?.status && response?.data?.success) {
                sessionStorage.clear();
                sessionStorage.setItem("token", response?.data?.data?.token);
                sessionStorage.setItem("isLoggedIn", JSON.stringify(true));
                sessionStorage.setItem("role", response?.data?.data?.role);
                setError("");
                setReset(response?.data?.message || "Teacher Successfully Logged In!!");
                navigate("/")

                // const role = sessionStorage.getItem('role'); // Ensure role exists
                // const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
                // const token=sessionStorage.getItem('token')

                // try {
                //     let endpoint = '';
            
                //     if (role === 'instructor') {
                //         endpoint = `${BASE_URL}/admin/auth/profile`;
                //     } else if (role === 'admin') {
                //         endpoint = `${BASE_URL}/admin/auth/profile`;
                //     } else if (role === 'student') {
                //         endpoint = `${BASE_URL}/students/profile`;
                //     } else {
                //         throw new Error('Invalid role');
                //     }
            
                //     const response = await axios.get(endpoint, {
                //         headers: {
                //             'Authorization': `Bearer ${token}`,
                //             'Content-Type': 'application/json', // Adjust content type if needed
                //         }
                //     });
                //     const userData = response.data;
            
                //     console.log('API Response:', userData); // Log the response to check
                    
                //     if (!userData) {
                //         throw new Error('No data returned from API');
                //     }
            
                //     return userData;
                // } catch (error) {
                //     console.error('Error fetching user data:', error);
                //     return null;
                // }
                
            }
            else{
                setReset("")
                setError(response?.data?.message||"")
            }
            console.log("Teacher Login", response);
        } catch {
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };


    

    const handleResetPass = async () => {
        if (email) {
            // await sendPasswordResetEmail(auth, email)
            setReset('Password Reset Email Sent Successfully');
        } else {
            setError('Please Enter Your Email!');
        }
    };

    useEffect(() => {
        // You can add other side effects here if needed
    }, [password]);

    return (
        <Box display='flex' flexDirection='column' flex={1}>
            <Stack flex={1} mb={4} textAlign='center'>
                <Typography fontSize={20} fontFamily='Inter' fontWeight={700}>Log In</Typography>
            </Stack>
            <form
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '30px',
                    flex: 1
                }}
                onSubmit={logIn}
            >
                {error && !reset && <Alert severity="error">{error}</Alert>}
                {reset && !error && <Alert severity="success">{reset}</Alert>}

                <FormControl sx={{ flex: 1 }}>
                    <TextField 
                        fullWidth
                        color="info"
                        variant="outlined"
                        placeholder="Email"
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        inputProps={{
                            style: {
                                textAlign: 'left',
                                textIndent: '80px',
                                fontSize: 18,
                                borderRadius: '5px'
                            }
                        }}
                    />
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
                    <TextField 
                        fullWidth
                        required
                        color="info"
                        variant="outlined"
                        placeholder="Password"
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        inputProps={{
                            style: {
                                textAlign: 'left',
                                textIndent: '80px',
                                fontSize: 18,
                                borderRadius: '5px'
                            }
                        }}
                    />
                </FormControl>
                <FormControl>
                    <Typography onClick={handleResetPass} fontSize={14} fontFamily='Inter' sx={{ color: '#1976d2', ml: 0.5, mt: -2.5, cursor: 'pointer' }}>Forgot Password?</Typography>
                </FormControl>

                <Box flex={1} display='flex' flexDirection='column'>
                    <Button
                        sx={{
                            flex: 1,
                            background: '#226E9F',
                            color: '#fff',
                            fontFamily: 'Inter',
                            fontSize: 18,
                            textTransform: 'none',
                            fontWeight: 500,
                            border: '1px solid #226E9F',
                            borderRadius: '6px',
                            '&:hover': {
                                background: '#226E9F',
                                opacity: 1
                            },
                            paddingY: 1.5
                        }}
                        type="submit"
                        disabled={loading} // Disable the button while loading
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Log In"}
                    </Button>

                    <Typography sx={{ mt: 1 }} fontWeight={600} fontSize={16} fontFamily='Inter' textAlign='center'>
                        Don't have an account? <span style={{ color: '#FF7E00', textDecoration: 'none', cursor: 'pointer' }} onClick={() => { setSelectedPage('TeacherSignup') }}>Signup</span>
                    </Typography>
                </Box>
            </form>
        </Box>
    );
}

// import FormControl from "@mui/material/FormControl";
// import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
// import { useContext, useEffect, useState } from "react";
// import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "../../../firebase/firebaseConfig";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { LoginContext } from "./Login";

// export default function TeacherLogIn() {
//     //@ts-expect-error context
//     const { setSelectedPage } = useContext(LoginContext);

//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [reset, setReset] = useState('');
//     const [loading, setLoading] = useState(false);  // Loader state
//     const [error, setError] = useState('');
//     const [canSave, setCanSave] = useState(false);

//     const logIn = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (canSave) {
//             setLoading(true);
//             setError('');

//             try {
//                 if (email) {
//                     const userRef = collection(db, 'users');
//                     const queryUser = query(userRef, where('userId', '==', email));
//                     const userDoc = await getDocs(queryUser);

//                     if (userDoc.docs.length && userDoc.docs[0]?.data().role === 'teacher') {
//                         await signInWithEmailAndPassword(auth, email, password);
//                         setEmail('');
//                         setPassword('');
//                     } else {
//                         setError('Email Does Not Exist!');
//                     }
//                 } else {
//                     setError('Please Enter Email or Number!');
//                 }
//             } catch (error) {
//                 setError('Incorrect Password');
//             } finally {
//                 setLoading(false);
//             }
//         } else {
//             setError('Please Enter All Details!');
//         }
//     };

//     const handleResetPass = async () => {
//         if (email) {
//             setLoading(true);
//             setError('');

//             try {
//                 await sendPasswordResetEmail(auth, email);
//                 setReset('Password Reset Email Sent Successfully');
//             } catch (error) {
//                 setError('Failed to send password reset email');
//             } finally {
//                 setLoading(false);
//             }
//         } else {
//             setError('Please Enter Your Email!');
//         }
//     };

//     useEffect(() => {
//         setCanSave([password].every(Boolean));
//     }, [password]);

//     return (
//         <Box display='flex' flexDirection='column' flex={1}>
//             <Stack flex={1} mb={4} textAlign='center'>
//                 <Typography fontSize={20} fontFamily='Inter' fontWeight={700}>Log In</Typography>
//             </Stack>
//             <form
//                 style={{
//                     width: '100%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: '30px',
//                     flex: 1
//                 }}
//                 onSubmit={logIn}
//             >
//                 {error && !reset && <Alert severity="error">{error}</Alert>}
//                 {reset && !error && <Alert severity="success">{reset}</Alert>}
//                 <FormControl sx={{ flex: 1 }}>
//                     <TextField 
//                         fullWidth
//                         color="info"
//                         variant="outlined"
//                         placeholder="Email"
//                         type='email'
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         inputProps={{
//                             style: {
//                                 textAlign: 'left',
//                                 textIndent: '80px',
//                                 fontSize: 18,
//                                 borderRadius: '5px'
//                             }
//                         }}
//                     />
//                 </FormControl>
//                 <FormControl sx={{ flex: 1 }}>
//                     <TextField 
//                         fullWidth
//                         required
//                         color="info"
//                         variant="outlined"
//                         placeholder="Password"
//                         type='password'
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         inputProps={{
//                             style: {
//                                 textAlign: 'left',
//                                 textIndent: '80px',
//                                 fontSize: 18,
//                                 borderRadius: '5px'
//                             }
//                         }}
//                     />
//                 </FormControl>
//                 <FormControl>
//                     <Typography onClick={handleResetPass} fontSize={14} fontFamily='Inter' sx={{ color: '#1976d2', ml: 0.5, mt: -2.5, cursor: 'pointer' }}>Forgot Password?</Typography>
//                 </FormControl>
//                 <Box flex={1} display='flex' flexDirection='column'>
//                     <Button
//                         sx={{
//                             flex: 1,
//                             background: '#226E9F',
//                             color: '#fff',
//                             fontFamily: 'Inter',
//                             fontSize: 18,
//                             textTransform: 'none',
//                             fontWeight: 500,
//                             border: '1px solid #226E9F',
//                             borderRadius: '6px',
//                             '&:hover': {
//                                 background: '#226E9F',
//                                 opacity: 1
//                             },
//                             paddingY: 1.5
//                         }}
//                         type="submit"
//                         disabled={loading}
//                     >
//                         {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Log In"}
//                     </Button>
//                     <Typography sx={{ mt: 1 }} fontWeight={600} fontSize={16} fontFamily='Inter' textAlign='center'>
//                         Don't have an account?{" "}
//                         <span style={{ color: '#FF7E00', textDecoration: 'none', cursor: 'pointer' }} onClick={() => { setSelectedPage('TeacherSignup') }}>
//                             Signup
//                         </span>
//                     </Typography>
//                 </Box>
//             </form>
//         </Box>
//     );
// }
