// import { auth, db } from '../../../firebase/firebaseConfig'
// import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"
import { Alert, Box, Button, CircularProgress, FormControl, Stack, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
// import { collection, query, where, getDocs } from 'firebase/firestore'
import { LoginContext } from './Login';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StudentLogIn() 
{
    //@ts-expect-error context
    const { setSelectedPage } = useContext(LoginContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const [reset, setReset] = useState('')
    const [loading, setLoading] = useState(false)  // Loader state
    const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
    const navigate = useNavigate();

    const [canSave, setCanSave] = useState(false)

    interface StudentLoginData {
        email: string;
        password: string;
      }
    const logIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setReset('')
        console.log("Base URL",BASE_URL);

        if (canSave) {
            if (email) {
                setLoading(true)  // Start loading

                const data: StudentLoginData = {
                    email: email,
                    password: password,
                  };
                try {
                    const response = await axios.post(`${BASE_URL}/student/login`, data);
                    console.log("response",response);
                    if (response?.status===200 && response?.data?.success) {
                        sessionStorage.clear();
                        sessionStorage.setItem("token", response?.data?.data?.token);
                        sessionStorage.setItem("isLoggedIn", JSON.stringify(true));
                        sessionStorage.setItem("role", response?.data?.data?.role);
                        navigate("/student");
                        setReset(response?.data?.message);
                    }
                    else {
                        setError(response?.data?.message||"Invalid credentials. Please try again.");
                      }
                } catch {
                    setError('Incorrect Password')
                } finally {
                    setLoading(false)  // Stop loading
                    setEmail('')
                    setPassword('')
                }
            } else {
                setError('Please Enter Your Email!')
            }
        } else {
            setError('Please Enter All Details!')
        }
    }

    useEffect(() => {
        setCanSave([email, password].every(Boolean))
    }, [email, password])

    const handleResetPass = async () => {
        if (email) {
            setLoading(true)
            try {
                // await sendPasswordResetEmail(auth, email)
                setReset('Password Reset Email Sent Successfully')
            } catch {
                setError('Failed to send password reset email')
            } finally {
                setLoading(false)
            }
        } else {
            setError('Please Enter Your Email!')
        }
    }

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
                    <Typography onClick={handleResetPass} fontSize={14} fontFamily='Inter' sx={{ color: '#1976d2', ml: 0.5, mt: -2.5, cursor: 'pointer' }}>
                        Forgot Password?
                    </Typography>
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
                        disabled={loading}  // Disable button while loading
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Log In'}
                    </Button>
                    <Typography sx={{ mt: 1 }} fontWeight={600} fontSize={16} fontFamily='Inter' textAlign='center'>
                        Don't have an account? 
                        <span style={{ color: '#FF7E00', textDecoration: 'none', cursor: 'pointer' }} onClick={() => setSelectedPage('StudentSignup')}>
                            Signup
                        </span>
                    </Typography>
                </Box>
            </form>
        </Box>
    )
}




// import { auth, db } from '../../../firebase/firebaseConfig'
// import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"
// import { Alert, Box, Button, CircularProgress, FormControl, Stack, TextField, Typography } from "@mui/material";
// import { useContext, useEffect, useState } from "react";
// import { collection, query, where, getDocs } from 'firebase/firestore'
// import { LoginContext } from './Login';

// export default function StudentLogIn() 
// {
//     //@ts-expect-error context
//     const { setSelectedPage } = useContext(LoginContext)

//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [error, setError] = useState('')
//     const [reset, setReset] = useState('')
//     const [loading, setLoading] = useState(false)  // Loader state

//     const [canSave, setCanSave] = useState(false)

//     const logIn = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault()
//         setError('')
//         setReset('')

//         if (canSave) {
//             if (email) {
//                 setLoading(true)  // Start loading
//                 try {
//                     const userRef = collection(db, 'users')
//                     const queryUser = query(userRef, where('userId', '==', email))
//                     const userDoc = await getDocs(queryUser)

//                     if (userDoc.docs.length && userDoc.docs[0]?.data().role === 'student') {
//                         await signInWithEmailAndPassword(auth, email, password)
//                     } else {
//                         setError('Email Does Not Exist!')
//                     }
//                 } catch {
//                     setError('Incorrect Password')
//                 } finally {
//                     setLoading(false)  // Stop loading
//                     setEmail('')
//                     setPassword('')
//                 }
//             } else {
//                 setError('Please Enter Your Email!')
//             }
//         } else {
//             setError('Please Enter All Details!')
//         }
//     }

//     useEffect(() => {
//         setCanSave([email, password].every(Boolean))
//     }, [email, password])

//     const handleResetPass = async () => {
//         if (email) {
//             setLoading(true)
//             try {
//                 await sendPasswordResetEmail(auth, email)
//                 setReset('Password Reset Email Sent Successfully')
//             } catch {
//                 setError('Failed to send password reset email')
//             } finally {
//                 setLoading(false)
//             }
//         } else {
//             setError('Please Enter Your Email!')
//         }
//     }

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
//                     <Typography onClick={handleResetPass} fontSize={14} fontFamily='Inter' sx={{ color: '#1976d2', ml: 0.5, mt: -2.5, cursor: 'pointer' }}>
//                         Forgot Password?
//                     </Typography>
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
//                         disabled={loading}  // Disable button while loading
//                     >
//                         {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Log In'}
//                     </Button>
//                     <Typography sx={{ mt: 1 }} fontWeight={600} fontSize={16} fontFamily='Inter' textAlign='center'>
//                         Don't have an account? 
//                         <span style={{ color: '#FF7E00', textDecoration: 'none', cursor: 'pointer' }} onClick={() => setSelectedPage('StudentSignup')}>
//                             Signup
//                         </span>
//                     </Typography>
//                 </Box>
//             </form>
//         </Box>
//     )
// }
