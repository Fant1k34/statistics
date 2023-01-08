import React, {useEffect, useState} from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Button from "@mui/material/Button";
import { QuestionFromMiddle } from "../../types/question-type";
import { calculateQuestionScoreSingular } from "../../api/calculate-question-score-singular";

type Props = {
    question: QuestionFromMiddle['question'];
    answers: QuestionFromMiddle['answers'];
    correctAnswers: QuestionFromMiddle['correct_answers'];
    callback: (p: number) => void;
};

export const SingularQuestion = ({ question, answers, correctAnswers, callback }: Props) => {
    const [answer, setAnswer] = useState<string | null>(null);

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
            <Button onClick={() => handleSubmitClick()}>Submit answer</Button>
        </>
    );
}