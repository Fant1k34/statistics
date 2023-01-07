import React, { useState } from "react";
import Button from "@mui/material/Button";
import styles from "./index.module.css";
import { QuizType, Difficulty } from "../../types/quiz-types";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Typography } from "@mui/material";

type Props = {
    handleChoice: (topic: QuizType | undefined, difficulty: Difficulty | undefined) => void;
};

export const Settings = ({ handleChoice }: Props) => {
    const optionValues = Object.keys(QuizType).filter((v) => isNaN(Number(v)));
    const difficultyValues = Object.keys(Difficulty).filter((v) => isNaN(Number(v)));

    const [option, setOption] = useState<QuizType | undefined>(undefined);
    const [difficulty, setDifficulty] = useState<Difficulty | undefined>(undefined);

    return (
        <div className={styles.Settings}>
            <Typography variant="h5" gutterBottom>
                Выбери тему и сложность викторины
            </Typography>
            <FormControl>
                <InputLabel>Category</InputLabel>
                <Select
                    value={option}
                    label="Category"
                    onChange={(event) => setOption(event.target.value as QuizType)}
                >
                    {
                        optionValues.map(categoryOption => <MenuItem value={categoryOption}>{categoryOption}</MenuItem>)
                    }
                </Select>
                <FormHelperText>Required</FormHelperText>
            </FormControl>
            <FormControl>
                <InputLabel>Difficulty</InputLabel>
                <Select
                    value={difficulty}
                    label="Difficulty"
                    onChange={(event) => setDifficulty(event.target.value as Difficulty)}
                >
                    {
                        difficultyValues.map(difficulty => <MenuItem value={difficulty}>{difficulty}</MenuItem>)
                    }
                </Select>
                <FormHelperText>Required</FormHelperText>
            </FormControl>
            <Button variant="contained" onClick={() => handleChoice(option, difficulty)}>Составить викторину</Button>
        </div>
    );
};