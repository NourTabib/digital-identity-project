const path = require('node:path');
const { workerData, parentPort } = require('node:worker_threads')
const { PythonShell } = require('python-shell');

const PictureExtractionWorker = (file) => {
    const filePath = file.replace("./", "/")
    const baseDir = path.resolve("./").toString()
    const Image = (baseDir + filePath.replace("/","\\")).replace("/","\\")
    let options = {
        mode: 'text',
        pythonPath: '/Users/Nour.Tabib/AppData/Local/Programs/Python/Python310/python.exe',
        pythonOptions: ['-u'],
        scriptPath: './Modules/DocumentScans/ExtractPicture',
        args: [Image]
    }
    var pyShell = new PythonShell('DetectFace.py', options)
    pyShell.on('pythonError', (err) => {
        console.log(err)
        //parentPort.postMessage(err)
    })
    pyShell.on('message', (msg) => {
        parentPort.postMessage(msg)
    })
}
PictureExtractionWorker(workerData.file);

module.exports = PictureExtractionWorker ;