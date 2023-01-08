import React, {useEffect, useState} from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Button from "@mui/material/Button";
import { QuestionFromMiddle } from "../../types/question-type";
import { calculateQuestionScoreSingular } from "../../api/calculate-question-score-singular";
import {toTimeString} from "../../api/time";
import styles from "./index.module.css";

type Props = {
    question: QuestionFromMiddle['question'];
    answers: QuestionFromMiddle['answers'];
    correctAnswers: QuestionFromMiddle['correct_answers'];
    callback: (p: number) => void;
    secondsLeft: number;
    finishQuiz: () => void;
};

export const SingularQuestion = ({ question, answers, correctAnswers, callback, secondsLeft, finishQuiz }: Props) => {
    const [answer, setAnswer] = useState<string | null>(null);
    const [timer, setTimer] = useState<number>(secondsLeft);
    const [timerId, setTimerId] = useState<number | null>(null);

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (timer === 0) handleSubmitClick();
            setTimer((time) => time === 0 ? 0 : time - 1);
        }, 1000);
        setTimerId(timerId);
    }, [timer]);

    const handleChoiceClick = (option: string) => {
        setAnswer(option);
    };

    const handleSubmitClick = () => {
        const correctAnswer = Object.entries(correctAnswers).reduce((previousValue: string | null, currentValue) => {
            if (!(currentValue[1] === 'true')) return previousValue;

            return answers[currentValue[0].slice(0, currentValue[0].length - 8)];
        }, null);
        callback(calculateQuestionScoreSingular(correctAnswer, answer));
    }

    useEffect(() => {
        setAnswer(null);
        if (timerId) clearTimeout(timerId);
        setTimer(secondsLeft);
    }, [answers, question]);

    return (
        <>
            <RadioGroup
                value={answer}
                onChange={(event) => handleChoiceClick((event.target as HTMLInputElement).value)}>
            {
                Object.entries(answers).map(option => {
                        return option[1] ? <FormControlLabel value={option[1]} control={<Radio />} label={option[1]} /> : undefined
                    }
                )
            }
            </RadioGroup>
            <div className={styles.footer}>
                <Button variant="contained" onClick={() => handleSubmitClick()}>Submit answer</Button>
                <Button onClick={() => finishQuiz()}>Finish Quiz</Button>
                <Button variant="outlined" disabled>{toTimeString(timer)}</Button>
            </div>
        </>
    );
}