import React, {useCallback, useEffect, useState} from "react";
import { QuestionFromMiddle, QuestionToShow } from "../../types/question-type";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Button from "@mui/material/Button";
import { calculateQuestionScoreMultiple } from "../../api/calculate-question-score-multiple";

type Props = {
    question: QuestionFromMiddle['question'];
    answers: QuestionFromMiddle['answers'];
    correctAnswers: QuestionFromMiddle['correct_answers'];
    callback: (p: number) => void;
    secondsLeft: number;
};

export const MultipleQuestion = ({ question, answers, correctAnswers, callback, secondsLeft }: Props) => {
    const correctAnswersQuestion: QuestionToShow['correctAnswers'] = Object.entries(correctAnswers)
        .reduce((previousValue, currentValue) => {
            return {
                ...previousValue,
                [currentValue[0]]: currentValue[1] === 'true'
            }
        }, {});

    const initialStateUserAnswers = useCallback(() => Object.entries(answers).reduce((previousValue, currentValue) => {
        // Get answer text as a key
        return currentValue[1] ? {
            ...previousValue,
            [currentValue[1]]: false,
        } : previousValue;
    }, {}), [question, answers, correctAnswers, callback]);
    const [userAnswers, setUserAnswers] = useState<QuestionToShow['correctAnswers']>(initialStateUserAnswers);
    const [timer, setTimer] = useState<number>(secondsLeft);
    const [timerId, setTimerId] = useState<number | null>(null);

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (timer === 0) handleSubmitButton();
            setTimer((time) => time === 0 ? 0 : time - 1);
        }, 1000);
        setTimerId(timerId);
    }, [timer]);

    useEffect(() => {
        setUserAnswers(initialStateUserAnswers);
        setTimer(secondsLeft);
    }, [answers, question]);

    useEffect(() => timerId ? clearTimeout(timerId) : undefined, []);

    const handleChoiceClick = (answer: string) => {
        console.log(answer);
        setUserAnswers((prevState: QuestionToShow['correctAnswers']) => {
            return {
                ...prevState,
                [answer]: !prevState[answer],
            }
        });
    };

    const handleSubmitButton = () => {
        // Change answer_number as a key to answer text as a key
        const correct = Object.entries(correctAnswersQuestion).reduce((previousValue, currentValue) => {
            // Get name of question by id that finds by cutting "_correct" part of currentValue tag
            const tag = answers[currentValue[0].slice(0, currentValue[0].length - 8)];
            return tag ? {
                ...previousValue,
                [tag]: currentValue[1],
            } : previousValue;
        }, {});
        callback(calculateQuestionScoreMultiple(correct, userAnswers));
    };

    return (
        <>
            <FormGroup>
                { Object.entries(userAnswers).map(option => {
                            console.warn(userAnswers);
                            return option ? <FormControlLabel control={<Checkbox onClick={() => handleChoiceClick(option[0])}
                            checked={option[1]}/>}
                            label={option} />
                        : undefined
                        })
                }
            </FormGroup>
            <Button onClick={() => handleSubmitButton()}>Submit answer</Button>
            <Button variant="outlined" disabled>{timer}</Button>
        </>
    );
}