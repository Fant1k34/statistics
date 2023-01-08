import axios from "axios";
import { Difficulty, QuizType } from "../types/quiz-types";
import MockAdapter from "axios-mock-adapter";
import * as dotenv from 'dotenv';

dotenv.config();

export const findQuizByParameters = async (topic: QuizType, difficulty: Difficulty) => {
    // @ts-ignore
    const API_KEY = process.env.API_KEY;
    const url = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=${topic}&difficulty=${difficulty}&limit=10`;

    // const mock = new MockAdapter(axios);

    // mock.onGet(url).replyOnce(200, {
    //     users: [{ id: 1, name: "John Smith" }],
    // });

    return await axios.get(url);
}