const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/assets/index.html'))
})

app.get('/video', (req, res) => {
    const range = req.headers.range

    if (!range) {
        return res.status(400).send('Requieres range in header Request')
    }

    const videoPath = path.join(
        __dirname + '/assets/JavaScriptin100Seconds.mp4'
    )
    const videoSize = fs.statSync(videoPath).size

    const chunkSize = 10 ** 6
    const start = Number(range.replace(/\D/g, ''))
    const end = Math.min(start + chunkSize)
    const contentLength = end - start + 1

    const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4',
    }

    res.writeHead(206, headers)
    const videoStream = fs.createReadStream(videoPath, { start, end })
    videoStream.pipe(res)
})

const port = 3000

app.listen(port, () => {
    console.log('Listening port server: ', port)
    console.log(`http://localhost:${port}`)
})
