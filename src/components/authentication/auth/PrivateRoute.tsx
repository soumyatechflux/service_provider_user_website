// import { ReactNode, useContext, useEffect, useState } from 'react'
// import { AuthContext } from "./AuthProvider"
// import { useLocation, useNavigate } from 'react-router-dom'
// import Login from '../login/Login'
// import { Dialog, CircularProgress } from '@mui/material'
// import { getUserData } from '../../helpers/getUserData'
// import { useQuery } from '@tanstack/react-query'

// //@ts-expect-error children
// export default function PrivateRoute({ children }) 
// {
//     //@ts-expect-error context
//     const { user, userIsSuccess, fetchStatus } = useContext(AuthContext)
//     const [refetchTime, setRefetchTime] = useState(500)
//     const { pathname } = useLocation()

//     const { data: userData, isLoading } = useQuery({
//         queryKey: ['userData'],
//         queryFn: () => getUserData(),
//         enabled: user !== null,
//         refetchInterval: refetchTime
//     })

//     const [page, setPage] = useState<ReactNode>()

//     const navigate = useNavigate()

//     useEffect(() => {
//         if(userIsSuccess)
//         {
//             if(user && userData) {
//                 setRefetchTime(Infinity)
//                 navigate(pathname !== '/login' ? pathname : '/')
//                 setPage(children[userData?.role ?? 0])
//                 console.log( "HEELL",children[userData?.role])
//                 console.log("USERDATA.ROLE",userData?.role)
//             }
//             else 
//             {
//                 setRefetchTime(500)
//                 setPage(<Login />)
//             }
//         }
//     }, [user, userData, navigate, children, pathname, userIsSuccess, fetchStatus])

//     if(isLoading) return (
//         <Dialog open={!userIsSuccess} PaperProps={{ style: { background: 'transparent', backgroundColor: 'transparent', overflow: 'hidden', boxShadow: 'none' } }}>
//             <CircularProgress size='46px' sx={{ color: '#FF7E00' }} />
//         </Dialog>
//     )
    
//     return page ? page : (
//         <Dialog open={!userIsSuccess} PaperProps={{ style: { background: 'transparent', backgroundColor: 'transparent', overflow: 'hidden', boxShadow: 'none' } }}>
//             <CircularProgress size='46px' sx={{ color: '#FF7E00' }} />
//         </Dialog>
//     )
// }








