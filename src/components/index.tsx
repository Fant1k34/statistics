import React from "react";
import { createRoot } from "react-dom/client";
import { Quiz } from "./quiz/quiz";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Provider } from 'react-redux';
import { store } from '../store';
import styles from './index.module.css';

const QuizApplication = () => (
    <Provider store={store}>
        <div className={styles.innerContainer}>
            <Quiz />
        </div>
    </Provider>
);

const container = document.getElementById("app");
const root = createRoot(container as HTMLElement);

root.render(
    <div className={styles.outerContainer}>
        <QuizApplication />
    </div>
);