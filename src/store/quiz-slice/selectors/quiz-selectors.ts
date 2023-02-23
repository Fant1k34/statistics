const quizSelector = (store: any) => store.quiz

export const quizStageSelector = (store: any) => quizSelector(store).quizStage

export const getAllQuestions = (store: any) => quizSelector(store).questions
