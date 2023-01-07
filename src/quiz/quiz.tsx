import React, { useState } from 'react';
import { Settings } from "./settings/settings";
import { QuizType, Difficulty } from "../types/quiz-types";
import { findQuizByParameters } from "../api/quiz-api";
import { Question } from "./question/question";
import { QuestionFromMiddle, QuestionToShow } from "../types/question-type";

type QuizStage = 'Settings' | 'LoadingQuiz' | 'Quiz';

type Parameters = {
    topic: QuizType | undefined;
    difficulty: Difficulty | undefined;
};

export const Quiz = () => {
    const [quizStage, setQuizStage] = useState<QuizStage>('Settings');
    const [param, setParam] = useState<Parameters>({
        topic: undefined,
        difficulty: undefined
    });
    const [questions, setQuestions] = useState<object[]>([]);
    const [questionNumber, setQuestionNumber] = useState<number>(0);
    const [score, setScore] = useState<number[]>([]);

    const handleChoice = (topic: QuizType | undefined, difficulty: Difficulty | undefined) => {
        setParam({
            topic,
            difficulty,
        });
        setQuizStage('LoadingQuiz');
        findQuizByParameters(topic as QuizType, difficulty as Difficulty).then((data) => {
            setQuestions(data);
            setQuizStage('Quiz');
            console.log(data);
        });
    };

    if (quizStage === 'Settings') {
        return <Settings handleChoice={handleChoice}></Settings>;
    }

    if (quizStage === 'LoadingQuiz') {
        return <></>;
    }

    const questionToShow = questions[questionNumber] as QuestionFromMiddle;

    const handleScore = (result: number) => {
        setScore((prevState) => [...prevState, result]);
        setQuestionNumber((prevState) => prevState + 1);
    };

    console.log(score);

    return <Question question={questionToShow.question}
                     answers={questionToShow.answers}
                     correctAnswers={questionToShow.correct_answers}
                     multipleCorrectAnswers={questionToShow.multiple_correct_answers}
                     callback={(result) => handleScore(result)}/>;
}