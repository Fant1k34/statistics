import React, {useEffect, useState} from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Button from "@mui/material/Button";
import { QuestionToShow } from '../../types/question-type'
import { calculateQuestionScoreSingular } from "../../api/calculate-question-score-singular";
import {toTimeString} from "../../api/time";
import styles from "./index.module.css";
import { mobileTextScaler } from "../../api/mobile-text-scaler";

type Props = {
    question: QuestionToShow['question'];
    answers: QuestionToShow['answers'];
    correctAnswers: QuestionToShow['correctAnswers'];
    callback: (p: number) => void;
    secondsLeft: number;
    finishQuiz: () => void;
};

export const SingularQuestion = ({ question, answers, correctAnswers, callback, secondsLeft, finishQuiz }: Props) => {
    const [answer, setAnswer] = useState<string | null>(null);
    const [time, setTime] = useState<number>(secondsLeft);
    const [timerId, setTimerId] = useState<number | null>(null);
    const [timerColor, setTimerColor] = useState<'primary' | 'error'>('primary');

    useEffect(() => {
        const timerId = window.setTimeout(() => {
            if (time === 0) handleSubmitClick();
            setTime((time) => time === 0 ? 0 : time - 1);
        }, 1000);
        setTimerId(timerId);

        if (time <= 10) {
            setTimerColor('error');
        }
    }, [time]);

    const handleChoiceClick = (option: string) => {
        setAnswer(option);
    };

    const handleSubmitClick = () => {
        const correctAnswer = Object.entries(correctAnswers).reduce((previousValue: string | null, currentValue) => {
            if (!(currentValue[1])) return previousValue;

            return answers[currentValue[0].slice(0, currentValue[0].length - 8)];
        }, null);
        callback(calculateQuestionScoreSingular(correctAnswer, answer));
    }

    useEffect(() => {
        setAnswer(null);
        if (timerId) clearTimeout(timerId);
        setTime(secondsLeft);
        setTimerColor('primary');
    }, [answers, question]);

    const textWrapperToQuizAnswers = (text: string | number) => mobileTextScaler(text.toString(), styles.HeaderText);

    return (
        <>
            <RadioGroup
                value={answer}
                onChange={(event) => handleChoiceClick((event.target as HTMLInputElement).value)}>
            {
                Object.entries(answers).map(option => {
                        return option[1] ? <FormControlLabel value={option[1]} control={<Radio />} label={textWrapperToQuizAnswers(option[1])} /> : undefined
                    }
                )
            }
            </RadioGroup>
            <div className={styles.Footer}>
                <Button variant="contained" onClick={() => handleSubmitClick()} className={styles.SubmitFormButton}>{textWrapperToQuizAnswers("Submit answer")}</Button>
                <Button onClick={() => finishQuiz()} className={styles.FinishQuizButton}>{textWrapperToQuizAnswers("Finish Quiz")}</Button>
                <Button variant="outlined" color={timerColor} className={styles.Timer}>{textWrapperToQuizAnswers(toTimeString(time))}</Button>
            </div>
        </>
    );
}