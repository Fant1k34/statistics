import { Answer } from "../types/question-type";

export const calculateQuestionScore = (correct: Answer, current: Answer) => {
    console.log("CORRECT");
    console.log(correct);
    console.log("CURRENT");
    console.log(current);
    return 0.7;
};