import React, { useState } from 'react';
import { Settings } from "./settings/settings";
import { QuizType, Difficulty } from "../types/quiz-types";
import { findQuizByParameters } from "../api/quiz-api";
import { Question } from "./question/question";
import { QuestionFromMiddle } from "../types/question-type";
import { Skeleton } from "@mui/material";
import styles from './index.module.css';
import {Statistics} from "../statistics/statistics";

type QuizStage = 'Settings' | 'LoadingQuiz' | 'Quiz' | 'Statistics';

export const Quiz = () => {
    const [quizStage, setQuizStage] = useState<QuizStage>('Settings');
    const [errorLoadingStatus, setErrorLoadingStatus] = useState(false);
    const [questions, setQuestions] = useState<QuestionFromMiddle[]>([]);
    const [questionNumber, setQuestionNumber] = useState<number>(0);
    const [score, setScore] = useState<number[]>([]);

    const handleChoice = (topic: QuizType | undefined, difficulty: Difficulty | undefined) => {
        setQuizStage('LoadingQuiz');
        findQuizByParameters(topic as QuizType, difficulty as Difficulty)
            .then((response) => {
                const data = response.data;
                setQuestions(data);
                setQuizStage('Quiz');
                setErrorLoadingStatus(false);
        })
            .catch(() => {
                setErrorLoadingStatus(true);
                setQuizStage('Settings');
            });
    };

    if (quizStage === 'Settings') {
        return <Settings errorStatusChanger={() => setErrorLoadingStatus(false)}
                         popup={errorLoadingStatus}
                         handleChoice={handleChoice}/>;
    }

    if (quizStage === 'LoadingQuiz') {
        return (
            <div className={styles.Skeleton}>
                <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                { [1, 2, 3].map(element => (
                    <div key={element} className={styles.AnswerRow}>
                        <Skeleton variant="circular" width={25} height={25} className={styles.logo}/>
                        <Skeleton variant="text" sx={{ fontSize: '0.5rem' }} className={styles.Text}/>
                    </div>
                    )
                )}
                <Skeleton variant="rounded" width={210} height={60} />
            </div>
        );
    }

    if (quizStage === 'Statistics') {
        // return <>Статистика: {}</>;
        const handleStartAgainClick = () => {
            setQuizStage('LoadingQuiz');
            setScore([]);
            setQuestionNumber(0);
            setQuizStage('Quiz');
        }
        const handleHomeButtonClick = () => {
            setQuizStage('Settings');
            setScore([]);
            setQuestionNumber(0);
            setQuestions([]);
            setErrorLoadingStatus(false);
        }
        return <Statistics result={score.reduce((a, b) => Math.round((a + b) * 100) / 100, 0)}
                           maximum={questions.length}
                           questions={questions.map(element => element.question)}
                           resultsByQuestions={score}
                           handleStartAgainClick={handleStartAgainClick}
                           handleHomeButtonClick={handleHomeButtonClick}
        />;
    }

    const questionToShow = questions[questionNumber];

    const handleScore = (result: number) => {
        setScore((prevState) => [...prevState, result]);
        if (questionNumber + 1 === questions.length) {
            setQuizStage('Statistics');
        }
        else {
            setQuestionNumber((prevState) => {
                return prevState + 1;
            });
        }
    };

    return <Question question={questionToShow.question}
                     answers={questionToShow.answers}
                     correctAnswers={questionToShow.correct_answers}
                     multipleCorrectAnswers={questionToShow.multiple_correct_answers}
                     callback={(result) => handleScore(result)}
                     finishQuiz={() => setQuizStage('Statistics')}
    />;

}