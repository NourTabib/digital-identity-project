const path = require('node:path');
const {workerData , parentPort} = require('node:worker_threads')
const {PythonShell} = require('python-shell');


const DocumentScanWorker = (file,template) =>{
    const filePath = file.replace("./","/")
    const baseDir = path.resolve("./").toString()
    const imgPath = ((baseDir + filePath).replace("/","\\")).replace("/","\\")
    const templatePath = baseDir + "\\utils\\template\\" + template + '.png'
    if(template === "FrontTemplate"){
        let options = {
            mode : 'text',
            pythonPath: '/Users/Nour.Tabib/AppData/Local/Programs/Python/Python310/python.exe' ,
            pythonOptions: ['-u'],
            scriptPath: './Modules/DocumentScans/ExtractText',
            args: [imgPath,templatePath]
        }
        var pyShell = new PythonShell('idCardFrontScanner.py',options)
        pyShell.on('pythonError',(err)=>{
            console.log(err)
            //parentPort.postMessage(err)
        })
        pyShell.on('message',(msg)=>{
            parentPort.postMessage(msg)
        })
        pyShell.on('stderr',(err)=>{
            //parentPort.postMessage({message:err})
            console.log(err)
        })
    }else if(template === "BackTemplate"){
        let options = {
            mode : 'text',
            pythonPath: '/Users/Nour.Tabib/AppData/Local/Programs/Python/Python310/python.exe' ,
            pythonOptions: ['-u'],
            scriptPath: './Modules/DocumentScans/ExtractText',
            args: [imgPath,templatePath]
        }
        var pyShell = new PythonShell('idCardBackScanner.py',options)
        pyShell.on('pythonError',(err)=>{
            console.log(err)
            //parentPort.postMessage(err)
            })
        pyShell.on('message',(msg)=>{
            parentPort.postMessage(msg)
            })
    }
}

DocumentScanWorker(workerData.file,workerData.ref);

module.exports = DocumentScanWorker ;