import axios from "axios";
import { Difficulty, QuizType } from "../types/quiz-types";
import * as dotenv from 'dotenv';

dotenv.config();

export const findQuizByParameters = async (topic: QuizType, difficulty: Difficulty) => {
    const API_KEY = process.env.API_KEY;
    const url = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=${topic}&difficulty=${difficulty}&limit=10`;

    return await axios.get(url);
}