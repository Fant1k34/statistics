import React, { useEffect, useRef, useState } from 'react'
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
import { mobileTextScaler } from "../../api/mobile-text-scaler";
import {
    setQuizDifficulty,
    setQuizStatusLoading,
    setQuizTopic,
} from '../../store/chose-quiz-slice/chose-quiz-slice'
import { loadQuizesThunk } from '../../store/chose-quiz-slice/thunks/load-quizes-thunk'
import { useDispatch, useSelector } from 'react-redux'
import { getQuizLoadingStatus } from '../../store/chose-quiz-slice/selectors/quiz-load-selectors'

export const Settings = () => {
    const optionValues = Object.keys(QuizType).filter((v) => isNaN(Number(v)));
    const difficultyValues = Object.keys(Difficulty).filter((v) => isNaN(Number(v)));

    const [option, setOption] = useState<QuizType | undefined>(undefined);
    const [difficulty, setDifficulty] = useState<Difficulty | undefined>(undefined);
    const [timerId, setTimerId] = useState<number | null>(null);
    const popup = useSelector(getQuizLoadingStatus) === 'error';
    const anchor = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch();


    const handleButtonClick = () => {
        dispatch(setQuizTopic(option));
        dispatch(setQuizDifficulty(difficulty));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dispatch(loadQuizesThunk());
    }

    useEffect(() => {
        if (popup) {
            const timer = window.setTimeout(() => {
                dispatch(setQuizStatusLoading());
            }, 5000);
            setTimerId(timer);

            return () => timerId ? clearTimeout(timerId) : undefined;
        }
    }, [popup]);

    const textWrapperToSettings = (text: string | number) => mobileTextScaler(text.toString(), styles.SettingsText);

    return (
        <div className={styles.Settings}>
            <Typography variant="h5" gutterBottom>
                {textWrapperToSettings("Choose topic and get quiz")}
            </Typography>
            <FormControl>
                <InputLabel>{textWrapperToSettings("Category")}</InputLabel>
                <Select
                    value={option}
                    label="Category"
                    onChange={(event) => setOption(event.target.value as QuizType)}
                >
                    {
                        optionValues.map(categoryOption => <MenuItem key={categoryOption} value={categoryOption}>{textWrapperToSettings(categoryOption)}</MenuItem>)
                    }
                </Select>
                <FormHelperText>{textWrapperToSettings("Required")}</FormHelperText>
            </FormControl>
            <FormControl>
                <InputLabel>{textWrapperToSettings("Difficulty")}</InputLabel>
                <Select
                    value={difficulty}
                    label="Difficulty"
                    onChange={(event) => setDifficulty(event.target.value as Difficulty)}
                >
                    {
                        difficultyValues.map(difficulty => <MenuItem key={difficulty} value={difficulty}>{textWrapperToSettings(difficulty)}</MenuItem>)
                    }
                </Select>
                <FormHelperText>{textWrapperToSettings("Required")}</FormHelperText>
            </FormControl>
            <div ref={anchor}>
                <Button variant="contained" id="button-fetch-questions" onClick={() => handleButtonClick()} className={styles.StartButton}>
                    {mobileTextScaler("Get quiz", styles.ButtonGetQuizText)}
                </Button>
            </div>
            <Popper open={popup} anchorEl={anchor.current} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper>
                            <Typography sx={{ p: 2 }}>{textWrapperToSettings("Failed test loading. Try again with another parameters")}</Typography>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </div>
    );
};