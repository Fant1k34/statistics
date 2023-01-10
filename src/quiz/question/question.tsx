import React from 'react'
import { Typography } from '@mui/material'
import { QuestionFromMiddle } from '../../types/question-type'
import { MultipleQuestion } from './multiple-question'
import { SingularQuestion } from './singular-question'
import styles from './index.module.css'
import { mobileTextScaler } from "../../api/mobile-text-scaler";

type Props = {
	question: QuestionFromMiddle['question'],
	answers: QuestionFromMiddle['answers'],
	correctAnswers: QuestionFromMiddle['correct_answers'],
	multipleCorrectAnswers: QuestionFromMiddle['multiple_correct_answers'],
	callback: (p: number) => void,
	finishQuiz: () => void,
}

export const Question = ({
	question,
	answers,
	correctAnswers,
	callback,
	multipleCorrectAnswers,
	finishQuiz,
}: Props) => {
	const multipleAnswers = multipleCorrectAnswers === 'true'
	const textWrapperToQuizAnswers = (text: string | number) => mobileTextScaler(text.toString(), styles.HeaderText);

	return (
		<div className={styles.Questions}>
			<Typography variant="h5">{textWrapperToQuizAnswers(question)}</Typography>
			{multipleAnswers && (
				<MultipleQuestion
					question={question}
					answers={answers}
					correctAnswers={correctAnswers}
					callback={callback}
					secondsLeft={80}
					finishQuiz={finishQuiz}
				/>
			)}
			{!multipleAnswers && (
				<SingularQuestion
					question={question}
					answers={answers}
					correctAnswers={correctAnswers}
					callback={callback}
					secondsLeft={80}
					finishQuiz={finishQuiz}
				/>
			)}
		</div>
	)
}
