import React, { useEffect, useRef, useState } from 'react'
import Button from "@mui/material/Button";
import styles from "./index.module.css";
import { Position, Grade } from "../../types/quiz-types";
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
    const optionValues = Object.keys(Position).filter((v) => isNaN(Number(v)));
    const difficultyValues = Object.keys(Grade).filter((v) => isNaN(Number(v)));

    const [option, setOption] = useState<Position | undefined>(undefined);
    const [difficulty, setDifficulty] = useState<Grade | undefined>(undefined);
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
                {textWrapperToSettings("Выберите параметры для подсчета баллов и рекомендаций критериев")}
            </Typography>
            <FormControl>
                <InputLabel>{textWrapperToSettings("Должность")}</InputLabel>
                <Select
                    value={option}
                    label="Должность"
                    onChange={(event) => setOption(event.target.value as Position)}
                >
                    {
                        optionValues.map(categoryOption => <MenuItem key={categoryOption} value={categoryOption}>{textWrapperToSettings(categoryOption)}</MenuItem>)
                    }
                </Select>
                <FormHelperText>{textWrapperToSettings("Обязательно")}</FormHelperText>
            </FormControl>
            <FormControl>
                <InputLabel>{textWrapperToSettings("Категория")}</InputLabel>
                <Select
                    value={difficulty}
                    label="Категория"
                    onChange={(event) => setDifficulty(event.target.value as Grade)}
                >
                    {
                        difficultyValues.map(difficulty => <MenuItem key={difficulty} value={difficulty}>{textWrapperToSettings(difficulty)}</MenuItem>)
                    }
                </Select>
                <FormHelperText>{textWrapperToSettings("Обязательно")}</FormHelperText>
            </FormControl>
            <div ref={anchor}>
                <Button variant="contained" id="button-fetch-questions" onClick={() => handleButtonClick()} className={styles.StartButton}>
                    {mobileTextScaler("Начать", styles.ButtonGetQuizText)}
                </Button>
            </div>
            <Popper open={popup} anchorEl={anchor.current} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper>
                            <Typography sx={{ p: 2 }}>{textWrapperToSettings("Не получилось подготовить форму. Попробуйте снова с другими параметрами")}</Typography>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </div>
    );
};