import { Answer } from "../types/question-type";

export const calculateQuestionScoreMultiple = (correct: Answer, current: Answer) => {
    const sumScore = Object.entries(correct).reduce((previousValue, currentValue) => {
        const tag = currentValue[0];
        const correctAnswer = currentValue[1];

        if (current[tag] === undefined || current[tag] === null) {
            throw new Error("Something went wrong. Answers texts are different");
        }

        console.log("Сравнение");
        return current[tag] === correctAnswer ? previousValue + 1 : previousValue;
    }, 0);
    return sumScore / Object.values(correct).length;
};