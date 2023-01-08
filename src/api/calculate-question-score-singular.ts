export const calculateQuestionScoreSingular = (
	correct: string | null,
	current: string | null
) => {
	return correct === current ? 1 : 0
}
