import { TouchableOpacity, Text, View, StyleSheet, Alert } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
    const actionSheet = useActionSheet();

    const onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;

        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        return;
                    case 1:
                        takePhoto();
                        return;
                    case 2:
                        getLocation();
                    default:
                }
            },
        );
    };

    // Function to generate a unique reference for an image based on user ID, current timestamp, and image name
    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        return `${userID}-${timeStamp}-${imageName}`;
    };

    // Function to upload an image to Firebase Storage and send its URL
    const uploadAndSendImage = async (imageURI) => {
        const uniqueRefString = generateReference(imageURI);
        const newUploadRef = ref(storage, uniqueRefString);
        const response = await fetch(imageURI);
        // Convert the image data into a Blob
        const blob = await response.blob();
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
            try {
                const imageURL = await getDownloadURL(snapshot.ref);
                onSend({ image: imageURL, _id: uniqueRefString });
            } catch (error) {
                console.log('Error getting download URL:', error);
            }
        })
        .catch((error) => {
            console.log('Error during image upload:', error);
        });
    };

    // Function to pick an image from the device's media library
    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log('Image Library Permissions:', permissions);
        if (permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync();
            console.log('Image pick result:', result);
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
        } else Alert.alert("Permissions haven't been granted.");
    };

    // Function to take a photo using the device's camera
    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        console.log('Camera Permission Status: ', permissions);
        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
        } else Alert.alert("Permissions haven't been granted.");
    };

    // Get device's location data
    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();
        console.log("Permission granted:", permissions.granted);
        if (permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            console.log("Location fetched:", location);
            if (location) {
                console.log("Sending location:", location.coords);
                onSend({
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                    _id: ""
                });
            } else { Alert.alert("Error occurred while fetching location"); }
        } else { Alert.alert("Permissions haven't been granted."); }
    };

    return (
        <TouchableOpacity
            accessible={true}
            accessibilityLabel="More options"
            accessibilityHint="Lets you choose to send an image or your geolocation."
            accessibilityRole="button"
            style={styles.container}
            onPress={onActionPress}>
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 15,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

export default CustomActions;