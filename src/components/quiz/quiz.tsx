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
import { getRecommendations } from '../../api/get-recommendations'
import { setStatisticsData as setStatisticsDataSlice, statisticsReducer } from '../../store/statistics/slice'
import { useNavigate } from 'react-router-dom'
import { getAllQuizInfo } from '../../store/chose-quiz-slice/selectors/quiz-load-selectors'

export const Quiz = () => {
    const [questionNumber, setQuestionNumber] = useState<number>(0)
    const [score, setScore] = useState<number[]>([])
    const [applicationData, setApplicationData] = useState([]);
    const navigate = useNavigate();
    // @ts-ignore
    const statisticsData = useSelector((state) => state.statistics.data)
    const allQuizInfo = useSelector(getAllQuizInfo);

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

    if (quizStage === 'LoadingStatistics') {
        // TODO: Указать критерии для объединения
        getRecommendations(questions.map(q => q.code), applicationData).then((respose) => {
            dispatch(setQuizStage('Statistics'))
            dispatch(setStatisticsDataSlice(respose.data));
            console.log(respose.data);
        })

        dispatch(setQuizStage('LoadingQuiz'))
    }

    if (quizStage === 'Statistics') {
        const handleStartAgainClick = () => {
            dispatch(setQuizStage('LoadingQuiz'))
            setScore([])
            setQuestionNumber(0)
            dispatch(setQuizStage('Quiz'))
        }

        dispatch(setQuizStage('Settings'))
        setScore([])
        setQuestionNumber(0)
        dispatch(setQuizQuestions([]))
        dispatch(setQuizStatusLoading())

        console.log(applicationData);
        console.warn(statisticsData);

        const result = statisticsData[0];
        const recommendation = statisticsData[1];
        //@ts-ignore
        const a = recommendation.reduce((previos, current) => ({...previos, [current[0]]: current[1]}), {})

        console.log('INFO')
        console.log(allQuizInfo);
        navigate(`/statistics/{"r":${result},"m":${allQuizInfo.grade},"q":` + JSON.stringify(allQuizInfo.criteria) + `,"a":` + JSON.stringify(a) + '}')
    }

    const handleResultCount = async () => {
        if (questionNumber + 1 === questions.length) {
            dispatch(setQuizStage('LoadingStatistics'))
        } else {
            setQuestionNumber((prevState) => {
                return prevState + 1
            })
        }
    }

    const handleScore = (result: []) => {
        setApplicationData((prevState) => prevState.concat(result));
        handleResultCount();
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
