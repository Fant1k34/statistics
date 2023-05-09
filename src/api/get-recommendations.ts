import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

export const getRecommendations = async (
    allCriteria: string[],
    allValues: any,
    pointsGoal: number,
) => {
    const result = allCriteria.reduce((previousValue, currentValue, currentIndex) => (
    { ...previousValue,
        [currentValue]: allValues[currentIndex],
    }), {})
    console.log('Объединенные критерии')
    console.log(result);

    // const url = `http://localhost:5000/?minimal_prirost=${pointsGoal}`;
    const url = `https://diplomadiploma.pythonanywhere.com/?minimal_prirost=${pointsGoal}`;

    return await axios.post(url, result);
}
