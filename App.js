// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import firebase and disableNetwork and enableNetwork
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// import Netinfo
import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";
import { LogBox, Alert } from "react-native";

// Impoprt environment variables from @env
import Config from 'react-native-config';

// import {
//   REACT_APP_FIREBASE_API_KEY,
//   REACT_APP_FIREBASE_AUTH_DOMAIN,
//   REACT_APP_FIREBASE_PROJECT_ID,
//   REACT_APP_FIREBASE_STORAGE_BUCKET,
//   REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   REACT_APP_FIREBASE_APP_ID
// } from "@env";

// Create the navigator
const Stack = createNativeStackNavigator();

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {
  // Your web app's Firebase configuration

  const firebaseConfig = {
    // apiKey: Config.REACT_APP_FIREBASE_API_KEY,
    // authDomain: Config.REACT_APP_FIREBASE_AUTH_DOMAIN,
    // projectId: Config.REACT_APP_FIREBASE_PROJECT_ID,
    // storageBucket: Config.REACT_APP_FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: Config.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    // appId: Config.REACT_APP_FIREBASE_APP_ID,

    apiKey: "AIzaSyA3_XzBqUgx9U_v2BnozF5JZAO-cS59nEc",
    authDomainauthDomain: "chatapp-a481d.firebaseapp.com",
    projectId: "chatapp-a481d",
    storageBucket: "chatapp-a481d.firebasestorage.app",
    messagingSenderId: "64517601247",
    appId: "1:64517601247:web:699cedb2597de1e24a766a"
  };

  // use useNetInfo() to define a new state that represent the network connectivity status:
  const connectionStatus = useNetInfo();

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  // Initialise handler to Firebase storage and get a reference to storage location
  const storage = getStorage(app);

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

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
          name="Chat">
          {props => <Chat isConnected={connectionStatus.isConnected}
            db={db}
            storage={storage}
            {...props} />}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;