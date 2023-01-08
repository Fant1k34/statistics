import axios from "axios";
import { Difficulty, QuizType } from "../types/quiz-types";
import MockAdapter from "axios-mock-adapter";

export const findQuizByParameters = async (topic: QuizType, difficulty: Difficulty) => {
    const API_KEY = 'QVwfx6aoUxPBJXz5ytq02yHvTjPu2tBWixo2D877';
    const url = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=${topic}&difficulty=${difficulty}&limit=10`;

    // const mock = new MockAdapter(axios);

    // mock.onGet(url).replyOnce(200, {
    //     users: [{ id: 1, name: "John Smith" }],
    // });

    return await axios.get(url);
}