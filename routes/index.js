const userRoute = require("./user/user");
const driverRoute = require("./driver/driver");
const trackRoute = require("./track/tracker");
const FareController = require("./fare/model_deployment/controllers/FareController")

const allRoutes = [userRoute, driverRoute, trackRoute, FareController];

const initRoutes = (app) => {
  allRoutes.forEach((router) => {
    app.use(`/jakas/api/${router.name}`, router.route);
  });
  return app;
};

module.exports = { initRoutes };