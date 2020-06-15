import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TextInput,
    Button,
    Alert
} from 'react-native'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { setBoard, addScore } from '../provider/action'

export default function Game({ route, navigation }) {
    const { difficulty } = route.params
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user.currentUser)
    const board = useSelector(state => state.board.board)
    const [userResult, setUserResult] = useState(board)
    const [waktu, setWaktu] = useState()
    // setUserResult([])
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

    const onChangeInput = (indexI, indexJ, value) => {
        let newBoard = userResult
        newBoard[indexI][indexJ] = +value
        setUserResult(newBoard)
    }

    const solveIt = () => {
        const data = { board }
        fetch('https://sugoku.herokuapp.com/solve', {
            method: 'POST',
            body: encodeParams(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(response => response.json())
            .then(response => {
                setUserResult(response.solution)
                // console.log(response.solution)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const checkIt = () => {
        const data = { board: userResult }
        axios
            .post('https://sugoku.herokuapp.com/validate', encodeParams(data), {
                'Content-Type': 'application/x-www-form-urlencoded'
            })
            .then(({ data }) => {
                if (data.status === 'solved') {
                    dispatch(
                        addScore({
                            user: currentUser,
                            score: waktu || 'anonymous'
                        })
                    )
                    Alert.alert(
                        'Mantap cuk',
                        'Jawabanmu dah bener',
                        [
                            {
                                text: 'OK',
                                onPress: () => navigation.navigate('Finish')
                            }
                        ],
                        { cancelable: false }
                    )
                } else {
                    Alert.alert(
                        'Wadoohh masi salah cuk',
                        'Coba lagi cuy coba lagiii...., masi ada waktu',
                        [
                            {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel'
                            },
                            {
                                text: 'OK',
                                onPress: () => console.log('OK Pressed')
                            }
                        ],
                        { cancelable: false }
                    )
                }
            })
            .catch(err => {
                console.log(err, 'ini error dr check answer')
            })
    }

    useEffect(() => {
        // if (userResult.length == 0) {
        if (difficulty === 'easy') {
            setWaktu(500)
        } else if (difficulty === 'medium') {
            setWaktu(700)
        } else if (difficulty === 'hard') {
            setWaktu(1000)
        }
        dispatch(setBoard(difficulty))
        setUserResult(JSON.parse(JSON.stringify(board)))
    }, [])
    useEffect(() => {
        setTimeout(() => {
            if (waktu > 1) {
                setWaktu(waktu - 1)
            } else if (waktu == 1) {
                const data = { board: userResult }
                window.clearTimeout()
                dispatch(
                    addScore({
                        user: currentUser || 'anonymous',
                        score: waktu
                    })
                )
                axios
                    .post(
                        'https://sugoku.herokuapp.com/validate',
                        encodeParams(data),
                        {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    )
                    .then(({ data }) => {
                        if (data.status === 'solved') {
                            Alert.alert(
                                'Mantap cuk',
                                'Jawabanmu dah bener',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () =>
                                            navigation.navigate('Finish')
                                    }
                                ],
                                { cancelable: false }
                            )
                        } else {
                            Alert.alert(
                                'Waktu habis cuy, jawan mu masi salah',
                                'Semoga di game selanjutnya bisa menang ya, jangan kalah mulu hehe',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () =>
                                            navigation.navigate('Finish')
                                    }
                                ],
                                { cancelable: false }
                            )
                        }
                    })
                    .catch(err => {
                        console.log(err, 'ini error dr check answer')
                    })
            }
        }, 1000)
    })

    return (
        <View style={styles.container}>
            <Text>
                Halo {currentUser} Kamu main di level {difficulty}{' '}
            </Text>
            {userResult ? (
                <FlatList
                    data={userResult}
                    renderItem={({ item, index }) => {
                        return (
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    borderColor: 'gray',
                                    borderWidth: 1
                                }}
                            >
                                {item.map((inputBoard, indexJ) => {
                                    return inputBoard == 0 ? (
                                        <TextInput
                                            style={textInputStyle}
                                            keyboardType={'numeric'}
                                            onChangeText={text =>
                                                onChangeInput(
                                                    index,
                                                    indexJ,
                                                    text
                                                )
                                            }
                                            key={indexJ}
                                            defaultValue={''}
                                            maxLength={1}
                                        />
                                    ) : (
                                        <TextInput
                                            style={{
                                                height: 40,
                                                borderColor: 'gray',
                                                borderWidth: 3,
                                                width: 40,
                                                textAlign: 'center',
                                                backgroundColor: 'green'
                                            }}
                                            keyboardType={'numeric'}
                                            onChangeText={text =>
                                                onChangeInput(
                                                    index,
                                                    indexJ,
                                                    text
                                                )
                                            }
                                            defaultValue={String(inputBoard)}
                                            maxLength={1}
                                            editable={false}
                                        />
                                    )
                                })}
                            </View>
                        )
                    }}
                    keyExtractor={item => item.id}
                ></FlatList>
            ) : (
                <Text> Sabar ya...... lagi loading</Text>
            )}
            <View style={{ marginBottom: 10 }}>
                <Text>{waktu}</Text>
                {/* <Button title="Apa ini hasilnya cuk" onPress={consolLog} /> */}
                <Button title="Solve it" onPress={solveIt} />
                <Button title="Check my answer" onPress={checkIt} />
                <Button
                    title="Nyerah gue susah cukk"
                    onPress={() => navigation.navigate('Finish')}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    }
})

let textInputStyle = {
    height: 40,
    borderColor: 'gray',
    borderWidth: 3,
    width: 40,
    textAlign: 'center'
}
