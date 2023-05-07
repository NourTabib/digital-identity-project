// This File Contains utils used 
const multer = require('multer')

// @param 
// @return Multer Diskstorage instance
const uploadImages = ()=>{
    const storage = multer.diskStorage({
        destination: "./uploads/",
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
  });
  const diskStorage = multer({ storage: storage });
  return diskStorage ;
}

// @param File received in the request 
// @return An Array of Files path
// Cleaning the File's Object from useless Attributes
const cleanRequestFiles = (reqFiles) =>{
    const temp = [];
    if(reqFiles.length === 0){
        return []
    }
    reqFiles.forEach(file => {
        const path = file['destination'] + '' + file['filename'] ;
        temp.push({
            path : path
        })
    });
    return temp;
}
// ADD DECALARED FUNCTIONS ABOVE
// {moduleName : function }
const utils =  {
    cleanRequestFiles : cleanRequestFiles,
    uploadImages : uploadImages,
} ;
module.exports = utils ;