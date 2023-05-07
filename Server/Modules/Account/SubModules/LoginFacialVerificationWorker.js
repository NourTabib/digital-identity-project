const path = require('node:path');
const {workerData , parentPort} = require('node:worker_threads')
const {PythonShell} = require('python-shell');

const LoginFacialVerificationWorker = (facialEmbedding,picturePath) => {
    const absolutePath = path.resolve("./").toString() + "\\" + picturePath ;
    //facialEmbedding = JSON.parse(facialEmbedding)
    let options = {
        mode : 'text',
        pythonPath: '/Users/Nour.Tabib/AppData/Local/Programs/Python/Python310/python.exe' ,
        pythonOptions: ['-u'],
        scriptPath: './Modules/DocumentScans/ComparePictures/',
        args: [facialEmbedding,absolutePath]
    }
    var pyShell = new PythonShell('LoginFacialComparing.py',options);
    pyShell.on('pythonError', (err) => {
        console.log("py error"+err)
        //parentPort.postMessage(err)
    })
    pyShell.on('message', (msg) => {
        if(msg == "True"){
            parentPort.postMessage(true)
        }else{
            parentPort.postMessage(false)
        }
        
    })
    
}
LoginFacialVerificationWorker(workerData.facialEmbedding,workerData.picturePath);
module.exports = LoginFacialVerificationWorker ;