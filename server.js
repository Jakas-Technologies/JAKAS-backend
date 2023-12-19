const express = require('express')
const jwt = require('jsonwebtoken')
const http = require('http')
const socketio = require('socket.io')
const db = require("./models")
const { initRoutes } = require("./routes");

let app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app = initRoutes(app)
app.get('/',(req, res) => {
    res.status(200).send({
        success: true,
        message: 'Welcome to JAKAS'
    })
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

io.use((socket, next) => {
    if (socket.handshake.headers.auth) {
      const { auth } = socket.handshake.headers;
      const token = auth.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
        if (err) {
          throw new Error("Authentication error, Invalid Token supplied");
        }
        const theUser = await db.User.findByPk(decodedToken.id);
        if (!theUser)
          throw new Error(
            "Invalid Email or Password, Kindly contact the admin if this is an anomaly"
          );
        socket.theUser = theUser;
        return next();
      });
    } else {
      throw new Error("Authentication error, Please provide a token");
    }
});

server.listen(port, () => {
    console.log(`JAKAS app listening on port ${port}`)
})
