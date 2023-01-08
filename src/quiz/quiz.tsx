import React, {useEffect, useState} from 'react';
import { Settings } from "./settings/settings";
import { QuizType, Difficulty } from "../types/quiz-types";
import { findQuizByParameters } from "../api/quiz-api";
import { Question } from "./question/question";
import { QuestionFromMiddle } from "../types/question-type";

type QuizStage = 'Settings' | 'LoadingQuiz' | 'Quiz' | 'Statistics';

type Parameters = {
    topic: QuizType | undefined;
    difficulty: Difficulty | undefined;
};

export const Quiz = () => {
    const [quizStage, setQuizStage] = useState<QuizStage>('Settings');
    const [errorLoadingStatus, setErrorLoadingStatus] = useState(false);
    const [questions, setQuestions] = useState<object[]>([]);
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
            .catch(error => {
                console.log("I AM HERE");
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
        return <></>;
    }

    if (quizStage === 'Statistics') {
        return <>Статистика: {score.reduce((a, b) => Math.round((a + b) * 100) / 100, 0)}</>;
    }

    const questionToShow = questions[questionNumber] as QuestionFromMiddle;

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