import { StyleSheet, Text, View , Image  } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Camera,CameraType } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import Button from '../components/Button'
import Loading from '../../../Clients/Mobile/src/components/Loading'
import axios from 'axios'
import { prepareFormData, preparePicture } from '../utils/prepareFormData'

const Register = ({ navigation }) => {
    
    
    const [Selfie,setSelfie] = useState(null) // The below States Store the Path of the Temporary Picture files
    const [IdCardFront,setIdCardFront] = useState(null) // The below States Store the Path of the Temporary Picture files
    const [IdCardBack,setIdCardBack] = useState(null) // The below States Store the Path of the Temporary Picture files
    
    const selfiePic = useRef(null); // The below Ref contains the Pictures Path in disk
    const idCardPicFront = useRef(null); // The below Ref contains the Pictures Path in disk
    const idCardPicBack = useRef(null); // The below Ref contains the Pictures Path in disk
    
    const [HasCameraPermission, setHasCameraPermission] = useState(null) // is True if user grants permission
    const [isLoading,setLoading] = useState(false) // true if Loading Something eg. from server , or Mounting component
    const [currentPage,setPage] = useState("selfie") // this State stores the Current Page of the Registration Form
    const [flash,setFlash ] = useState(Camera.Constants.FlashMode)
    const cameraRef = useRef(null) // This Ref Stores a reference to the Camera

    useEffect(()=>{
        (async () =>{
            MediaLibrary.requestPermissionsAsync(); // Request filesystem Permission
            const cameraStatus = await Camera.requestCameraPermissionsAsync(); // Request acces to Camera
            setHasCameraPermission(cameraStatus.status === 'granted' );
        })();
    },[])

    // Save the Temporary (Cached) Picture to the File System
    const saveImage = async () =>{
        // Check if the user has taken the two pictures
        if(Selfie && IdCardFront && IdCardBack ){
            try{
                const selfiePicture =await MediaLibrary.createAssetAsync(Selfie); // Save the Selfie
                const idCardFrontPicture = await MediaLibrary.createAssetAsync(IdCardFront); // Save IdCard front Picture
                const idCardBackPicture = await MediaLibrary.createAssetAsync(IdCardBack); // Save IdCard Back Picture
                selfiePic.current = selfiePicture;  // Saving the Saved Pictures path in the Ref
                idCardPicFront.current = idCardFrontPicture; // Saving the Saved Pictures path in the Ref
                idCardPicBack.current = idCardBackPicture; // Saving the Saved Pictures path in the Ref
            }catch(error){
                console.log(error)
            }
        }
    }

    // This Function is responsible for Sending Data to the Server
    const Registering = async () => {
        setLoading(true); // Set Loading Page
        await saveImage(); // Save Pictures in Disk
        const files = [ // Preparing an Array of Objects that has the Pictures details and Type (selfie or id...) as Proprities
            {picture : preparePicture(selfiePic),type : "selfie"},
            {picture : preparePicture(idCardPicFront),type : "idCardFront"},
            {picture : preparePicture(idCardPicBack),type : "idCardBack" }
        ]
        try {
           const body = prepareFormData(files,"files") // Generating a FormData() and Appending the Pictures to it

           let config = {
            method : "POST",
            headers : {
                'Accept' : 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body : body,
            };
            res = await fetch("http://192.168.1.247:5000/Account/Registration/",config).then(res => {
                return res}) // POSTING REGISTRATION FORM TO THE SERVER

            // CONTINUE HERE
            // THE RES SHOULD CONTAIN IF THE REGISTRATION IS SUCCESFUL
            // IF SO Take the Registrating Detail
            // THEN NAVIGATE TO Registration Details Screen 
            
        }catch(error){
            console.log(error);
        }
    }

    // CALLBACK FUCTION , CALLED WHEN TAKE SELFIE PICTURE BUTTON IS PRESSED
    const TakeSelfie = async () =>{
        if(cameraRef){
            try {
                const data = await cameraRef.current.takePictureAsync();
                setSelfie(data.uri);
            }catch(e){
                console.log(e)
            }
        }
    }
    // CALLBACK FUCTION , CALLED WHEN TAKE ID CARD PICTURE BUTTON IS PRESSED
    const TakeIdPicture = async (CameraType) =>{
        if(cameraRef && (CameraType === "Front")){
            try {
                const data = await cameraRef.current.takePictureAsync();
                setIdCardFront(data.uri);
            }catch(e){
                console.log(e)
            }
        }
        else if(cameraRef && (CameraType === "Back")){
            try {
                const data = await cameraRef.current.takePictureAsync();
                setIdCardBack(data.uri);
            }catch(e){
                console.log(e)
            }
        }
    }

    // Nested Component
    // Each One Represent A Page Of The Registration Form
    const SelfiePage = () =>{
        return(
            <View style={{flex:1}} >
                {!Selfie?
                <Camera 
                style={styles.camera}
                type={Camera.Constants.Type.front}
                flashMode={flash}
                ref = {cameraRef}
                >
                </Camera>
                : <Image source={{uri:Selfie}} style={styles.camera} />
                }
                <View>
                {Selfie?
                    <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:50}} >
                        <Button title={"Retake"} icon="retweet" onPress={()=> setSelfie(null)} />
                        <Button title={"Next"} icon="check" onPress={()=> setPage('FrontId')} />                   
                    </View>
                :
                <Button title={'Take a Picture'} icon="camera" onPress={()=>TakeSelfie()} />
                }
                </View>
            </View>
        )
    }
    const BackIdCardPage = () => {
        return(
            <View style={{flex:1}} >
                {!IdCardBack?
                <Camera 
                style={styles.camera}
                type={Camera.Constants.Type.back}
                flashMode={flash}
                ref = {cameraRef}
                >
                </Camera>
                : <Image source={{uri:IdCardBack}} style={styles.camera} />
                }
                <View>
                {IdCardBack?
                    <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:50}} >
                        <Button title={"Retake"} icon="retweet" onPress={()=>setIdCardBack(null)} />
                        <Button title={"Next"} icon="check" onPress={()=>{
                            setLoading(true);
                            setPage('waiting');
                            }} />                   
                    </View>
                :
                <Button title={'Take a Picture'} icon="camera" onPress={()=> TakeIdPicture("Back")} />
                }
                </View>
            </View>
        )
    }
    const FrontIdCardPage = () => {
        return(
            <View style={{flex:1}} >
                {!IdCardFront?
                <Camera 
                style={styles.camera}
                type={Camera.Constants.Type.back}
                flashMode={flash}
                ref = {cameraRef}
                >
                </Camera>
                : <Image source={{uri:IdCardFront}} style={styles.camera} />
                }
                <View>
                {IdCardFront?
                    <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:50}} >
                        <Button title={"Retake"} icon="retweet" onPress={()=>setIdCardFront(null)} />
                        <Button title={"Next"} icon="check" onPress={()=>{
                            setPage('BackId');
                            }} />                   
                    </View>
                :
                <Button title={'Take a Picture'} icon="camera" onPress={()=>TakeIdPicture("Front")} />
                }
                </View>
            </View>
        )

    }
    const WaitingPage = () => {
        setTimeout(()=>Registering(),2000)
        if(isLoading){
            return(
                <Loading/>
            )
        }
        else if (!isLoading){
            (() =>{
                navigation.navigate('RegistrationInfo')
            })();
        }
    }
    // A FUNCTION THAT REDIRECT TO A GIVEN PAGE
    // @param The Page's Name
    const Index = (page) => {
        // ADD A PAGE to the Page Object
        const Page = {
            selfie : <SelfiePage />,
            FrontId : <FrontIdCardPage />,
            BackId : <BackIdCardPage/>,
            waiting : <WaitingPage />
        }
        return(Page[page])
        
    }
    // EXECUTED IF PERMISSION REQUEST IS DENIED
    if(HasCameraPermission === false){ 
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
    outContainer : {
        flex : 1,
        flexDirection:'column',
        justifyContent : 'center',
    },
    container : {
        flex : 1,
        alignItems:'center',
        justifyContent: 'center',
        paddingBottom:20,
    },
    
    camera : {
        flex:1,
        borderRadius : 20,
    }
})