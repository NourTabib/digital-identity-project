const path = require('node:path');
const {workerData , parentPort} = require('node:worker_threads')
const {PythonShell} = require('python-shell');

const FacialVerificationWorker = (face1,face2) => {
    const baseDir = path.resolve("./").toString()
    const facePath1 = baseDir + face1.replace("./","/").replace("/","\\").replace("/","\\") ;
    const facePath2 = baseDir + face2.replace("./","/").replace("/","\\").replace("/","\\");
    let options = {
        mode : 'json',
        pythonPath: '/Users/Nour.Tabib/AppData/Local/Programs/Python/Python310/python.exe' ,
        pythonOptions: ['-u'],
        scriptPath: './Modules/DocumentScans/ComparePictures',
        args: [facePath1,facePath2]
    }
    var pyShell = new PythonShell('ComparePictures.py',options)
        pyShell.on('pythonError',(err)=>{
            console.log(err)
            //parentPort.postMessage(err)
        })
        pyShell.on('message',(msg)=>{
            parentPort.postMessage(msg)
        })
        pyShell.on('stderr',(err)=>{
            console.log('stderr',err)
            //parentPort.postMessage({message:err})
        })
}
try{
    FacialVerificationWorker(workerData.face1,workerData.face2);
}catch(e){
    console.log("Error",e)
}