import { ReactNode, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import Login from '../login/Login';
import { Dialog, CircularProgress } from '@mui/material';
import { getUserData } from '../../helpers/getUserData';
import { useQuery } from '@tanstack/react-query';

// @ts-expect-error children
export default function PrivateRoute({ children }) {
        // @ts-expect-error context
    const { user, userIsSuccess } = useContext(AuthContext);
    const [refetchTime, setRefetchTime] = useState(500);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const token=sessionStorage.getItem('token');
    const isLogedIn=sessionStorage.getItem('isLoggedIn');
    
    // const role=sessionStorage.getItem('role');
    const { data: userData, isLoading } = useQuery({
        queryKey: ['userData'],
        queryFn: () => getUserData(),
        enabled: !!token,  
        staleTime: Infinity,
        refetchInterval: refetchTime,
    });

    const [page, setPage] = useState<ReactNode>();


    useEffect(() => {
        if (userIsSuccess) {
            console.log("USERDATA",userData)
            console.log("AUTHENTICATION",isLogedIn && userData)
            if (isLogedIn && userData) {
                setRefetchTime(Infinity);
                navigate(pathname !== '/login' ? pathname : '/');
                console.log("HELLO",userData)
                setPage(children?.[userData?.role] ?? <Login />);
                console.log("CHILDREN",children)
            } else {
                setRefetchTime(500);
                setPage(<Login />);
            }
        }
    }, [user, userData, navigate, children, pathname, userIsSuccess]);
    
    // useEffect(() => {
    //     if (userIsSuccess) {
    //         if (user && userData) {
    //             setRefetchTime(Infinity); // Stop refetching once user data is fetched
    //             navigate(pathname !== '/login' ? pathname : '/');
    //             setPage(children?.[userData?.role] ?? <Login />); // Use fallback if role doesn't match
    //             console.log(children?.[userData?.role] )
    //         } else {
    //             setRefetchTime(500); // Resume refetching if user data is not available
    //             setPage(<Login />);
    //         }
    //     }
    // }, [user, userData, navigate, children, pathname, userIsSuccess]);

    if (isLoading) {
        return (
            <Dialog
                open={!userIsSuccess}
                PaperProps={{
                    style: {
                        background: 'transparent',
                        backgroundColor: 'transparent',
                        overflow: 'hidden',
                        boxShadow: 'none',
                    },
                }}
            >
                <CircularProgress size="46px" sx={{ color: '#FF7E00' }} />
            </Dialog>
        );
    }

    return page ? (
        page
    ) : (
        <Dialog
            open={!userIsSuccess}
            PaperProps={{
                style: {
                    background: 'transparent',
                    backgroundColor: 'transparent',
                    overflow: 'hidden',
                    boxShadow: 'none',
                },
            }}
        >
            <CircularProgress size="46px" sx={{ color: '#FF7E00' }} />
        </Dialog>
    );
}















// import { ReactNode, useContext, useEffect, useState } from 'react';
// import { AuthContext } from "./AuthProvider";
// import { useLocation, useNavigate } from 'react-router-dom';
// import Login from '../login/Login';
// import { Dialog, CircularProgress } from '@mui/material';
// import axios from "axios";
// import { useQuery } from '@tanstack/react-query';

// interface UserProfile {
//   id: string;
//   name: string;
//   role: string;
//   email: string;
// }

// export default function PrivateRoute({ children }: { children: ReactNode }) {
//   //@ts-expect-error context
//   const { user, userIsSuccess, fetchStatus } = useContext(AuthContext);
//   const [refetchTime, setRefetchTime] = useState(500);
//   const { pathname } = useLocation();
//   const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
//   const navigate = useNavigate();

//   const [page, setPage] = useState<ReactNode>();
//   const [loading, setLoading] = useState(false);
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const loginStatus =sessionStorage.getItem("isTeacherLoggedIn");
//   console.log("Private status",loginStatus)
//   const roles =sessionStorage.getItem("role");
//   console.log("Private roles",roles);
//   const token =sessionStorage.getItem("token");
//   console.log("Private TOKEN",token);

  
//   const fetchUserProfile = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${BASE_URL}/admin/auth/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("PROFILE", response?.data);
//       setUserProfile(response.data);


//     } catch (error) {
//       setLoading(false);
//       console.error('Failed to fetch user profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const { data: userData, isLoading } = useQuery({
//     queryKey: ['userData'],
//     enabled: user !== null,
//     refetchInterval: refetchTime,
//   });

//   useEffect(() => {
//     if (loginStatus) {

//       fetchUserProfile();
//     }
//   },[loginStatus]);

//   useEffect(() => {
//     if (userIsSuccess) {
//       if (user && userData && userProfile) {
//         setRefetchTime(Infinity);
//         console.log('Navigating to:', pathname !== '/login' ? pathname : '/');
//         navigate(pathname !== '/login' ? pathname : '/');
//         setPage(userProfile?.role);
//         console.log("HEELL", userProfile?.role);
//       } else {
//         setRefetchTime(500);
//         setPage(<Login />);
//       }
//     }
//   }, [user, userData, userProfile, navigate, children, pathname, userIsSuccess, fetchStatus]);

//   if (isLoading || loading) return (
//     <Dialog open={!userIsSuccess} PaperProps={{ style: { background: 'transparent', backgroundColor: 'transparent', overflow: 'hidden', boxShadow: 'none' } }}>
//       <CircularProgress size='46px' sx={{ color: '#FF7E00' }} />
//     </Dialog>
//   );

//   return page ? page : (
//     <Dialog open={!userIsSuccess} PaperProps={{ style: { background: 'transparent', backgroundColor: 'transparent', overflow: 'hidden', boxShadow: 'none' } }}>
//       <CircularProgress size='46px' sx={{ color: '#FF7E00' }} />
//     </Dialog>
//   );
// }

















