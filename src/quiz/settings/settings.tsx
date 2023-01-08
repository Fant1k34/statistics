import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import styles from "./index.module.css";
import { QuizType, Difficulty } from "../../types/quiz-types";
import {
    Fade,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Paper,
    Popper,
    Select,
    Typography
} from "@mui/material";

type Props = {
    handleChoice: (topic: QuizType | undefined, difficulty: Difficulty | undefined) => void;
    popup: boolean;
    errorStatusChanger: () => void;
};

export const Settings = ({ handleChoice, popup, errorStatusChanger }: Props) => {
    const optionValues = Object.keys(QuizType).filter((v) => isNaN(Number(v)));
    const difficultyValues = Object.keys(Difficulty).filter((v) => isNaN(Number(v)));

    const [option, setOption] = useState<QuizType | undefined>(undefined);
    const [difficulty, setDifficulty] = useState<Difficulty | undefined>(undefined);
    const [timerId, setTimerId] = useState<number | null>(null);

    const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        handleChoice(option, difficulty);
        errorStatusChanger();
    }

    useEffect(() => {
        if (popup) {
            const timer = setTimeout(() => {
                errorStatusChanger();
            }, 5000);
            setTimerId(timer);

            return () => timerId ? clearTimeout(timerId) : undefined;
        }
    }, [popup]);

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
            <Button variant="contained" id='button-fetch-questions' onClick={(event) => handleButtonClick(event)}>
                Составить викторину
            </Button>
            <Popper open={popup} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper>
                            <Typography sx={{ p: 2 }}>The content of the Popper.</Typography>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </div>
    );
};