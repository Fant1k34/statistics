import React, { useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { QuestionToShow } from "../../types/question-type";
import { calculateQuestionScore } from "../../api/calculate-question-score";

type Props = QuestionToShow & {
    callback: (p: number) => void;
};

export const Question = ({ question, answers, correctAnswers, callback, multipleCorrectAnswers}: Props) => {
    const oneRightAnswerQuestion = !multipleCorrectAnswers;
    const initialStateUserAnswers = Object.entries(answers).reduce((previousValue, currentValue) => {
        // Get answer text as a key
        return currentValue[1] ? {
            ...previousValue,
            [currentValue[1]]: false,
        } : previousValue;
    }, {});
    const [userAnswers, setUserAnswers] = useState(initialStateUserAnswers);
    console.warn(userAnswers);

    useEffect(() => {
        setUserAnswers(initialStateUserAnswers);
    }, [answers, question]);

    const handleChoiceClick = (answer: string) => {
        setUserAnswers((prevState: {[p: string]: boolean}) => {
            return {
                ...prevState,
                [answer]: !prevState[answer],
            }
        });
    };

    const handleSubmitButton = () => {
        // Change answer_number as a key to answer text as a key
        const correct = Object.entries(correctAnswers).reduce((previousValue, currentValue) => {
            // Get name of question by id that finds by cutting "_correct" part of currentValue tag
            const value = answers[currentValue[0].slice(0, currentValue[0].length - 8)];
            return value ? {
                ...previousValue,
                [value]: currentValue[1],
            } : previousValue;
        }, {});
        callback(calculateQuestionScore(correct, userAnswers));
    };

    return (
        <div>
            <Typography variant="h5">
                { question }
            </Typography>
            { !oneRightAnswerQuestion && (
                <FormGroup>
                    { Object.values(answers).map(option =>
                        option ? <FormControlLabel control={<Checkbox onClick={() => handleChoiceClick(option)}
                                                                      checked={userAnswers[option]}/>}
                            label={option} />
                            : undefined) }
                </FormGroup>
            ) }
            { !oneRightAnswerQuestion && <></>  }
            <Button onClick={() => handleSubmitButton()}>Submit answer</Button>
        </div>
    );
}