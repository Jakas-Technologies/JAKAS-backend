require('dotenv').config()

const { Router } = require("express")
const db = require("../../models")
const { jwtHandler } = require("../../utils/jwtHandler")
const { userMiddleware } = require("../user/middleware")
const userRouter = Router()
const bcrypt = require('bcrypt')

userRouter.get("/", async (req, res, next) => {
    const users = await db.User.findAll();
  
    res.status(200).send({
      success: true,
      message: "users successfully retrieved",
      users,
    });
  });

// refresh token (currently not used)
// userRouter.post('/token', (req, res) => {
//     const refreshToken = req.body.token
//     if (refreshToken == null) return res.sendStatus(401)
//     if (!refreshToken.includes(refreshToken)) return res.sendStatus(403)
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403)
//         const accessToken = generateAccessToken({ name: user.name })
//         res.json({ accessToken: accessToken })
//     })
// })

//register function
userRouter.post('/register', async (req, res) => {
    const {
        body: { name, age, email, password }
    } = req

    const checkMail = await db.User.findOne({ where: { email } })
    if (checkMail) {
        res.send({
            success: false,
            message: "email already registered",
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    let uType = 'General'
    if (age > 40) {
        uType = 'Elderly'
    } 
    if (age < 19) {
        uType = 'Student'
    }
    const user = await db.User.create({ name, age, userType: uType, email, password: hashedPassword })
    await db.Geolocation.create({ userID: user.id })

    res.status(201).send({
        success: true,
        message: "user successfully created",
        user,
    })
})

// login function
userRouter.post('/login', async (req, res) => {
    const {
        body: { email, password }
    } = req

    const user = await db.User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).send({ success: false, message: 'user not found' })
    }
    try {
        if (await bcrypt.compare(password, user.password)) {
            const accToken = jwtHandler.signAccToken(user.dataValues)
            const refToken = jwtHandler.signRefToken(user.dataValues)
            db.User.update(
                {
                    accessToken: accToken,
                    refreshToken: refToken
                }, 
                { where: { email: email }, returning: true }
            )
            res.status(201).send({
                success: true,
                message: 'login successful',
                user,
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

//delete user function
userRouter.delete(
    "/:id",
    jwtHandler.verifyToken,
    userMiddleware.userExists,
    async (req, res, next) => {
        const {
            params: { id },
            oldUser,
        } = req;
  
        if (id != oldUser.id)
            return res.status(403).send({
            success: false,
            message: "You are not authorized to carry out this action",
            });
    
        const users = await db.User.destroy({ where: { id } })
    
        return res.status(200).send({
            success: true,
            message: "user successfully deleted",
            users,
        })
    }
)

// driver update data (currently not used)
// userRouter.put(
//     "/:id",
//     jwtHandler.verifyToken,
//     userMiddleware.userExists,
//         async (req, res, next) => {
//         const {
//             body,
//             params: { id },
//             oldUser,
//         } = req;
    
//         if (id !== oldUser.id)
//             res.status(403).send({
//             success: false,
//             message: "You are not authorized to carry out this action",
//             });
    
//         const [, [user]] = await db.User.update(
//             {
//             name: body.name || oldUser.name,
//             password: body.password || oldUser.password,
//             email: body.email || oldUser.email,
//             },
//             { where: { id }, returning: true }
//         );
    
//         res.status(200).send({
//             success: true,
//             message: "user successfully updated",
//             user,
//         })
//     }
// )

// logout function
userRouter.delete(
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
        await db.User.update({ accessToken: null, refreshToken: null }, { where: { id } })
        return res.status(200).send({
            success: true,
            message: "user successfully logged out",
        });
    }
)

module.exports = { route: userRouter, name: "user" }