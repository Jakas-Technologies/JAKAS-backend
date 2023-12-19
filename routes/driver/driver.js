require('dotenv').config()

const { Router } = require("express")
const db = require("../../models")
const { jwtHandler } = require("../../utils/jwtHandler")
const { userMiddleware } = require("../user/middleware")
const driverRouter = Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

driverRouter.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshToken.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })
})

driverRouter.post('/register', async (req, res) => {
    const {
        body: { name, age, licensePlate, routeName, email, password }
    } = req

    const checkMail = await db.User.findOne({ where: { email } })
    if (checkMail) {
        res.send({
            success: false,
            message: "email already registered",
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    let route
    if (routeName == 'Cicaheum-Ciroyom') {
        route = 1
    }
    const user = await db.Driver.create({ name, age, licensePlate, routeName, routeId:route, email, password: hashedPassword })
    await db.Geolocation.create({ driverID: user.id })

    res.status(201).send({
        success: true,
        message: "user successfully created",
        user,
    })
})

// login function
driverRouter.post('/login', async (req, res) => {
    const {
        body: { email, password }
    } = req

    const user = await db.Driver.findOne({ where: { email } });
    if (!user) {
        return res.status(404).send({ success: false, message: 'user not found' })
    }
    try {
        if (await bcrypt.compare(password, user.password)) {
            const accToken = jwtHandler.signAccToken(user.dataValues)
            const refToken = jwtHandler.signRefToken(user.dataValues)
            db.Driver.update(
                {
                    accessToken: accToken,
                    refreshToken: refToken
                }, 
                { where: { email: email }, returning: true }
            )
            res.status(201).send({
                success: true,
                message: 'login successful',
                accessToken: accToken,
                refreshToken: refToken
            })
        } else {
            res.status(400).send({
                success: false,
                message: 'password does not match'
            })
        }
    } catch {
        res.status(500).send()
    }
})

// logout function
driverRouter.delete(
    '/:id/logout',
    jwtHandler.verifyToken,
    userMiddleware.userExists, async (req, res, next) => {
        const {
            params: { id },
            oldUser,
        } = req;
        if (id != oldUser.id)
            return res.status(403).send({
                success: false,
                message: "You are not authorized to carry out this action",
            });
        const users = await db.Driver.update({ accessToken: null, refreshToken: null }, { where: { id } })
        return res.status(200).send({
            success: true,
            message: "driver successfully logged out",
            users,
        });
    }
)

module.exports = { route: driverRouter, name: "driver" };