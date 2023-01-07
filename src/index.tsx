import React from "react";
import { createRoot } from "react-dom/client";
import { Quiz } from "./quiz/quiz";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const container = document.getElementById("app");
const root = createRoot(container as HTMLElement);
root.render(<Quiz />);