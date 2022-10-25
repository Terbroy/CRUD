const http = require('http');
const path = require('path');
const fs = require('fs/promises');

const PORT = 8000;

const app = http.createServer(async (req, res) => {
    const requestMethod = req.method
    const requestUrl = req.url
    if (requestUrl === "/apiv1/tasks") {
        const jsonPath = path.resolve('./data.json')
        const jsonFile = await fs.readFile(jsonPath, "utf8")
        const arr = JSON.parse(jsonFile)
        if (requestMethod === 'GET') {
            res.setHeader("Content-Type", "application/json")
            res.writeHead("200")
            res.write(jsonFile)
        }else if (requestMethod === 'POST') {
            req.on('data', (data) => {
                const newTask = JSON.parse(data);
                arr.push(newTask)
                const arrJson = JSON.stringify(arr)
                fs.writeFile(jsonPath, arrJson)
            })
            res.writeHead("201")
        } else if(requestMethod === 'PUT' ) {
            req.on('data', (data) => {
                const id = JSON.parse(data)
                console.log(id);
                arr.map(a=>{
                    if (a.id===id){
                        a.status = true
                    }
                })
                const arrJson = JSON.stringify(arr)
                fs.writeFile(jsonPath, arrJson)
                console.log(arr);
            })
            res.writeHead("200")
        } else if(requestMethod === 'DELETE' ) {
            req.on('data', (data) => {
                const id = JSON.parse(data)
                const index = arr.findIndex(a=> a.id===id)
                console.log(index);
                arr.splice(index,1)
                console.log(arr);
                const arrJson = JSON.stringify(arr)
                fs.writeFile(jsonPath, arrJson)
            })
            res.writeHead("202")
        }
    } else {
        res.writeHead("503")
    }
    res.end()
});


app.listen(PORT)

console.log('servidor corriendo al 100');