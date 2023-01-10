import React from 'react'
import { Box, LinearProgress, Typography } from '@mui/material'
import { QuestionFromMiddle } from '../../types/question-type'
import { MultipleQuestion } from './multiple-question'
import { SingularQuestion } from './singular-question'
import styles from './index.module.css'
import { mobileTextScaler } from '../../api/mobile-text-scaler'
import { isMobile } from '../../api/device-getter'

type Props = {
    question: QuestionFromMiddle['question'],
    answers: QuestionFromMiddle['answers'],
    correctAnswers: QuestionFromMiddle['correct_answers'],
    multipleCorrectAnswers: QuestionFromMiddle['multiple_correct_answers'],
    callback: (p: number) => void,
    finishQuiz: () => void,
    questionProcentCompleted: number,
}

export const Question = ({
    question,
    answers,
    correctAnswers,
    callback,
    multipleCorrectAnswers,
    finishQuiz,
    questionProcentCompleted,
}: Props) => {
    const multipleAnswers = multipleCorrectAnswers === 'true'
    const textWrapperToQuizAnswers = (text: string | number) =>
        mobileTextScaler(text.toString(), styles.HeaderText)

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
            {multipleAnswers && (
                <MultipleQuestion
                    question={question}
                    answers={answers}
                    correctAnswers={correctAnswers}
                    callback={callback}
                    secondsLeft={80}
                    finishQuiz={finishQuiz}
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
                />
            )}
        </div>
    )
}
