import { Box, Stack, Typography } from '@mui/material'
import { lazy, useState, useContext, Suspense } from 'react'
const ProgramsCompleted = lazy(() => import('./Completed/ProgramsCompleted'))
const ProgramsCurrent = lazy(() => import('./Current/ProgramsCurrent'))
const ProgramsExplore = lazy(() => import('./Explore/ProgramsExplore'))
const ProgramsFavorites = lazy(() => import('./Favorites/ProgramsFavorites'))
import { useQuery } from '@tanstack/react-query'
import { AuthContext } from '../../authentication/auth/AuthProvider'
import { getStudentCurrentPrograms } from '../../helpers/getStudentCurrentPrograms'
import { useLocation } from 'react-router-dom'

export default function Programs() 
{
    //@ts-expect-error context
    const { userData } = useContext(AuthContext)

    const { pathname } = useLocation()
    
    const [tab, setTab] = useState(pathname.includes('/programs/current') ? 'Current' : pathname.includes('/programs/current') ?  'Explore' : 'Explore')

    const { isLoading } = useQuery({
        queryKey: ['currentPrograms', userData?.id],
        queryFn: () => getStudentCurrentPrograms(userData.id),
        enabled: !!userData?.id
    })

    return (
        <Box
            mx={14}
        >
            <Stack
                direction='column'
                gap={0.2}
            >
                <Stack
                    flex={1}
                    alignItems='center'
                    justifyContent='space-between'
                    mt={10}
                    // mx={8}
                    direction='row'
                >
                    <Stack
                        alignItems='center'
                        onClick={() => setTab('Explore')}
                        sx={{ cursor: 'pointer' }}
                    >
                        <Typography>Explore</Typography>
                        <Box
                            position='relative'
                            border='0px'
                            height='6px'
                            bgcolor={tab === 'Explore' ? '#FF9F06' : '#fff'}
                            width={{xs: '80px', sm: '120px', lg: '180px'}}
                        >

                        </Box>
                    </Stack>
                    <Stack
                        alignItems='center'
                        onClick={() => setTab('Current')}
                        sx={{ cursor: 'pointer' }}
                    >
                        <Typography>Current</Typography>
                        <Box
                            position='relative'
                            border='0px'
                            height='6px'
                            bgcolor={tab === 'Current' ? '#FF9F06' : '#fff'}
                            width={{xs: '80px', sm: '120px', lg: '180px'}}
                        >

                        </Box>
                    </Stack>
                    <Stack
                        alignItems='center'
                        onClick={() => setTab('Completed')}
                        sx={{ cursor: 'pointer' }}
                    >
                        <Typography>Completed</Typography>
                        <Box
                            position='relative'
                            border='0px'
                            height='6px'
                            bgcolor={tab === 'Completed' ? '#FF9F06' : '#fff'}
                            width={{xs: '80px', sm: '120px', lg: '180px'}}
                        >

                        </Box>
                    </Stack>
                    <Stack
                        alignItems='center'
                        onClick={() => setTab('Favorites')}
                        sx={{ cursor: 'pointer' }}
                    >
                        <Typography>Favorites</Typography>
                        <Box
                            position='relative'
                            border='0px'
                            height='6px'
                            bgcolor={tab === 'Favorites' ? '#FF9F06' : '#fff'}
                            width={{xs: '80px', sm: '120px', lg: '180px'}}
                        >

                        </Box>
                    </Stack>
                </Stack>
                <Box
                    position='relative'
                    border='0px'
                    height='6px'
                    bgcolor='#FEF4EB'
                >
                </Box>
            </Stack>
            {
                !isLoading &&
                (
                    tab === 'Explore' ?
                    <Suspense>
                        <ProgramsExplore setTab={setTab} />
                    </Suspense> 
                    :
                    tab === 'Current' ?
                    <Suspense>
                        <ProgramsCurrent />
                    </Suspense> 
                    :
                    tab === 'Completed' ?
                    <Suspense>
                        <ProgramsCompleted />
                    </Suspense> 
                    :
                    <Suspense>
                        <ProgramsFavorites />
                    </Suspense>
                )
            }
        </Box>
    )
}
