import React, { useCallback, useEffect, useState } from 'react'
import { QuestionFromMiddle, QuestionToShow } from '../../types/question-type'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import Button from '@mui/material/Button'
import { calculateQuestionScoreMultiple } from '../../api/calculate-question-score-multiple'
import { toTimeString } from '../../api/time'
import styles from './index.module.css'

type Props = {
	question: QuestionFromMiddle['question'],
	answers: QuestionFromMiddle['answers'],
	correctAnswers: QuestionFromMiddle['correct_answers'],
	callback: (p: number) => void,
	secondsLeft: number,
	finishQuiz: () => void,
}

export const MultipleQuestion = ({
	question,
	answers,
	correctAnswers,
	callback,
	secondsLeft,
	finishQuiz,
}: Props) => {
	const correctAnswersQuestion: QuestionToShow['correctAnswers'] =
		Object.entries(correctAnswers).reduce((previousValue, currentValue) => {
			return {
				...previousValue,
				[currentValue[0]]: currentValue[1] === 'true',
			}
		}, {})

	const initialStateUserAnswers = useCallback(
		() =>
			Object.entries(answers).reduce((previousValue, currentValue) => {
				// Get answer text as a key
				return currentValue[1]
					? {
							...previousValue,
							[currentValue[1]]: false,
					  }
					: previousValue
			}, {}),
		[question, answers, correctAnswers, callback]
	)
	const [userAnswers, setUserAnswers] = useState<
		QuestionToShow['correctAnswers']
	>(initialStateUserAnswers)
	const [time, setTime] = useState<number>(secondsLeft)
	const [timerId, setTimerId] = useState<number | null>(null)
	const [timerColor, setTimerColor] = useState<'secondary' | 'error'>(
		'secondary'
	)

	useEffect(() => {
		const timerId = window.setTimeout(() => {
			if (time === 0) handleSubmitButton()
			setTime((time) => (time === 0 ? 0 : time - 1))
		}, 1000)
		setTimerId(timerId)

		if (time <= 10) {
			setTimerColor('error')
		}
	}, [time])

	useEffect(() => {
		setUserAnswers(initialStateUserAnswers)
		if (timerId) clearTimeout(timerId)
		setTime(secondsLeft)
		setTimerColor('secondary')
	}, [answers, question])

	const handleChoiceClick = (answer: string) => {
		console.log(answer)
		setUserAnswers((prevState: QuestionToShow['correctAnswers']) => {
			return {
				...prevState,
				[answer]: !prevState[answer],
			}
		})
	}

	const handleSubmitButton = () => {
		// Change answer_number as a key to answer text as a key
		const correct = Object.entries(correctAnswersQuestion).reduce(
			(previousValue, currentValue) => {
				// Get name of question by id that finds by cutting "_correct" part of currentValue tag
				const tag =
					answers[
						currentValue[0].slice(0, currentValue[0].length - 8)
					]
				return tag
					? {
							...previousValue,
							[tag]: currentValue[1],
					  }
					: previousValue
			},
			{}
		)
		callback(calculateQuestionScoreMultiple(correct, userAnswers))
	}

	return (
		<>
			<FormGroup>
				{Object.entries(userAnswers).map((option) => {
					console.warn(userAnswers)
					return option ? (
						<FormControlLabel
							control={
								<Checkbox
									onClick={() => handleChoiceClick(option[0])}
									checked={option[1]}
								/>
							}
							label={option}
						/>
					) : undefined
				})}
			</FormGroup>
			<div className={styles.footer}>
				<Button
					variant="contained"
					onClick={() => handleSubmitButton()}
					className={styles.submitFormButton}
				>
					Submit answer
				</Button>
				<Button onClick={() => finishQuiz()} className={styles.finishQuizButton}>Finish Quiz</Button>
				<Button variant="outlined" color={timerColor} className={styles.timer}>
					{toTimeString(time)}
				</Button>
			</div>
		</>
	)
}
