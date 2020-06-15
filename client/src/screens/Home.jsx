import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Button, Picker } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentUser } from '../provider/action'

export default function Home({ navigation }) {
    const [inputName, setInputName] = useState('')
    const [difficulty, setDifficulty] = useState('easy')
    const currentUser = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch()
    const enterGame = () => {
        dispatch(setCurrentUser(inputName.text))
        setInputName('')
        navigation.navigate('Game', {
            difficulty: difficulty
        })
    }
    return (
        <View style={styles.container}>
            <Text>Please Input your Name</Text>

            <TextInput
                style={styles.inputName}
                onChangeText={text => setInputName({ text })}
                placeholder="Please Input your name"
            />
            <Picker
                selectedValue={difficulty}
                style={{ height: 50, width: 100 }}
                onValueChange={(itemValue, itemIndex) =>
                    setDifficulty(itemValue)
                }
            >
                <Picker.Item label="Easy" value="easy" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="Hard" value="hard" />
            </Picker>
            <Button title="Enter The Game" onPress={enterGame} />
            <Text>Your Name is {currentUser}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputName: {
        minHeight: 40,
        borderBottomColor: '#000000',
        borderBottomWidth: 1
    }
})
