const jwt = require("jsonwebtoken");

const jwtHandler = {
  signAccToken: (data) => {
    try {
      const accToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
      return accToken;
    } catch (error) {
      console.log({ error });
      throw new Error("There was a problem verifying your token", error);
    }
  },

  signRefToken: (data) => {
    try {
      const refToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET)
      return refToken;
    } catch (error) {
      console.log({ error });
      throw new Error("There was a problem verifying your token", error);
    }
  },

  verifyToken: (req, res, next) => {
    try {
      const BearerToken = req.headers.authorization;
      const token = BearerToken.split(" ")[1];
      console.log({ token });
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = user;
      return next();
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "there was a problem decoding the token",
        error,
      });
    }
  },
};

module.exports = { jwtHandler };