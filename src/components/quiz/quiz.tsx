import React, { useState } from 'react'
import { Settings } from '../settings/settings'
import { Question } from '../question/question'
import { QuestionFromMiddle, QuestionToShow } from '../../types/question-type'
import { Skeleton } from '@mui/material'
import styles from './index.module.css'
import { Statistics } from '../statistics/statistics'
import { useDispatch, useSelector } from 'react-redux'
import {
    setQuizQuestions,
    setQuizStage,
} from '../../store/quiz-slice/quiz-slice'
import {
    getAllQuestions,
    quizStageSelector,
} from '../../store/quiz-slice/selectors/quiz-selectors'
import { questionFromMiddleToQuestionToShowMapper } from '../../api/question-from-middle-to-question-to-show-mapper'
import { setQuizStatusLoading } from '../../store/chose-quiz-slice/chose-quiz-slice'

export const Quiz = () => {
    const [questionNumber, setQuestionNumber] = useState<number>(0)
    const [score, setScore] = useState<number[]>([])
    const [applicationData, setApplicationData] = useState([]);

    const dispatch = useDispatch()
    const quizStage = useSelector(quizStageSelector)

    const questions: QuestionToShow[] = useSelector(getAllQuestions).map(
        (element: QuestionFromMiddle) =>
            questionFromMiddleToQuestionToShowMapper(element)
    )
    const question: QuestionToShow | null =
        questions.length != 0 ? questions[questionNumber] : null

    if (quizStage === 'Settings') {
        return <Settings />
    }

    if (quizStage === 'LoadingQuiz') {
        return (
            <div className={styles.Skeleton}>
                <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                {[1, 2, 3].map((element) => (
                    <div key={element} className={styles.AnswerRow}>
                        <Skeleton
                            variant="circular"
                            width={25}
                            height={25}
                            className={styles.logo}
                        />
                        <Skeleton
                            variant="text"
                            sx={{ fontSize: '0.5rem' }}
                            className={styles.Text}
                        />
                    </div>
                ))}
                <Skeleton variant="rounded" width={210} height={60} />
            </div>
        )
    }

    if (quizStage === 'Statistics') {
        const handleStartAgainClick = () => {
            dispatch(setQuizStage('LoadingQuiz'))
            setScore([])
            setQuestionNumber(0)
            dispatch(setQuizStage('Quiz'))
        }
        const handleHomeButtonClick = () => {
            dispatch(setQuizStage('Settings'))
            setScore([])
            setQuestionNumber(0)
            dispatch(setQuizQuestions([]))
            dispatch(setQuizStatusLoading())
        }

        console.log(applicationData);

        return (
            <Statistics
                result={score.reduce(
                    (a, b) => Math.round((a + b) * 100) / 100,
                    0
                )}
                maximum={questions.length}
                questions={questions.map((element) => element.question)}
                resultsByQuestions={score}
                handleStartAgainClick={handleStartAgainClick}
                handleHomeButtonClick={handleHomeButtonClick}
            />
        )
    }

    const handleScore = (result: []) => {
        setApplicationData((prevState) => prevState.concat(result));
        if (questionNumber + 1 === questions.length) {
            dispatch(setQuizStage('Statistics'))
        } else {
            setQuestionNumber((prevState) => {
                return prevState + 1
            })
        }
    }

    if (!question) {
        throw new Error('Something went wrong')
    }

    console.warn(applicationData);

    return (
        <Question
            question={question.question}
            answers={question.answers}
            correctAnswers={question.correctAnswers}
            multipleCorrectAnswers={question.multipleCorrectAnswers}
            callback={(result) => handleScore(result)}
            questionProcentCompleted={(questionNumber / questions.length) * 100}
        />
    )
}
