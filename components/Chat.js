import { collection, onSnapshot, orderBy, query, addDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, BackHandler, KeyboardAvoidingView, ImageBackground, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, renderActions } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';
import { getAuth, signInAnonymously } from 'firebase/auth';

const Chat = ({ route, navigation, storage, db, isConnected }) => {
    const [messages, setMessages] = useState([]);
    const { name, color, userID } = route.params;

    let unsubMessages;

    useEffect(() => {
        navigation.setOptions({ title: name });

        if (isConnected === true) {
            if (unsubMessages) unsubMessages();
            unsubMessages = null;

            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, (docs) => {
                let newMessages = [];
                docs.forEach(doc => {
                    newMessages.push({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis())
                    })
                });
                cacheMessages(newMessages);
                setMessages(newMessages);
            })
        } else loadCachedMessages();

        // Clean up code
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, [isConnected]);

    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    }

    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        setMessages(JSON.parse(cachedMessages));
    }

    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), { user: { _id: userID, name: name }, createdAt:new Date(), ...newMessages[0] })
        .then(()=> {
            console.log("Message sent successfully!");
        })
        .catch((error)=> {
            console.error("Error sending message: ", error);
        });
    };

    const renderBubble = (props) => {
        return (<Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#000"
                },
                left: {
                    backgroundColor: "#FFF"
                }
            }}
        />
        );
    }

    const renderInputToolbar = (props) => {
        if (isConnected === true)
            return <InputToolbar {...props} />;
        else
            return null;
    }

    // creating the circle button
    const renderCustomActions = (props) => {
        return <CustomActions storage={storage} userID={userID} onSend={(message) => onSend([message])} {...props} />;
    };


    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    // Sign in anonymously 
    const auth = getAuth();
    signInAnonymously(auth)
        .then(() => {
            console.log("User signed in anonymously");
            // Now proceed with uploading images
        })
        .catch((error) => {
            console.error("Error signing in:", error);
        });

    return (
        <View style={[styles.container, { backgroundColor: color }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                onSend={messages => onSend(messages)}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                user={{
                    _id: userID,
                    name: name,
                }}
            />

            {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    logoutButton: {
        position: "absolute",
        right: 0,
        top: 0,
        backgroundColor: "#C00",
        padding: 10,
        zIndex: 1
    },
    logoutButtonText: {
        color: "#FFF",
        fontSize: 10
    }
});

export default Chat;