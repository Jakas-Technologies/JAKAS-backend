const userRoute = require("./user/user");
const driverRoute = require("./driver/driver");
const trackRoute = require("./track/tracker");
const fareRoute = require("./fare/fare")

const allRoutes = [userRoute, driverRoute, trackRoute, fareRoute];

const initRoutes = (app) => {
  allRoutes.forEach((router) => {
    app.use(`/jakas/api/${router.name}`, router.route);
  });
  return app;
};

module.exports = { initRoutes };