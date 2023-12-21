const { Router } = require("express");
const db = require("../../models");
const { jwtHandler } = require("../../utils/jwtHandler");
const turf = require('@turf/turf');
const forwardRoutes = require('../../coords/forward-routes')
const backwardRoutes = require('../../coords/backward-routes')

const trackerRouter = Router();

trackerRouter.post(
    "/start",
    jwtHandler.verifyToken,
    async (req, res, next) => {
      const {
        user,
        body: { location },
      } = req;
      const driver = await db.Driver.findOne({
        where: { licensePlate: req.body.licensePlate },
      });
      if (!driver)
        return res.status(404).send({
          success: false,
          message: 'driver not found'
      });
      const geo1 = await db.Geolocation.findOne({ where: { driverID: driver.id }})
      db.Geolocation.update(
        {
          trackerID: geo1.id,
          online: true,
        },
        { where: { userID: user.id }, returning: true }
      );
      const geo2 = await db.Geolocation.findOne({ where: { userID: user.id }})
      db.Geolocation.update(
        {
          trackerID: geo2.id,
          location: {
            type: "Point",
            coordinates: [location.longitude, location.latitude],
          },
          online: true,
        },
        { where: { driverID: driver.id }, returning: true }
      );
      return res.status(200).send({
        success: true,
        message: `You started tracking ${req.body.licensePlate}`,
      });
    }
);

trackerRouter.post(
    "/stop-tracking",
    jwtHandler.verifyToken,
    async (req, res, next) => {
      const { user } = req;

      const userGeo = await db.Geolocation.findOne({ where: { id: user.id } });

      const driverGeo = await db.Geolocation.findOne({
          where: { id: userGeo.trackerID },
      });

      db.Geolocation.update(
          {
            trackerID: null,
            online: false,
          },
          { where: { id: userGeo.id } }
      );

      db.Geolocation.update(
          {
            trackerID: null,
            online: false,
          },
          { where: { id: driverGeo.id } }
      );

      return res.status(200).send({
          success: true,
          message: "You have successfully been stopped tracking",
      });
    }
);

trackerRouter.post(
  '/getAngkot',
  jwtHandler.verifyToken,
  async (req, res, next) => {
    const {
      user,
      body: { location },
    } = req;
    const drivers = await db.Driver.findAll({
      where: {
        routeName: req.body.routeName
      }
    });
    if (!drivers)
        return res.status(404).send({
          success: false,
          message: 'no angkot available',
        });
    return res.status(200).send({
      success: true,
      message: "angkot available",
      drivers
    });
  }
)

trackerRouter.post(
  '/getJurusan', 
  jwtHandler.verifyToken,
  async (req, res, next) => {
    const {
      user,
      body: { location }
    } = req;
    console.log(location) // debug
    const points = location
    let verif = 0
    points.forEach(point => {
      const isWithinForward = turf.booleanPointOnLine(point, forwardRoutes);
      const isWithinBackward = turf.booleanPointOnLine(point, backwardRoutes);
      console.log(isWithinForward) //debug
      console.log(isWithinBackward) //debug
      if (isWithinForward) {
        verif++
      }
      if (isWithinBackward) {
        verif++
      }
    });
    if (verif == 2){
      const drivers = await db.Driver.findAll({
        where: {
          routeName: "Cicaheum-Ciroyom"
        }
      });
      res.status(200).send({
        success: true,
        message: 'location is within the routes',
        drivers
      })
    }
  }
)

module.exports = { route: trackerRouter, name: "track" };