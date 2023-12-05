require('dotenv').config()

const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const port = 3000
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/',(req, res) => {
    res.status(200).send({
        error: false,
        message: 'Welcome to JAKAS'
    })
})

app.get('/users', authenticateToken, (req, res) => {
    res.json(req.user)
})

const server = http.createServer(app)
const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log('JAKAS is live and connected')
    console.log(socket.id)
})

function authenticateToken(req, res, next)  {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

server.listen(port, () => {
    console.log(`JAKAS app listening on port ${port}`)
})
