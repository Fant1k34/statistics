import React from "react";
import { createRoot } from "react-dom/client";
import { Quiz } from "./quiz/quiz";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Provider } from 'react-redux';
import { store } from '../store';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import styles from './index.module.css';
import { Statistics } from '../statistics/statistics'

const QuizApplication = () => (
    <Provider store={store}>
        <div className={styles.innerContainer}>
            <Quiz />
        </div>
    </Provider>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <QuizApplication />,
    },
    {
        path: "/statistics/:code",
        element: <Statistics />,
    },
]);

const container = document.getElementById("app");
const root = createRoot(container as HTMLElement);

root.render(
    <div className={styles.outerContainer}>
        <RouterProvider router={router} />
    </div>
);