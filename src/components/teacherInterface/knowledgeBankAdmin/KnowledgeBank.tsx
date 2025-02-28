import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Input, Slide, Stack, SvgIcon, Typography } from "@mui/material";
import { useQuery} from "@tanstack/react-query";
import { forwardRef, useContext, useState } from "react";
import { getKnowledgeBank } from "../../helpers/getKnowledgeBank";
import KnowledgeBankContent from "./KnowledgeBankContent";
// import { setKnowledgeBankMajor } from "../../helpers/setKnowledgeBankMajor";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { TransitionProps } from '@mui/material/transitions';
// import { setEditKnowledgeBankMajor } from "../../helpers/setEditKnowledgeBankMajor";
import { AuthContext } from "../../authentication/auth/AuthProvider";
import Loader from "../../Loader";
import axios from "axios";

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function KnowledgeBank() {
    // const queryClient = useQueryClient()

    //@ts-expect-error context
    const { userData } = useContext(AuthContext)
    // const isAdmin = userData.email === import.meta.env.VITE_ADMIN_EMAIL
    console.log("USERDATA EMAIL",userData.email)

    const [error,setError] =useState("");
    const [reset,setReset] =useState("")
    const [selectedMajor, setSelectedMajor] = useState(null)
    // const [selectedMajorId,setSelectedMajorId]=useState("");
    const [add, setAdd] = useState(false)
    const [majorAdded, setMajorAdded] = useState('')
    const [open, setOpen] = useState(true)
    const [edit, setEdit] = useState('')
    const [edited, setEdited] = useState('')
    const [deleted, setDeleted] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const role = sessionStorage.getItem('role'); 
    const token=sessionStorage.getItem('token')
    const BASE_URL = import.meta.env.VITE_APP_ENGME_LMS_PORTAL_BASE_API_URL;
    const { data: knowledgeBankMajors,isLoading,refetch } = useQuery({
        queryKey: ['knowledgeBankMajors'],
        queryFn: () => getKnowledgeBank()
    })
    console.log("K.Name",knowledgeBankMajors?.knowledge_bank_name)

    // const { mutate } = useMutation({
    //     onMutate: () => {
    //         setLoading(true)
    //     },
    //     onSettled: () => {
    //         setMajorAdded('')
    //         setLoading(false)
    //         queryClient.invalidateQueries({ queryKey: ['knowledgeBankMajors'] })
    //     },
    //     mutationFn: () => setKnowledgeBankMajor(majorAdded, userData.id)
    // })
    const addMajor = async (): Promise<void> => {
        const knowledgeBankData = {
          knowledge_bank_name: majorAdded,
        };
      
        try {
            setLoading(true)
          const response = await axios.post( `${BASE_URL}/${role}/knowledge_bank/add`,  knowledgeBankData, 
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Adding token here
              },
            }
          );
      
          console.log("Added major:", response.data);
          if(response?.status===200 && response?.data?.success){
            setError("");
            setReset(response?.data?.message);
            setMajorAdded('');
            setAdd(false);
            refetch();
          // Clear success message after 5 seconds
          setTimeout(() => setReset(""), 5000);
        } else {
            setReset("");
            setError(response?.data?.message);

            // Clear error message after 5 seconds
            setTimeout(() => setError(""), 5000);
        }
        } catch (error) {
            setLoading(false)
          console.error("Error adding major:", error);
        }
        finally{
            setLoading(false)

        }
      };
      
    // const { mutate: mutateEdit } = useMutation({
    //     onMutate: () => {
    //         setLoading(true)
    //     },
    //     onSettled: () => {
    //         setEdit('')
    //         setEdited('')
    //         setLoading(false)
    //         queryClient.invalidateQueries({ queryKey: ['knowledgeBankMajors'] })
    //     },
    //     mutationFn: () => setEditKnowledgeBankMajor(edited, edit)
    // })

     //@ts-expect-error major
    const editMajor = async (id): Promise<void> => {
         console.log("major ID EDIT",id)
        const knowledgeBankData = {
          knowledge_bank_name: edited,
        };
       
      
        try {
            setLoading(true)

          const response = await axios.patch( `${BASE_URL}/${role}/knowledge_bank/${id}`,  knowledgeBankData, 
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Adding token here
              },
            }
          );
      
          console.log("Added major:", response.data);
          if(response?.status===200 && response?.data?.success){
            setError("");
            setReset(response?.data?.message);
            setEdited("");
             //@ts-expect-error major
            setEdit(null); // Remove input after successful edit
            refetch();
            // Clear success message after 5 seconds
            setTimeout(() => setReset(""), 5000);
          } else {
              setReset("");
              setError(response?.data?.message);
  
              // Clear error message after 5 seconds
              setTimeout(() => setError(""), 5000);
          }
        } catch (error) {
            setLoading(false)
          console.error("Error adding major:", error);
        }
        finally{
            setLoading(false)

        }
      };

    // const { mutate: mutateDelete } = useMutation({
    //     onMutate: () => {
    //         const previousData = queryClient.getQueryData(['knowledgeBankMajors'])

    //         queryClient.setQueryData(['knowledgeBankMajors'], (oldData: unknown) => {
    //             //@ts-expect-error oldData
    //             return (oldData && oldData?.length > 0) ? oldData.filter((major: unknown) => major.id !== deleted) : []
    //         })

    //         return () => queryClient.setQueryData(['knowledgeBankMajors'], previousData)
    //     },
    //     onSettled: () => {
    //         setDeleted('')
    //         queryClient.invalidateQueries({ queryKey: ['knowledgeBankMajors'] })
    //     },
    //     mutationFn: () => setEditKnowledgeBankMajor('', deleted, true)
    // })
    
     //@ts-expect-error major
     
    const deleteMajor = async (id) => {
    console.log("Deleting major ID:", id);

    try {
        setLoading(true);

        const response = await axios.delete(`${BASE_URL}/${role}/knowledge_bank/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Deleted major:", response.data);

        if (response?.status === 200 && response?.data?.success) {
            setError("");
            setReset(response?.data?.message);
            setEdited("");

            // Refetch the updated data
            refetch();

            // Clear success message after 5 seconds
            setTimeout(() => setReset(""), 5000);
        } else {
            setReset("");
            setError(response?.data?.message);

            // Clear error message after 5 seconds
            setTimeout(() => setError(""), 5000);
        }
    } catch (error) {
        console.error("Error deleting major:", error);
        setError("An error occurred while deleting.");
        setTimeout(() => setError(""), 5000);
    } finally {
        setLoading(false);
    }
};

    
     //@ts-expect-error major
    const displayedMajors = knowledgeBankMajors?.map(major => (
        <Box
            px={4}
            my={3.5}
            py={2}
            width='100%'
            // bgcolor={selectedMajor?.id === major?.id ? '#fff' : ''}

            bgcolor={(() => {
                 //@ts-expect-error major
                console.log("selectedMajor?.id:", selectedMajor?._id);
                
                console.log("major?.id:", major?._id);
                //@ts-expect-error major
                return selectedMajor?._id === major?._id ? '#fff' : '';
            })()}
            
            onClick={() => setSelectedMajor(major)}
            sx={{
                cursor: 'pointer'
            }}
            textAlign='center'
            key={major?._id}
        >
         <Stack
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                px={4}
            >
                {
                    edit !== major._id ?
                        <Typography alignSelf='center' noWrap fontSize={18} fontFamily='Inter' fontWeight={600}>{major?.knowledge_bank_name}</Typography>
                        :
                        <Stack
                            direction='row'
                            gap={0.5}
                            alignItems='center'
                            justifyContent='center'
                        >
                            <Input
                                value={edited}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => setEdited(e.target.value)}
                            />
                            <CheckIcon
                                onClick={(e) => {
                                    e.stopPropagation()
                                    // mutateEdit()
                                    editMajor(major._id)
                                }}
                                sx={{ fontSize: 20, color: '#9ca3af', p: 0.5, ':hover': { boxShadow: 'inset 0px 0px 12px 0px rgba(0, 0, 0, 0.1)', borderRadius: '9999px' } }} />
                        </Stack>
                }
                <Stack
                    direction='column'
                    gap={0.5}
                >

                    <EditIcon
                        onClick={(e) => {
                            e.stopPropagation()
                            console.log("Major Id",major._id)
                            setEdit(major._id)
                            setEdited(major.knowledge_bank_name)
                        }}
                        sx={{ fontSize: 20, color: '#9ca3af', p: 0.5, ':hover': { boxShadow: 'inset 0px 0px 12px 0px rgba(0, 0, 0, 0.1)', borderRadius: '9999px' } }}
                    />
                    <DeleteForeverIcon
                        onClick={(e) => {
                            e.stopPropagation()
                            setDialogOpen(true)
                            setDeleted(major._id)
                            setSelectedMajor(major)
                        }}
                        sx={{ fontSize: 20, color: '#9ca3af', p: 0.5, ':hover': { boxShadow: 'inset 0px 0px 12px 0px rgba(0, 0, 0, 0.1)', borderRadius: '9999px' } }} />

                </Stack>
            </Stack>
        </Box>
    ))

    const displayedContent = selectedMajor ?
       //@ts-expect-error major
       <KnowledgeBankContent {...selectedMajor}  />  
        :
        <></>

    const handleClose = () => {
        setDialogOpen(false)
    }

    if(isLoading){
        return <Loader/>
    }

    return (
        <Box
            width='100%'
            display='flex'
            flexDirection='row'
            zIndex={1}
            minHeight='77.8vh'
        >
            {
                deleted &&
                <Dialog
                    open={dialogOpen}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                    PaperProps={{
                        style: {
                            borderRadius: '20px',
                            overflow: 'hidden',
                        }
                    }}
                >
                    <DialogTitle sx={{ mx: 1, mt: 2, mb: 3 }}>Are you sure you want to delete This KnowledgeBank Major?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly', mx: 4, mb: 4 }}>
                        <Button
                            sx={{
                                width: '120px',
                                height: '50px',
                                background: '#fff',
                                color: '#000',
                                fontFamily: 'Inter',
                                fontSize: 14,
                                textTransform: 'none',
                                fontWeight: 400,
                                border: '1px solid #000',
                                borderRadius: '10px',
                                '&:hover': {
                                    background: '#fff',
                                    opacity: 1
                                }
                            }}
                            onClick={handleClose}
                        >
                            No
                        </Button>
                        <Button
                            sx={{
                                width: '120px',
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
                                
                                if (selectedMajor) {
                                    //@ts-expect-error major
                                    deleteMajor(selectedMajor._id);
                                    handleClose();
                                } else {
                                    console.error("No major selected for deletion.");
                                }
                            }}
                        >
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            }
            <Box
                bgcolor='#FEF4EB'
                display='flex'
                alignItems='center'
                minHeight='100vh'
                justifyContent='flex-start'
                flexDirection='column'
                position='sticky'
                left={0}
                width={open ? 'auto' : '50px'}
            >
                <Box
                    px={8}
                    pt={6}
                    textAlign='center'
                >
                    <SvgIcon onClick={() => setOpen(prev => !prev)} sx={{ cursor: 'pointer', position: 'absolute', zIndex: 2, top: '2.5%', left: !open ? '20%' : '85%', ':hover': { boxShadow: 'inset 0px 0px 0px 9999px rgba(0, 0, 0, 0.05)', borderRadius: '9999px' }, p: 0.5, alignSelf: 'center' }}>
                        {
                            open
                                ?
                                <ArrowBackIosIcon sx={{ color: '#FF7E00' }} />
                                :
                                <ArrowForwardIosIcon sx={{ color: '#FF7E00' }} />
                        }
                    </SvgIcon>
                </Box>
                {open && displayedMajors}
                {
                    open && add &&
                    <Input
                        sx={{
                            flex: 1,
                            fontSize: 20,
                            width: add ? 'auto' : '0px',
                            maxHeight: add ? '40px' : '0px',
                            minHeight: add ? '40px' : '0px',
                            mb: 2,
                            ml: 1,
                            transition: '0.5s',
                            bgcolor: '#fcfcfc',
                            borderRadius: '5px',
                            border: add ? '1px solid #6A9DBC' : '',
                            px: 2
                        }}
                        disableUnderline
                        value={majorAdded}
                        onChange={(e) => setMajorAdded(e.target.value)}
                    />
                }
                {open && <Button
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
                        mb:3,
                        gap: 1,
                        width: '160px',
                        mx: 'auto',
                        maxHeight: '50px',
                        minHeight: '50px'
                    }}
                    
                    onClick={() => {
                        if (!add) {
                            setAdd(true)
                        }
                        else if (add && !majorAdded) {
                            setAdd(false)
                        }
                        else if (add && majorAdded) {
                            addMajor()
                        }
                    }}
                >
                    <SvgIcon sx={{ fontSize: 20, fontWeight: 400 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.17479 0H10.8252C11.4319 0 11.9109 0.478992 11.9109 1.05378V7.12101H17.9462C18.521 7.12101 19 7.6 19 8.17479V10.8252C19 11.4319 18.521 11.9109 17.9462 11.9109H11.9109V17.9462C11.9109 18.521 11.4319 19 10.8252 19H8.17479C7.6 19 7.12101 18.521 7.12101 17.9462V11.9109H1.05378C0.478992 11.9109 0 11.4319 0 10.8252V8.17479C0 7.6 0.478992 7.12101 1.05378 7.12101H7.12101V1.05378C7.12101 0.478992 7.6 0 8.17479 0Z" fill="white" />
                        </svg>
                    </SvgIcon>
                    <Typography textAlign='left'  noWrap fontFamily='Inter' fontSize={14}>Add Major</Typography>
                </Button>}
                {error && !reset && <Alert severity="error">{error}</Alert>}
                {reset && !error && <Alert severity="success">{reset}</Alert>}
            </Box>
            {displayedContent}
            <Dialog open={loading} PaperProps={{ style: { background: 'transparent', backgroundColor: 'transparent', overflow: 'hidden', boxShadow: 'none' } }}>
                <CircularProgress size='46px' sx={{ color: '#FF7E00' }} />
            </Dialog>
        </Box>

       
    )
}
