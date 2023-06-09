import React from 'react'
import { AlertTitle, Box, LinearProgress, Typography, Alert } from '@mui/material'
import { QuestionToShow } from '../../types/question-type'
import { MultipleQuestion } from './multiple-question'
import { SingularQuestion } from './singular-question'
import { mobileTextScaler } from '../../api/mobile-text-scaler'
import { isMobile } from '../../api/device-getter'
import { setQuizStage } from '../../store/quiz-slice/quiz-slice'
import { useDispatch } from 'react-redux'

import styles from './index.module.css'
import { Percentage } from './percentage'

type Props = {
    question: QuestionToShow['question'],
    answers: QuestionToShow['answers'],
    correctAnswers: QuestionToShow['correctAnswers'],
    multipleCorrectAnswers: QuestionToShow['multipleCorrectAnswers'],
    callback: (p: number[]) => void,
    questionProcentCompleted: number,
    additional: string,
    documents: string,
}

export const Question = ({
    question,
    answers,
    correctAnswers,
    callback,
    multipleCorrectAnswers,
    questionProcentCompleted,
    additional,
    documents,
}: Props) => {
    const dispatch = useDispatch()
    const multipleAnswers = multipleCorrectAnswers
    const textWrapperToQuizAnswers = (text: string | number) =>
        mobileTextScaler(text.toString(), styles.HeaderText)
    const finishQuiz = () => dispatch(setQuizStage('Statistics'))

    const condition = JSON.stringify(Object.values(answers)) === JSON.stringify(['0', '100'])


    return (
        <div className={styles.Questions}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    {isMobile() ? (
                        <LinearProgress
                            variant="determinate"
                            sx={{ height: '16px', mr: 1 }}
                            value={Math.round(questionProcentCompleted)}
                        />
                    ) : (
                        <LinearProgress
                            variant="determinate"
                            sx={{ mr: 1 }}
                            value={Math.round(questionProcentCompleted)}
                        />
                    )}
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >{`${Math.round(questionProcentCompleted)}%`}</Typography>
                </Box>
            </Box>
            <Typography variant="h5">
                {textWrapperToQuizAnswers(question)}
            </Typography>
            <Alert severity="info">
                <AlertTitle>Документы</AlertTitle>
                { additional }
            </Alert>
            {multipleAnswers && condition && (
                <Percentage
                    question={question}
                    answers={answers}
                    correctAnswers={correctAnswers}
                    callback={callback}
                    secondsLeft={80}
                    finishQuiz={finishQuiz}
                    documents={documents}
                />
            )
            }
            {multipleAnswers && !condition && (
                <MultipleQuestion
                    question={question}
                    answers={answers}
                    correctAnswers={correctAnswers}
                    callback={callback}
                    secondsLeft={80}
                    finishQuiz={finishQuiz}
                    documents={documents}
                />
            )}
            {!multipleAnswers && (
                <SingularQuestion
                    question={question}
                    answers={answers}
                    correctAnswers={correctAnswers}
                    callback={callback}
                    secondsLeft={80}
                    finishQuiz={finishQuiz}
                    documents={documents}
                />
            )}
        </div>
    )
}
