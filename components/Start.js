import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity } from 'react-native';


const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#FFFFFF');

    const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../assets/BackgroundImage.png")}
                resizeMode="cover"
                style={styles.image}>

                <Text style={styles.title}>Chit Chat Talk</Text>


                {/* Box Container */}
                <View style={styles.boxContainer}>
                    {/* Input Name */}
                    <TextInput
                        style={styles.TextInput}
                        value={name}
                        onChangeText={setName}
                        placeholder='Your Name'
                    />

                    {/* Chat Background Color */}
                    <View>
                        <Text style={styles.textcolor}>Choose Background color:</Text>
                        <View style={styles.colorbutton}>
                            {colors.map((bgColor) => (
                                <TouchableOpacity
                                    key={bgColor}
                                    style={{
                                        backgroundColor: bgColor,
                                        width: 50,
                                        height: 50,
                                        margin: 5,
                                        borderRadius: 25,
                                        borderColor: color === bgColor ? 'black' : 'transparent',
                                        borderWidth: 2,
                                    }}
                                    onPress={() => setColor(bgColor)}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Chatting Button */}
                    <TouchableOpacity
                        style={styles.Button}
                        onPress={() => navigation.navigate('Chat', { name: name, color })}>
                        <Text style={styles.ButtonText}>Start Chatting</Text>
                    </TouchableOpacity>

                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end', // 화면 하단으로 정렬v 

    },

    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'

    },

    title: {
        fontSize: 45,
        fontWeight: '600',
        color: '#FFFFFF',
        position: 'absolute',
        top: 80,
    },

    boxContainer: {
        width: "88%",

        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        marginBottom: 50,
        top: 180,
    },


    TextInput: {
        width: "88%",
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15,
        color: '#757083',

    },

    Button: {
        backgroundColor: '#b0acb5', // 원하는 배경색
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center', // 텍스트 가운데 정렬,
        width: "88%",
        marginTop: 15,
        marginBottom: 15,


    },

    ButtonText: {
        color: '#FFFFFF', // 텍스트 색상
        fontSize: 16,
        fontWeight: 'bold',
    },


    colorbutton: {
        flexDirection: 'row',
        marginVertical: 10
    },
    textcolor: {
        color: '#aba9a9'
    }

});

export default Start;