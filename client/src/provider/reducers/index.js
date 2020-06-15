import { combineReducers } from 'redux'
import board from './board'
import user from './user'
export default combineReducers({
    board,
    user
})
