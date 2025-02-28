import { useQuery } from "@tanstack/react-query"
// import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
// import { db } from "../../../../firebase/firebaseConfig"
import ProgramProps from "../../../../interfaces/ProgramProps"
import {useState } from "react"
import { Alert, CircularProgress, Dialog } from "@mui/material"
// import { AuthContext } from "../../../authentication/auth/AuthProvider"
import axios from "axios"

export default function DeletePrograms() 
{
    // const queryClient = useQueryClient()

    // //@ts-expect-error context
    // const { userData } = useContext(AuthContext)

    const [loading, setLoading] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [error,setError]=useState("");
    const [reset,setReset]=useState("")

    const [deletedProgram, setDeletedProgram] = useState<ProgramProps>()
    const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL; 
    const token =sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");  
    // const { data: programs } = useQuery({
    //     queryKey: ['allPrograms'],
    //     queryFn: async () => {
    //         const programCollection = collection(db, 'programs')
    //         const programDocs = await getDocs(programCollection)
    //         return programDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProgramProps[]
    //     }
    // })

    const { data: programs = [],refetch } = useQuery({
        queryKey: ["adminPrograms"],
        queryFn: async () => {
            const response = await axios.get(`${BASE_URL}/${role}/programs`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass token in headers
                    "Content-Type": "application/json"
                }
            });
            return response?.data?.data || []; // Ensure it returns an array
        }
    });

    const handleDeleteProgram = async (program: ProgramProps) => {
        setLoading(true)
        setDeleteOpen(false)

       try{
                console.log();
                const response = await axios.delete(`${BASE_URL}/${role}/programs/${program?._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass token in headers
                        "Content-Type": "application/json"
                    }
                });
                console.log("RESPONSE DELETE",response?.data)
                if (response?.status === 200 && response?.data?.success) {
                    setError("");
                    setReset(response?.data?.message);
        
                    // Refresh data after 5 seconds
                    setTimeout(() => {
                        refetch(); // Call refetch to get updated data
                    }, 5000);
                } else {
                    setReset("");
                    setError(response?.data?.message);
                }
        }catch (error) {
        console.error("Error deleting program:", error);
    } finally {
        setLoading(false);
    }
        
        setLoading(false)
    }

    return (
        <>
            <div className='flex flex-col py-12 gap-12'>
                <h1 className='text-xl text-black font-semibold'>Showing ({programs?.length}) programs</h1>
                 {error && !reset && <Alert severity="error">{error}</Alert>}
                {reset && !error && <Alert severity="success">{reset}</Alert>}
                <div className="flex gap-4 w-full flex-col">
                {programs?.map((program: ProgramProps) => (
                        <div key={program.id} className='flex rounded-[12px] p-8 items-center bg-[#FEF4EB] justify-between gap-4 w-full'>
                            <p className='text-lg text-black font-semibold'>{program?.name}</p>
                            <button className='bg-red-500 text-white px-4 py-2 rounded-md' onClick={() => {
                                setDeleteOpen(true)
                                setDeletedProgram(program)
                            }}>Delete</button>
                        </div>
                    ))}

                </div>
            </div>
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <div className='flex flex-col gap-12 p-8'>
                    <h1 className='text-xl text-black text-center font-semibold'>Are you sure you want to delete this program?</h1>
                    <div className='flex gap-4 w-full items-center justify-center'>
                        <button className='bg-white text-black border border-black px-4 py-2 rounded-md' onClick={() => {
                            setDeleteOpen(false)
                            setDeletedProgram(undefined)
                        }}>Cancel</button>
                        <button className='bg-red-500 text-white px-4 py-2 rounded-md' onClick={() => handleDeleteProgram(deletedProgram!)}>Delete</button>
                    </div>
                </div>
            </Dialog>
            <Dialog open={loading} PaperProps={{ style: { background: 'transparent', backgroundColor: 'transparent', overflow: 'hidden', boxShadow: 'none' } }}>
                <CircularProgress size='46px' sx={{ color: '#FF7E00' }} />
            </Dialog>
        </>
    )
}