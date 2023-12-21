const userRoute = require("./user/user");
const driverRoute = require("./driver/driver");
const trackRoute = require("./track/tracker");
const fareRoute = require("./fare/fare");
const paymentRoute = require("./payment/payment")

const allRoutes = [userRoute, driverRoute, trackRoute, fareRoute, paymentRoute];

const initRoutes = (app) => {
  allRoutes.forEach((router) => {
    app.use(`/jakas/api/${router.name}`, router.route);
  });
  return app;
};

module.exports = { initRoutes };