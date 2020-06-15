import { CURRENTUSER, ADDSCORE } from '../actionType'

const initialState = {
    currentUser: 'someone',
    score: []
}

export default function(state = initialState, action) {
    switch (action.type) {
        case CURRENTUSER:
            let newCurrentUser = action.payload
            return {
                ...state,
                currentUser: newCurrentUser
            }
        case ADDSCORE:
            let newScore = action.payload
            return {
                ...state,
                score: [...state.score, newScore]
            }
        default:
            return state
    }
}
