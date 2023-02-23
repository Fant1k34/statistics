import React from "react";
import { createRoot } from "react-dom/client";
import { Quiz } from "./quiz/quiz";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Provider } from 'react-redux';
import { store } from '../store'

const container = document.getElementById("app");
const root = createRoot(container as HTMLElement);
root.render(<Provider store={store}>
                <Quiz />
            </Provider>);