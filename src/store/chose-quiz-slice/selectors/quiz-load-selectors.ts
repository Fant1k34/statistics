export const choseSelector = (store: any) => store.choseQuiz

export const topicSelector = (store: any) => choseSelector(store).topic

export const difficultySelector = (store: any) =>
    choseSelector(store).difficulty

export const getQuizLoadingStatus = (store: any) => choseSelector(store).status
