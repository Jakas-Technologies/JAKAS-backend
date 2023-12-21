const db = require("../../models");

const driverMiddleware = {
  userExists: async (req, res, next) => {
    const {
        params: { id },
    } = req;
    const user = await db.Driver.findByPk(id);
    if (!user)
        return res.status(404).send({
            success: true,
            message: "user not found",
            user,
        });

    req.oldUser = user;
    return next();
  },
};

module.exports = { driverMiddleware };