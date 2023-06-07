import React, { useCallback, useEffect, useState } from 'react'
import { QuestionToShow } from '../../types/question-type'
import {Alert, Checkbox, FormControlLabel, FormGroup} from '@mui/material'
import Button from '@mui/material/Button'
import { calculateQuestionScoreMultiple } from '../../api/calculate-question-score-multiple'
import { toTimeString } from '../../api/time'
import styles from './index.module.css'
import { mobileTextScaler } from '../../api/mobile-text-scaler'

type Props = {
    question: QuestionToShow['question'],
    answers: QuestionToShow['answers'],
    correctAnswers: QuestionToShow['correctAnswers'],
    callback: (p: number[]) => void,
    secondsLeft: number,
    finishQuiz: () => void,
    documents: string;
}

export const MultipleQuestion = ({
    question,
    answers,
    correctAnswers,
    callback,
    secondsLeft,
    finishQuiz,
    documents,
}: Props) => {
    const correctAnswersQuestion: QuestionToShow['correctAnswers'] =
        Object.entries(correctAnswers).reduce((previousValue, currentValue) => {
            return {
                ...previousValue,
                [currentValue[0]]: currentValue[1],
            }
        }, {})

    const initialStateUserAnswers = useCallback(
        () =>
            Object.entries(answers).reduce((previousValue, currentValue) => {
                // Get answer text as a key
                return currentValue[1]
                    ? {
                          ...previousValue,
                          [currentValue[1]]: false,
                      }
                    : previousValue
            }, {}),
        [question, answers, correctAnswers, callback]
    )
    const [userAnswers, setUserAnswers] = useState<
        QuestionToShow['correctAnswers']
    >(initialStateUserAnswers)
    const [time, setTime] = useState<number>(secondsLeft)
    const [timerId, setTimerId] = useState<number | null>(null)
    const [timerColor, setTimerColor] = useState<'primary' | 'error'>('primary')

    useEffect(() => {
        setUserAnswers(initialStateUserAnswers)
        if (timerId) clearTimeout(timerId)
        setTime(secondsLeft)
        setTimerColor('primary')
    }, [answers, question])

    const handleChoiceClick = (answer: string) => {
        console.log(answer)
        setUserAnswers((prevState: QuestionToShow['correctAnswers']) => {
            return {
                ...prevState,
                [answer]: !prevState[answer],
            }
        })
    }

    const handleSubmitButton = () => {
        if (Object.values(userAnswers).filter((el) => el).length === 0) {
            return
        }
        // @ts-ignore
        callback([Object.values(answers).map((el, index) => userAnswers[el] ? index : -1).filter((el) => el >= 0)]);
    }

    const textWrapperToQuizAnswers = (text: string | number) =>
        mobileTextScaler(text.toString(), styles.HeaderText)

    return (
        <>
            <FormGroup>
                {Object.entries(userAnswers).map((option) => {
                    return option ? (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onClick={() => handleChoiceClick(option[0])}
                                    checked={option[1]}
                                />
                            }
                            label={textWrapperToQuizAnswers(option[0])}
                        />
                    ) : undefined
                })}
            </FormGroup>
            <Alert variant="outlined" severity="info">
                { documents }
            </Alert>
            <div className={styles.Footer}>
                <Button
                    variant="contained"
                    onClick={() => handleSubmitButton()}
                    className={styles.SubmitFormButton}
                    disabled={(Object.values(userAnswers).filter((el) => el).length === 0)}
                >
                    {textWrapperToQuizAnswers('Далее')}
                </Button>
            </div>
        </>
    )
}
