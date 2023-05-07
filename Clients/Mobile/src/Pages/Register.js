import { StyleSheet, Text, View, Image, TextInput, Button } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Encryption from '../Services/Encryption'
import { Camera, CameraType } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import CustomButton from '../components/Button'
import Loading from '../components/Loading'
import axios from 'axios'
import { prepareFormData, preparePicture } from '../Services/prepareFormData'

const Register = ({ navigation }) => {

    const [username, SetUsername] = useState("")
    const [Selfie, setSelfie] = useState(null) // The below States Store the Path of the Temporary Picture files
    const [IdCardFront, setIdCardFront] = useState(null) // The below States Store the Path of the Temporary Picture files
    const [IdCardBack, setIdCardBack] = useState(null) // The below States Store the Path of the Temporary Picture files
    const [keyPair, setKeyPair] = useState(null)
    const [transactionId, setTransactionId] = useState("")
    const [transactionSharedKey, setTransactionSharedKey] = useState("")
    const selfiePic = useRef(null); // The below Ref contains the Pictures Path in disk
    const idCardPicFront = useRef(null); // The below Ref contains the Pictures Path in disk
    const idCardPicBack = useRef(null); // The below Ref contains the Pictures Path in disk

    const [HasCameraPermission, setHasCameraPermission] = useState(null) // is True if user grants permission
    const [isLoading, setLoading] = useState(false) // true if Loading Something eg. from server , or Mounting component
    const [currentPage, setPage] = useState("username") // this State stores the Current Page of the Registration Form
    const [flash, setFlash] = useState(Camera.Constants.FlashMode)
    const cameraRef = useRef(null) // This Ref Stores a reference to the Camera

    useEffect(() => {
        (async () => {
            MediaLibrary.requestPermissionsAsync(); // Request filesystem Permission
            const cameraStatus = await Camera.requestCameraPermissionsAsync(); // Request acces to Camera
            setHasCameraPermission(cameraStatus.status === 'granted');
            await Encryption.GenerateKeyPair().then(async kpair => {
                setKeyPair(kpair);
                return kpair
            }).then(async keys => {
                await Encryption.storeKeyPair(keys)
            })
        })();
    }, [])

    // Save the Temporary (Cached) Picture to the File System
    const saveImage = async () => {
        // Check if the user has taken the two pictures
        if (Selfie && IdCardFront && IdCardBack) {
            try {
                const selfiePicture = await MediaLibrary.createAssetAsync(Selfie); // Save the Selfie  in disk storage
                const idCardFrontPicture = await MediaLibrary.createAssetAsync(IdCardFront); // Save IdCard front Picture in disk storage
                const idCardBackPicture = await MediaLibrary.createAssetAsync(IdCardBack); // Save IdCard Back Picture in disk storage
                selfiePic.current = selfiePicture;  // Storing the location of the saved file 
                idCardPicFront.current = idCardFrontPicture; // Storing the location of the saved file 
                idCardPicBack.current = idCardBackPicture; // Storing the location of the saved file 
            } catch (error) {
                console.log(error)
            }
        }
    }
    // This Function is responsible for Sending Data to the Server
    const Registering = async () => {
        //setLoading(true); // Set Loading Page
        await saveImage(); // Save Pictures in Disk
        const files = [ // Preparing an Array of Objects that has the Pictures details and Type (selfie or id...) as Proprities
            { picture: preparePicture(selfiePic), type: "selfie" },
            { picture: preparePicture(idCardPicFront), type: "idCardFront" },
            { picture: preparePicture(idCardPicBack), type: "idCardBack" }
        ]
        try {
            const body = prepareFormData(files, "files") // Generating a FormData() and Appending the Pictures to it
            body.append('username', username) // Adding Username to the form
            body.append('transactionId', transactionId) // Adding TransactionID to the form
            let config = {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                body: body,
            };
            // THE RES SHOULD CONTAIN IF THE REGISTRATION IS SUCCESFUL
            // IF SO Take the Registrating Detail
            // THEN NAVIGATE TO Registration Details Screen 
            res = await fetch("http://192.168.1.138:5000/Account/Registration/", config) // POSTING REGISTRATION FORM TO THE SERVER
                .then(res => { return res.json() })
                .then(JsonRes => {
                    if (JsonRes.data == "error") {
                        return "error"
                    } else {
                        return Encryption.DecryptMessage(JsonRes.data, JsonRes.nonce, transactionSharedKey)
                    }
                }).then(registrationDetails => {
                    if (registrationDetails == "error") {
                        alert("Registration Failed !")
                        navigation.navigate("Welcome")
                    } else {
                        navigation.navigate("RegistrationDetails", {
                            registrationDetails: registrationDetails
                        })
                    }
                })

        } catch (error) {
            console.log(error);
        }
    }

    // CALLBACK FUCTION , CALLED WHEN TAKE SELFIE PICTURE BUTTON IS PRESSED
    const TakeSelfie = async () => {
        if (cameraRef) {
            try {
                const data = await cameraRef.current.takePictureAsync();
                setSelfie(data.uri);
            } catch (e) {
                console.log(e)
            }
        }
    }

    // CALLBACK FUCTION , CALLED WHEN TAKE ID CARD PICTURE BUTTON IS PRESSED
    const TakeIdPicture = async (CameraType) => {
        if (cameraRef && (CameraType === "Front")) {
            try {
                const data = await cameraRef.current.takePictureAsync();
                setIdCardFront(data.uri);
            } catch (e) {
                console.log(e)
            }
        }
        else if (cameraRef && (CameraType === "Back")) {
            try {
                const data = await cameraRef.current.takePictureAsync();
                setIdCardBack(data.uri);
            } catch (e) {
                console.log(e)
            }
        }
    }
    // Nested Component
    // Each One of the function below, Represent  A Page Of The Registration Form
    const UsernamePage = () => {
        const VerifUsername = async () => {
            await axios.post("192.168.1.138:5000/Account/usernameValidity/", { "username": username })
                .then(msg => { return msg.data })
                .then(async res => {
                    if (!res && username.length >= 8 && keyPair != null) {
                        await axios.post('192.168.1.138:5000/Encryption/generateRegistrationKeys/', { username: username, userPubKey: keyPair.pubKey }).then(async result => {
                            let SharedKey = await Encryption.GenerateSharedKey(result.data.serverPubKey, keyPair.secKey)
                            setTransactionSharedKey(SharedKey)
                            setTransactionId(result.data.transactionId)
                        }).then(() => {
                            setPage("DocumentScanningPage")
                        })
                    }
                    else if (username.length < 8) {
                        alert("This username is too short")
                    }
                    else {
                        alert("This username is Taken")
                    }
                })
        }
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                <Text style={{ marginBottom: 20 }}>Username</Text>
                <TextInput style={{
                    width: 200,
                    height: 44,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: 'black'
                    , marginBottom: 10,
                }} onChangeText={(username) => SetUsername(username)} value={username} />


                <Button title={"Next"} onPress={() => { VerifUsername() }} />
            </View>
        )
    }
    const SelfiePage = () => {
        return (
            <View style={{ flex: 1 }} >
                <View style={{left:150,top:10}}>
                  <CustomButton icon="cross" onPressProp={()=>{ setPage("selfie") }} />
                </View>
                {!Selfie ?
                    <Camera
                        style={styles.camera}
                        type={Camera.Constants.Type.front}
                        flashMode={flash}
                        ref={cameraRef}
                    >
                    </Camera>
                    : <Image source={{ uri: Selfie }} style={styles.camera} />
                }
                <View>
                    {Selfie ?
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 50 }} >
                            <CustomButton title={"Retake"} icon="retweet" onPressProp={() => setSelfie(null)} />
                            <CustomButton title={"Next"} icon="check" onPressProp={() => {
                                setLoading(true);
                                setPage("waiting")}} />
                        </View>
                        :
                        <CustomButton title={'Take a Picture'} icon="camera" onPressProp={() => TakeSelfie()} />
                    }
                </View>
            </View>
        )
    }
    const BackIdCardPage = () => {
        return (
            <View style={{ flex: 1 }} >
                <View style={{left:150,top:10}}>
                  <CustomButton icon="cross" onPressProp={()=>{ setPage("DocumentScanningPage") }} />
                </View>
                {!IdCardBack ?
                    <Camera
                        style={styles.camera}
                        type={Camera.Constants.Type.back}
                        flashMode={flash}
                        ref={cameraRef}
                    >
                    </Camera>
                    : <Image source={{ uri: IdCardBack }} style={styles.camera} />
                }
                <View>
                    {IdCardBack ?
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 50 }} >
                            <CustomButton title={"Retake"} icon="retweet" onPressProp={() => setIdCardBack(null)} />
                            <CustomButton title={"Save"} icon="check" onPressProp={() => {
                                //setLoading(true);
                                //setPage('waiting');
                                setPage('DocumentScanningPage')
                            }} />
                        </View>
                        :
                        <CustomButton title={'Take a Picture'} icon="camera" onPressProp={() => TakeIdPicture("Back")} />
                    }
                </View>
            </View>
        )
    }
    const FrontIdCardPage = () => {
        return (
            <View style={{ flex: 1 }} >
                <View style={{left:150,top:10}}>
                  <CustomButton icon="cross" onPressProp={()=>{ setPage("DocumentScanningPage") }} />
                </View>
                {!IdCardFront ?
                    <Camera
                        style={styles.camera}
                        type={Camera.Constants.Type.back}
                        flashMode={flash}
                        ref={cameraRef}
                    >
                    </Camera>
                    : <Image source={{ uri: IdCardFront }} style={styles.camera} />
                }
                <View>
                    {IdCardFront ?
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 50 }} >
                            <CustomButton title={"Retake"} icon="retweet" onPressProp={() => setIdCardFront(null)} />
                            <CustomButton title={"Next"} icon="check" onPressProp={() => {
                                setPage('DocumentScanningPage');
                            }} />
                        </View>
                        :
                        <CustomButton title={'Take a Picture'} icon="camera" onPressProp={() => TakeIdPicture("Front")} />
                    }
                </View>
            </View>
        )

    }
    const WaitingPage =() => {
        if (isLoading) {
            Registering();
            return (
                <Loading />
            )
        }
    }
    // Each One of the function below, Represent  A Page Of The Registration Guide

    // A FUNCTION THAT REDIRECT TO A GIVEN PAGE OF THE FORM
    // @param The Page's Name
    const Index = (page) => {
        // ADD A PAGE to the Page Object
        const Page = {
            DocumentScanningPage : <DocumentScanningPage/> ,
            username: <UsernamePage />,
            selfie: <SelfiePage />,
            //FrontId: <FrontIdCardPage />,
            //BackId: <BackIdCardPage />,
            waiting: <WaitingPage />,
        }
        return (Page[page])

    }
    const DocumentScanningPage = () => {
        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.title} >Scan Document</Text>
                    <Text style={styles.text} >National Identity Card </Text>

                </View>
                <View style={styles.imageContainer}>
                    <View>
                        <Image resizeMode="center" style={styles.image} source={require("../../assets/frontCard.png")} />
                        <Button title='Scan Card Front' onPress={()=>{
                            setPage("FrontId")
                        }} />
                    </View>
                    <View>
                        <Image resizeMode="center" style={styles.image} source={require("../../assets/backCard.png")} />
                        <Button title='Scan Card Back' onPress={()=>{
                            setPage("BackId")
                        }} />
                    </View>
                </View>
                <View>
                    <Button title="Next" onPress={()=>{setPage("selfie")}} />
                </View>
            </View>
        )
    }
    // EXECUTED IF PERMISSION REQUEST IS DENIED
    if (HasCameraPermission === false) {
        return <Text>No Acces To Camera</Text>
    }
    // RETURN IF PERMISSION REQUEST IS ACCEPTED
    return (
        <>
            {Index(currentPage)}
        </>
    )
}


export default Register

const styles = StyleSheet.create({
    outContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },

    camera: {
        flex: 1,
        borderRadius: 20,
    }
})