import * as Location from 'expo-location';


export default geoLocation = async () => {
    try {
        const CurrenLocation = null
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        return location;

    } catch (error) {
        console.log(error)
    }
} 