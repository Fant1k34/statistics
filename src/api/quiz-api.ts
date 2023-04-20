import axios from 'axios'
import { Position, Grade } from '../types/quiz-types'
import * as dotenv from 'dotenv'

dotenv.config()

export const findQuizByParameters = async (
    position: Position,
    code: Grade
) => {

    const url = `http://localhost:5000/get-application-api/?position=${Position[position]}&code=${code}`

    return await axios.get(url)
}
