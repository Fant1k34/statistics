export type QuestionToShow = {
    /**
     * answer_number: description
     */
    answers: {
        [p: string]: string,
    },
    /**
     * answer_number: true/false
     */
    correctAnswers: {
        [p: string]: boolean,
    },
    multipleCorrectAnswers: boolean,
    question: string,
}

export type QuestionFromMiddle = {
    /**
     * answer_number: description
     */
    answers: {
        [p: string]: string,
    },
    /**
     * answer_number: 'true/false'
     */
    correct_answers: {
        [p: string]: string,
    },
    multiple_correct_answers: string,
    question: string,
}

export type Answer = {
    [p: string]: boolean,
}
