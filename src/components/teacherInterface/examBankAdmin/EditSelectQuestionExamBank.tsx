import { ExpandMore } from '@mui/icons-material'
import { Stack, InputLabel, Input, Select, MenuItem, Button, SvgIcon, Typography } from '@mui/material'
import { memo } from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useQueryClient } from '@tanstack/react-query';

//@ts-expect-error anytype
// eslint-disable-next-line react-refresh/only-export-components
function EditSelectQuestionExamBank({ examBank, index, question })
{
    const queryClient = useQueryClient()

    return (
        <Stack
            direction='column'
            flex={1}
            // alignItems='center'
            justifyContent='center'
            my={4}
            gap={4}
            position='relative'
        >
            <Stack
                gap={1.5}
                flex={1}
                // alignItems='center'
                justifyContent='center'
                px={18}
                position='relative'
            >
                <Stack
                    direction='row'
                    flex={1}
                    gap={1}
                >
                    <HighlightOffIcon onClick={() => queryClient.setQueryData(['examBankEdit', examBank.id], (oldData: unknown) => {
                        //@ts-expect-error oldata
                        const newData = oldData ? oldData.slice().filter((_, indexData) => indexData !== index) : []
                        return newData
                    })} sx={{ cursor: 'pointer', color: '#000', ml: -5.2, alignSelf: 'flex-end', mb: 2 }} />
                    <Stack
                        flex={1}
                        gap={1.5}
                        minWidth= '100%'
                    >
                        <InputLabel sx={{ color: '#000', fontSize: 16, fontFamily: 'Inter', fontWeight: 600, alignSelf: 'center' }} id='LessonDescription'>Question {index + 1}</InputLabel>
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
                                bgcolor: '#F8F8F8',
                                textAlign: 'center'
                            }}
                            inputProps={{ style: { textAlign: 'center', fontSize: 22 } }}
                            value={question.question}
                            onChange={(e) => {
                                queryClient.setQueryData(['examBankEdit', examBank.id], (oldData: unknown) => {
                                    //@ts-expect-error oldata
                                    const newData = oldData ? [...oldData] : []
                                    const oldQuestion = newData[index]
                                    newData[index] = {...oldQuestion, question: e.target.value}
                                    return newData
                                })
                            }}
                        />
                    </Stack>
                    <Stack
                        gap={1.5}
                    >
                        <InputLabel sx={{ color: '#000', fontSize: 16, fontFamily: 'Inter', fontWeight: 600, alignSelf: 'center' }} id='LessonDescription'>Type</InputLabel>
                        <Select
                            // labelId="demo-select-small-label"
                            // id="demo-select-small"
                            sx={{
                                width: '140px !important',
                                flex: 1,
                                boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.20)',
                                borderRadius: '4px !important',
                                outline: 'none !important',
                                boxSizing: 'border-box !important',
                                background: '#F8F8F8',
                                paddingX: 1,
                                '&:hover': {
                                    boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.20)',
                                    background: '#F8F8F8',
                                }, fontSize: 16, fontWeight: 500, fontFamily: 'Inter', color: '#000',
                                textAlign: 'left'
                            }}
                            // value={day}
                            IconComponent={() => <ExpandMore sx={{ borderLeft: '1.5px solid rgba(0, 0, 0, 0.20)', color: '#000', paddingLeft: 1, height: '100%', zIndex: 1, position: 'absolute', left: '75%' }} />}
                            inputProps={{ style: { borderRight: '1px solid rgba(0, 0, 0, 1)', width: '100%' } }}
                            variant='standard'
                            disableUnderline
                            color='primary'
                            labelId="Level"
                            value={question.type}
                            // value={level}
                            // onChange={(e) => setLevel(e.target.value)}
                            onChange={(e) => {
                                if(e.target.value === 'options')
                                    {
                                        queryClient.setQueryData(['examBankEdit', examBank?.id ?? ''], (oldData: unknown) => {
                                            //@ts-expect-error oldata
                                            const newData = oldData ? [...oldData] : []
                                            const oldQuestion = newData[index]
                                            newData[index] = { question: oldQuestion.question, correctOption: ['0'], options: [oldQuestion.firstCorrect, oldQuestion.secondCorrect, oldQuestion.thirdCorrect, oldQuestion.fourthCorrect], type: 'options' }
                                            return newData
                                        })
                                    }
                                    else 
                                    {
                                        queryClient.setQueryData(['examBankEdit', examBank?.id ?? ''], (oldData: unknown) => {
                                            //@ts-expect-error oldata
                                            const newData = oldData ? [...oldData] : []
                                            const oldQuestion = newData[index]
                                            newData[index] = { question: oldQuestion.question, correctOption: ['0'], options: [oldQuestion.firstCorrect, oldQuestion.secondCorrect, oldQuestion.thirdCorrect, oldQuestion.fourthCorrect, ''], type: 'fiveOptions' }
                                            return newData
                                        })
                                    }
                            }}
                        >
                            <MenuItem sx={{ background: '#F8F8F8', fontSize: 16, fontWeight: 500, fontFamily: 'Inter', color: '#000' }} value='options'>Options</MenuItem>
                            <MenuItem sx={{ background: '#F8F8F8', fontSize: 16, fontWeight: 500, fontFamily: 'Inter', color: '#000' }} value='dropdowns'>Drop Downs</MenuItem>
                            <MenuItem sx={{ background: '#F8F8F8', fontSize: 16, fontWeight: 500, fontFamily: 'Inter', color: '#000' }} value='fiveOptions'>Five Options</MenuItem>
                        </Select>
                    </Stack>
                </Stack>
            </Stack>
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
                    mr: 8,
                    gap: 1.5,
                    '&:hover': {
                        bgcolor: '#FFFBF8'
                    },
                    position: 'absolute',
                    left: '43%',
                    top: '46%'
                }}
            >
                <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(
                        e: React.ChangeEvent<HTMLInputElement>,
                    ) => {
                        const reader = (readFile: File) =>
                            new Promise<string>((resolve) => {
                                const fileReader = new FileReader();
                                fileReader.onload = () => resolve(fileReader.result as string);
                                fileReader.readAsDataURL(readFile);
                            });

                        reader(e.target.files![0]).then((result: string) =>
                        queryClient.setQueryData(['examBankEdit', examBank.id], (oldData: unknown) => {
                            //@ts-expect-error oldData
                            const newData = oldData ? [...oldData] : []
                            const oldQuestion = newData[index]
                            newData[index] = { ...oldQuestion, image: result}
                            return newData
                        })
                        );
                    }}
                />
                {
                    //@ts-expect-error oldData
                    queryClient.getQueryData(['examBankEdit', examBank.id])?.[index]?.image ? (
                        //@ts-expect-error oldData
                        <img src={queryClient.getQueryData(['examBankEdit', examBank.id])?.[index]?.image} alt='Question' style={{ width: '100px', height: '100px', borderRadius: '9999px' }} />
                    ) : (
                        <SvgIcon sx={{ cursor: 'pointer', fontSize: 88 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="82" height="82" viewBox="0 0 82 82" fill="none">
                                <circle cx="41" cy="41" r="41" fill="#226E9F"/>
                                <path d="M41.8633 37.6064V55.1412C41.8633 55.6064 41.4673 56 40.9994 56C40.5314 56 40.1354 55.6064 40.1354 55.1412V37.6064L36.7155 41.1849C36.3915 41.5428 35.8155 41.5428 35.4556 41.2207C35.0956 40.8987 35.0956 40.3261 35.4196 39.9683L40.3514 34.851C40.5314 34.672 40.7474 34.5647 40.9994 34.5647C41.2513 34.5647 41.4673 34.672 41.6473 34.851L46.5792 39.9683C46.9031 40.3261 46.9031 40.8629 46.5432 41.2207C46.3632 41.3997 46.1472 41.4712 45.9312 41.4712C45.7152 41.4712 45.4632 41.3639 45.2832 41.1849L41.8633 37.6064ZM58.9987 41.5786C58.8907 37.3917 55.9028 33.1333 50.431 33.1333C50.287 33.1333 50.143 33.1333 49.999 33.1333C49.639 31.4514 48.8831 29.9484 47.6951 28.7317C46.4352 27.4434 44.7792 26.5488 42.9433 26.191C39.1994 25.4395 35.5635 26.9425 33.5116 30.0558C31.3877 29.8053 29.3358 30.4852 27.7158 31.9166C26.0599 33.3838 25.1959 35.4593 25.3039 37.6064C23.828 39.0021 23 40.9345 23 42.9384C23 47.0179 26.3479 50.3102 30.4157 50.3102H37.4715C37.9395 50.3102 38.3355 49.9165 38.3355 49.4513C38.3355 48.9861 37.9395 48.5925 37.4715 48.5925H30.4157C27.2838 48.5925 24.7639 46.0517 24.7639 42.9742C24.7639 41.3281 25.5199 39.7535 26.8159 38.6442C27.0319 38.4653 27.1399 38.179 27.1399 37.8927C26.9599 36.1035 27.6438 34.4216 28.9758 33.2049C30.3077 32.0239 32.0717 31.523 33.8356 31.8808C34.1956 31.9524 34.5916 31.7734 34.7716 31.4514C36.3555 28.6601 39.4154 27.2645 42.6193 27.9444C45.1392 28.4454 47.9831 30.3778 48.4151 34.2068C48.4511 34.4573 48.5591 34.672 48.7391 34.8152C48.9191 34.9583 49.1711 35.0299 49.4231 34.9941C49.747 34.9583 50.107 34.9225 50.467 34.9225C55.0389 34.9225 57.1988 38.4295 57.2708 41.6502C57.3428 44.9424 55.2548 48.3778 50.431 48.5925H44.5272C44.0592 48.5925 43.6633 48.9861 43.6633 49.4513C43.6633 49.9165 44.0592 50.3102 44.5272 50.3102H50.431H50.467C53.1669 50.167 55.4348 49.165 56.9828 47.4116C58.3147 45.8728 59.0347 43.7973 58.9987 41.5786Z" fill="white"/>
                            </svg>
                        </SvgIcon>
                    )
                }
                <Typography fontWeight={400} fontFamily='Inter' sx={{ cursor: 'pointer', color: '#226E9F' }}>Upload Question's Image</Typography>
            </Button>
            <Stack
                gap={40}
                flex={1}
                // alignItems='center'
                justifyContent='center'
                px={18}
                direction='row'
            >
                <Stack
                    justifyContent='center'
                    flex={1}
                    gap={3}
                    direction='row'
                >
                    <Stack
                        direction='column'
                        gap={1.5}
                        flex={1}
                        justifyContent='center'
                    >
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
                                bgcolor: '#F8F8F8',
                                textAlign: 'center'
                            }}
                            inputProps={{ style: { fontWeight: 600, textAlign: 'center', fontSize: 16 } }}
                            value={question.firstLabel}
                            onChange={(e) => {
                                queryClient.setQueryData(['examBankEdit', examBank.id], (oldData: unknown) => {
                                    //@ts-expect-error oldata
                                    const newData = oldData ? [...oldData] : []
                                    newData[index] = {...newData[index], firstLabel: e.target.value}
                                    return newData
                                })
                            }}
                        />
                        <Stack
                            direction='row'
                            flex={1}
                            gap={2}
                        >
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
                                    bgcolor: '#F8F8F8',
                                    textAlign: 'center',
                                    flex: 1,
                                    ml: 6
                                }}
                                inputProps={{ style: { textAlign: 'center', fontSize: 20 } }}
                                value={question.firstCorrect}
                                onChange={(e) => {
                                    queryClient.setQueryData(['examBankEdit', examBank.id], (oldData: unknown) => {
                                        //@ts-expect-error oldata
                                        const newData = oldData ? [...oldData] : []
                                        newData[index] = {...newData[index], firstCorrect: e.target.value}
                                        return newData
                                    })
                                }}
                            />
                        </Stack>
                    </Stack>
                </Stack>
                <Stack
                    justifyContent='center'
                    flex={1}
                    gap={3}
                    direction='row'
                >
                    <Stack
                        direction='column'
                        gap={1.5}
                        flex={1}
                        justifyContent='center'
                    >
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
                                bgcolor: '#F8F8F8',
                                textAlign: 'center'
                            }}
                            inputProps={{ style: { fontWeight: 600, textAlign: 'center', fontSize: 16 } }}
                            value={question.secondLabel}
                            onChange={(e) => {
                                queryClient.setQueryData(['examBankEdit', examBank.id], (oldData: unknown) => {
                                    //@ts-expect-error oldata
                                    const newData = oldData ? [...oldData] : []
                                    newData[index] = {...newData[index], secondLabel: e.target.value}
                                    return newData
                                })
                            }}
                        />
                        <Stack
                            direction='row'
                            flex={1}
                            gap={2}
                        >
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
                                    bgcolor: '#F8F8F8',
                                    textAlign: 'center',
                                    flex: 1,
                                    ml: 6
                                }}
                                inputProps={{ style: { textAlign: 'center', fontSize: 20 } }}
                                value={question.secondCorrect}
                                onChange={(e) => {
                                    queryClient.setQueryData(['examBankEdit', examBank.id], (oldData: unknown) => {
                                        //@ts-expect-error oldata
                                        const newData = oldData ? [...oldData] : []
                                        newData[index] = {...newData[index], secondCorrect: e.target.value}
                                        return newData
                                    })
                                }}
                            />
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <Stack
                gap={40}
                flex={1}
                // alignItems='center'
                justifyContent='center'
                px={18}
                direction='row'
            >
                <Stack
                    justifyContent='center'
                    flex={1}
                    gap={3}
                    direction='row'
                >
                    <Stack
                        direction='column'
                        gap={1.5}
                        flex={1}
                        justifyContent='center'
                    >
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
                                bgcolor: '#F8F8F8',
                                textAlign: 'center'
                            }}
                            inputProps={{ style: { fontWeight: 600, textAlign: 'center', fontSize: 16 } }}
                            value={question.thirdLabel}
                            onChange={(e) => {
                                queryClient.setQueryData(['examBankEdit', examBank.id], (oldData: unknown) => {
                                    //@ts-expect-error oldata
                                    const newData = oldData ? [...oldData] : []
                                    newData[index] = {...newData[index], thirdLabel: e.target.value}
                                    return newData
                                })
                            }}
                        />
                        <Stack
                            direction='row'
                            flex={1}
                            gap={2}
                        >
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
                                    bgcolor: '#F8F8F8',
                                    textAlign: 'center',
                                    flex: 1,
                                    ml: 6
                                }}
                                inputProps={{ style: { textAlign: 'center', fontSize: 20 } }}
                                value={question.thirdCorrect}
                                onChange={(e) => {
                                    queryClient.setQueryData(['examBankEdit', examBank.id], (oldData: unknown) => {
                                        //@ts-expect-error oldata
                                        const newData = oldData ? [...oldData] : []
                                        newData[index] = {...newData[index], thirdCorrect: e.target.value}
                                        return newData
                                    })
                                }}
                            />
                        </Stack>
                    </Stack>
                </Stack>
                <Stack
                    justifyContent='center'
                    flex={1}
                    gap={3}
                    direction='row'
                >
                    <Stack
                        direction='column'
                        gap={1.5}
                        flex={1}
                        justifyContent='center'
                    >
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
                                bgcolor: '#F8F8F8',
                                textAlign: 'center'
                            }}
                            inputProps={{ style: { fontWeight: 600, textAlign: 'center', fontSize: 16 } }}
                            value={question.fourthLabel}
                            onChange={(e) => {
                                queryClient.setQueryData(['examBankEdit', examBank.id], (oldData: unknown) => {
                                    //@ts-expect-error oldata
                                    const newData = oldData ? [...oldData] : []
                                    newData[index] = {...newData[index], fourthLabel: e.target.value}
                                    return newData
                                })
                            }}
                        />
                        <Stack
                            direction='row'
                            flex={1}
                            gap={2}
                        >
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
                                    bgcolor: '#F8F8F8',
                                    textAlign: 'center',
                                    flex: 1,
                                    ml: 6
                                }}
                                inputProps={{ style: { textAlign: 'center', fontSize: 20 } }}
                                value={question.fourthCorrect}
                                onChange={(e) => {
                                    queryClient.setQueryData(['examBankEdit', examBank.id], (oldData: unknown) => {
                                        //@ts-expect-error oldata
                                        const newData = oldData ? [...oldData] : []
                                        newData[index] = {...newData[index], fourthCorrect: e.target.value}
                                        return newData
                                    })
                                }}
                            />
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <Stack
                flex={1}
                px={18}
                mt={4}
            >
                <Stack
                    direction='column'
                    gap={1.5}
                    flex={1}
                    justifyContent='center'
                >
                    <InputLabel sx={{ color: '#000', fontSize: 16, fontFamily: 'Inter', fontWeight: 600, alignSelf: 'center' }} id='LessonDescription'>Explanation</InputLabel>
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
                            bgcolor: '#F8F8F8',
                            textAlign: 'center'
                        }}
                        inputProps={{ style: { textAlign: 'center', fontSize: 20 } }}
                        value={question?.explanation}
                        onChange={(e) => {
                            queryClient.setQueryData(['examBankEdit', examBank?.id ?? ''], (oldData: unknown) => {
                                //@ts-expect-error oldata
                                const newData = oldData ? [...oldData] : []
                                // newData[index].options[3] = e.target.value
                                newData[index] = {...newData[index], explanation: e.target.value}
                                return newData
                            })
                        }}
                    />
                </Stack>
            </Stack>
        </Stack>
    )
}

const memoizedEditSelectQuestionExamBank = memo(EditSelectQuestionExamBank)
export default memoizedEditSelectQuestionExamBank