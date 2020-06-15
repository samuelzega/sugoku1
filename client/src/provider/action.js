import { SETBOARD, CURRENTUSER, ADDSCORE } from './actionType'
import axios from 'axios'

const encodeBoard = board =>
    board.reduce(
        (result, row, i) =>
            result +
            `%5B${encodeURIComponent(row)}%5D${
                i === board.length - 1 ? '' : '%2C'
            }`,
        ''
    )

const encodeParams = params =>
    Object.keys(params)
        .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
        .join('&')

export const setBoard = difficulty => {
    return dispatch => {
        axios
            .get(`https://sugoku.herokuapp.com/board?difficulty=${difficulty}`)
            .then(({ data }) => {
                dispatch({
                    type: SETBOARD,
                    payload: data.board
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
}

export const solve = board => {
    console.log(board, 'ini dari action')
    const data = { board }
    fetch('https://sugoku.herokuapp.com/solve', {
        method: 'POST',
        body: encodeParams(data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
        .then(response => response.json())
        .then(response => {
            console.log(response, 'ini adlah respones dari action')

            return response.solution
        })
        .catch(err => {
            console.log(err)
            return
        })
}

export const checkAnswer = board => {
    axios
        .post('https://sugoku.herokuapp.com/validate', {
            data: board
        })
        .then(({ data }) => {
            console.log(data, 'ini hasil dr check answer')
        })
        .catch(err => {
            console.log(err, 'ini error dr check answer')
        })
}

export const setCurrentUser = userName => ({
    type: CURRENTUSER,
    payload: userName
})

export const addScore = userScore => ({
    type: ADDSCORE,
    payload: userScore
})
