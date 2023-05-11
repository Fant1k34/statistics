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
import { mobileTextScaler } from '../api/mobile-text-scaler'
import { isMobile } from '../api/device-getter'
import { sklonatel } from '../api/sklonatel'
import { useNavigate, useParams } from 'react-router-dom'
import { context } from '../config'
import Alert from '@mui/material/Alert';
import { useSearchParams } from 'react-router-dom'

export const Statistics = () => {
    // {"r":70,"m":90,"q":["1.1","1.7","2.5"],"a":{"1.7":1}}
    // /?r=70&m=90&q=["1.1","1.7","2.5"]&a={"1.7":1}
    const [searchParams, setSearchParams] = useSearchParams();
    const r = Number(searchParams.get('r'));
    const m = Number(searchParams.get('m'));
    const q = JSON.parse(searchParams.get('q'));
    const a = JSON.parse(searchParams.get('a'));

    const code = { r, m, q, a };

    const urlParams = `?r=${r}&m=${m}&q=${JSON.stringify(q)}&a=${JSON.stringify(a)}`;
    console.log(code);
    const navigate = useNavigate();
    //@ts-ignore
    const data = code;

    const textWrapperToTable = (text: string | number) =>
        mobileTextScaler(text.toString(), styles.TableText)


    const percentResult = Math.round((data.r * 100) / data.m)

    const [diagramPercent, setDiagramPercent] = useState(0)


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
                <Alert severity="info" className={styles.alert}>Ваш результат анекты — {data.r}, при этом минимальный балл для получения выбранной квалификационной категории состовляет {data.m}</Alert>
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
                            {data.q.map((criteria) => (
                                <TableRow
                                    key={criteria}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell align="center">
                                        {textWrapperToTable(criteria)}</TableCell>
                                    <TableCell align="left">
                                        {`+ ${data.a[criteria] ? data.a[criteria] : 0} ${sklonatel(data.a[criteria] ? data.a[criteria] : 0)}`}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className={styles.footer}>
                <Button
                    onClick={() => {
                        navigator.clipboard.writeText(`${context}statistics/${urlParams}`)
                            .then(() => {
                                console.log('Text copied to clipboard');
                            })
                            .catch(err => {
                                console.error('Error in copying text: ', err);
                            });
                    }}
                    variant="contained"
                >
                    {mobileTextScaler('Скопировать ссылку на результат', styles.StatisticsButton)}
                </Button>
                <Button
                    onClick={() => navigate('/')}
                    variant="outlined"
                >
                    {mobileTextScaler('Вернуться на главную', styles.StatisticsButton)}
                </Button>
            </div>
        </div>
    )
}
