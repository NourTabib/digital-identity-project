// Prepare an Object containing the file to Upload
// @params Picture Reference and Type (Selfie or IDCard)
// @return An Object containing the Picture details
export const preparePicture = (pictureRef) => {
    return {
        name : pictureRef.current.filename,
        uri:pictureRef.current.uri,
        type:"image/jpg"
    }
}

// Prepare the FormData Containing the File Object 
// @params Array of files , AccesString
// @ return FormData containing the files to send
export const prepareFormData = (filesArray,accesString) => {
    const form = new FormData();
    // Append each file in the Array
    filesArray.map(file => {
        form.append(accesString,file.picture)
        // IF ID CARD PICTURE ADD THE NAME OF THE FILE, TO RECOGNIZE THE PICTURE BY NAME LATER IN SERVER
        if(file.type === 'idCardFront'){
            form.append('idCardFront',file.picture.name)
        }
        else if(file.type === 'idCardBack'){
            form.append('idCardBack',file.picture.name)
        }
        // IF SELFIE PICTURE ADD THE NAME OF THE FILE, TO RECOGNIZE THE PICTURE BY NAME LATER IN SERVER
        else if (file.type  === 'selfie'){
            form.append('selfie',file.picture.name)
        }
    })
    return form ;
}