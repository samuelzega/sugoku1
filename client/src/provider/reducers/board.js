import { SETBOARD, SETDIFFICULTY } from '../actionType'

const initialState = {
    board: [],
    difficulty: 'easy'
}

export default function(state = initialState, action) {
    switch (action.type) {
        case SETBOARD:
            let newBoard = action.payload
            console.log(newBoard)
            return {
                ...state,
                board: newBoard
            }
        case SETDIFFICULTY:
            let newDifficulty = action.payload
            return {
                ...state,
                board: newDifficulty
            }
        default:
            return state
    }
}
