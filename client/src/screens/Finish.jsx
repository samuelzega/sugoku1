import React from 'react'
import { View, Text, Button } from 'react-native'
import { useSelector } from 'react-redux'

export default function Finish({ navigation }) {
    const score = useSelector(state => state.user.score)

    function compare(a, b) {
        // Use toUpperCase() to ignore character casing
        const userA = a.score
        const userB = b.score

        let comparison = 0
        if (userA < userB) {
            comparison = 1
        } else if (userA > userB) {
            comparison = -1
        }
        return comparison
    }
    score.sort(compare)

    return (
        <View>
            <Text>Daftar urutan pemain</Text>
            {score.map(userScore => {
                return (
                    <View>
                        <Text>User: {userScore.user}</Text>
                        <Text>User: {userScore.score}</Text>
                    </View>
                )
            })}
            <Button
                title="Main lagi kuy"
                onPress={() => navigation.navigate('Home')}
            />
        </View>
    )
}
