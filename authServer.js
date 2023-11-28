require('dotenv').config()

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const users = require('./users')
const refreshTokens = require('./refreshTokens')

app.use(cors())
app.use(express.json())

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshToken.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })
})

app.post('/register', async (req, res) => {
    const user_name = users.find(user => user.name === req.body.name)
    const user_mail = users.find(user => user.email === req.body.email)
    if (user_name != null) {
        return res.status(400).send({ error: 'true', message: 'Name already taken' })
    } 
    if (user_mail != null) {
        return res.status(400).send({ error: 'true', message: 'Email already taken' })
    }
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }
        users.push(user)
        res.status(201).send({ error: 'false', message: 'User successfully created' })
    } catch {
        res.status(500).send()
    }
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/login', async (req, res) => {
    const user = users.find(user => user.email === req.body.email)
    if (user == null) {
        return res.status(404).send({ error: 'true', message: 'User not found' })
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = generateAccessToken(user)
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
            refreshTokens.push(refreshToken)
            res.json({ accessToken: accessToken, refreshToken: refreshToken }).send({ error: 'false', message: 'Success' })
        } else {
            res.send({ error: 'true', message: 'Password does not match' })
        }
    } catch {
        res.status(500).send()
    }
})

function generateAccessToken(user)  {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

app.listen(4000)
