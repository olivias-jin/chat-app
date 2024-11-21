import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();

// import firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const App = () => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA3_XzBqUgx9U_v2BnozF5JZAO-cS59nEc",
    authDomain: "chatapp-a481d.firebaseapp.com",
    projectId: "chatapp-a481d",
    storageBucket: "chatapp-a481d.firebasestorage.app",
    messagingSenderId: "64517601247",
    appId: "1:64517601247:web:699cedb2597de1e24a766a"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;