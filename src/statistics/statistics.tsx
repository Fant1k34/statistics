import React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import styles from './index.module.css';
import Button from "@mui/material/Button";

type Props = {
    result: number;
    maximum: number;
    questions: string[];
    resultsByQuestions: number[];
    handleStartAgainClick: () => void;
    handleHomeButtonClick: () => void;
};

export const Statistics = ({ result, maximum, questions, resultsByQuestions, handleStartAgainClick, handleHomeButtonClick }: Props) => {
    return (
        <div className={styles.Statistics}>
            <div className={styles.header}>
                <Typography variant="h6" gutterBottom>
                    Result:
                </Typography>
                <Typography variant="h6" gutterBottom>
                    { result }
                </Typography>
                <Typography variant="h6" gutterBottom>
                    of
                </Typography>
                <Typography variant="h6" gutterBottom>
                    { maximum }
                </Typography>
            </div>
            <div className={styles.tableResults}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Number</TableCell>
                                <TableCell align="center">Question</TableCell>
                                <TableCell align="right">Rating</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {questions.map((row, id) => (
                                <TableRow
                                    key={row}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left">
                                        {id}
                                    </TableCell>
                                    <TableCell align="left">{row}</TableCell>
                                    <TableCell align="right">{Math.round(resultsByQuestions[id] * 100) / 100}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className={styles.footer}>
                <Button onClick={() => handleStartAgainClick()} variant='contained'>Start Again</Button>
                <Button onClick={() => handleHomeButtonClick()} variant='outlined'>HOME</Button>
            </div>
        </div>
    );
};