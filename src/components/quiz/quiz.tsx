import React, { useState, useRef } from 'react'
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
    const previousQuestionCode = useRef<string>();
    const statisticsData = useSelector((state) => state.statistics.data)
    const allQuizInfo = useSelector(getAllQuizInfo);
    const allCodes = [
        "1.1",
        "1.2",
        "1.3",
        "1.4",
        "1.5",
        "1.6",
        "1.7",
        "2.1",
        "2.2",
        "2.3",
        "2.4",
        "2.5",
        "2.6",
        "2.7",
        "2.8",
        "2.9",
        "2.10",
        "2.11",
        "2.12",
        "2.13",
        "2.14",
        "2.15",
        "2.16",
        "3.1",
        "4.1",
        "4.2",
        "4.3",
        "4.4"
    ];

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
        getRecommendations(allQuizInfo.criteria, applicationData, allQuizInfo.grade).then((respose) => {
            dispatch(setQuizStage('Statistics'))
            dispatch(setStatisticsDataSlice(respose.data));
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

        const result = statisticsData[0];
        const recommendation = statisticsData[1];
        //@ts-ignore
        const a = recommendation.reduce((previos, current) => ({...previos, [current[0]]: current[1]}), {})

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

    const handleScore = (question: any, result: []) => {
        let toReduce;

        if (!previousQuestionCode.current) {
            toReduce = allCodes.slice(0, allCodes.indexOf(question.code));
        }
        else {
            toReduce = allCodes.slice(allCodes.indexOf(previousQuestionCode.current) + 1, allCodes.indexOf(question.code));
        }

        const arrayToAdd = toReduce.reduce((previousValue: any, currentValue: string) => {
            if (currentValue === question.code) {
                return previousValue;
            }
            return [...previousValue, "x"]
        }, []);
        previousQuestionCode.current = question.code;
        setApplicationData((prevState) => prevState.concat(arrayToAdd));

        setApplicationData((prevState) => prevState.concat(result));
        handleResultCount();
    }

    if (!question) {
        throw new Error('Something went wrong')
    }

    return (
        <Question
            question={question.question}
            answers={question.answers}
            correctAnswers={question.correctAnswers}
            multipleCorrectAnswers={question.multipleCorrectAnswers}
            callback={(result) => handleScore(question, result)}
            questionProcentCompleted={(questionNumber / questions.length) * 100}
            additional={question.documents}
            documents={question.additional}
        />
    )
}
