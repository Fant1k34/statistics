import React, { useEffect, useState } from 'react'
import {
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import styles from './index.module.css'
import Button from '@mui/material/Button'
import { mobileTextScaler } from '../../api/mobile-text-scaler'
import { isMobile } from '../../api/device-getter'
import { sklonatel } from '../../api/sklonatel'

type Props = {
    result: number,
    maximum: number,
    questions: string[],
    resultsByQuestions: number[],
    handleStartAgainClick: () => void,
    handleHomeButtonClick: () => void,
}

export const Statistics = ({
    result,
    maximum,
    questions,
    resultsByQuestions,
    handleStartAgainClick,
    handleHomeButtonClick,
}: Props) => {
    const difference = questions.length - resultsByQuestions.length
    for (let i = 0; i < difference; i++) {
        resultsByQuestions.push(0)
    }

    const textWrapperToTable = (text: string | number) =>
        mobileTextScaler(text.toString(), styles.TableText)

    const percentResult = Math.round((result * 100) / maximum)

    const [diagramPercent, setDiagramPercent] = useState(0)

    const results = [0, 1, 2, 3, 4, 5, 6, 7];

    useEffect(() => {
        setTimeout(
            () =>
                setDiagramPercent((value) =>
                    value + 1 >= percentResult ? percentResult : value + 1
                ),
            55
        )
    }, [diagramPercent])

    return (
        <div className={styles.Statistics}>
            <Box
                sx={{
                    position: 'relative',
                    display: 'inline-flex',
                    justifyContent: 'space-around',
                }}
            >
                <CircularProgress
                    variant="determinate"
                    size={isMobile() ? 400 : 100}
                    value={diagramPercent}
                />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h6" color="text.secondary">
                        {mobileTextScaler(
                            `${diagramPercent}%`,
                            styles.CircleText
                        )}
                    </Typography>
                </Box>
            </Box>
            <div>
                <TableContainer component={Paper}>
                    <Table
                        sx={{ minWidth: 500 }}
                        size="small"
                        aria-label="a dense table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">
                                    {textWrapperToTable('Критерий')}
                                </TableCell>
                                <TableCell align="left">
                                    {textWrapperToTable('Рекомендация')}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {questions.map((row, id) => (
                                <TableRow
                                    key={row}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell align="center">
                                        {textWrapperToTable(id + 1)}
                                    </TableCell>
                                    <TableCell align="center">
                                        {`+ ${results[id]} ${sklonatel(results[id])}`}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className={styles.footer}>
                <Button
                    onClick={() => handleStartAgainClick()}
                    variant="contained"
                >
                    {mobileTextScaler('Начать заново', styles.StatisticsButton)}
                </Button>
                <Button
                    onClick={() => handleHomeButtonClick()}
                    variant="outlined"
                >
                    {mobileTextScaler('На главную', styles.StatisticsButton)}
                </Button>
            </div>
        </div>
    )
}
