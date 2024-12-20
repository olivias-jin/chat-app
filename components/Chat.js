import { collection, onSnapshot, orderBy, query, addDoc, where } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, BackHandler, KeyboardAvoidingView, ImageBackground, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {
    const [messages, setMessages] = useState([]);
    const { name, color, userID } = route.params;

    let unsubMessages;
    useEffect(() => {
        if (isConnected === true) {
            if (unsubMessages) unsubMessages();
            unsubMessages = null;

            navigation.setOptions({ title: name });

            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, (docs) => {
                let newMessages = [];
                docs.forEach(doc => {
                    newMessages.push({
                        id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt.toMillis())
                    })
                });
                cacheMessages(newMessages);
                setMessages(newMessages);
            });
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
    };

    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        setMessages(JSON.parse(cachedMessages));
    }

    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0])
    };

    const renderBubble = (props) => {
        return <Bubble
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
    }

    const renderInputToolbar = (props) => {
        if (isConnected)
            return <InputToolbar {...props} />;
        else
            return null;
    }

    return (
        <View style={{ flex: 1, backgroundColor: color }}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID
                }}
                renderInputToolbar={renderInputToolbar}
            />
            {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Chat;