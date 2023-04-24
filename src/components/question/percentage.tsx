import React, {useEffect, useState} from "react";;
import Button from "@mui/material/Button";
import { QuestionToShow } from '../../types/question-type'
import {toTimeString} from "../../api/time";
import styles from "./index.module.css";
import { mobileTextScaler } from "../../api/mobile-text-scaler";
import TextField from '@mui/material/TextField';

type Props = {
    question: QuestionToShow['question'];
    answers: QuestionToShow['answers'];
    correctAnswers: QuestionToShow['correctAnswers'];
    callback: (p: number[]) => void;
    secondsLeft: number;
    finishQuiz: () => void;
};

export const Percentage = ({ question, answers, correctAnswers, callback, secondsLeft, finishQuiz }: Props) => {
    const [answer, setAnswer] = useState<number>(0);
    const [time, setTime] = useState<number>(secondsLeft);
    const [timerId, setTimerId] = useState<number | null>(null);
    const [timerColor, setTimerColor] = useState<'primary' | 'error'>('primary');

    const handleChoiceClick = (option: string) => {
        if (!isNaN(option)) {
            if (Number(option) > 100) {
                setAnswer(100);
                return
            }
            if (Number(option) < 0) {
                setAnswer(0);
                return
            }
            setAnswer(Number(option));
        }
    };

    const handleSubmitClick = () => {
        // @ts-ignore
        callback([answer]);
    }

    useEffect(() => {
        if (timerId) clearTimeout
        (timerId);
        setTime(secondsLeft);
        setTimerColor('primary');
    }, [answers, question]);

    const textWrapperToQuizAnswers = (text: string | number) => mobileTextScaler(text.toString(), styles.HeaderText);

    return (
        <>
            <TextField
                value={answer}
                onChange={(event) => handleChoiceClick((event.target as HTMLInputElement).value)}>
            </TextField>
            <div className={styles.Footer}>
                <Button variant="contained" onClick={() => handleSubmitClick()} className={styles.SubmitFormButton}>{textWrapperToQuizAnswers("Далее")}</Button>
            </div>
        </>
    );
}