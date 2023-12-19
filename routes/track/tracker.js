const { Router } = require("express");
const db = require("../../models");
const { jwtHandler } = require("../../utils/jwtHandler");

const trackerRouter = Router();

trackerRouter.post(
    "/book-ride",
    jwtHandler.verifyToken,
    async (req, res, next) => {
      // search for user that is offline
      // assign the booker id to the
      const {
        user,
        body: { location },
      } = req;
      //returns the first user that meets the criteria
      const user2 = await db.Driver.findOne({
        where: { routeId: 1 },
      });
      db.Geolocation.update(
        {
          trackerID: user2.id,
          online: true,
        },
        { where: { userID: user.id }, returning: true }
      );
      db.Geolocation.update(
        {
          trackerID: user.id,
          location: {
            type: "Point",
            coordinates: [location.longitude, location.latitude],
          },
          online: true,
        },
        { where: { driverID: user2.id }, returning: true }
      );
      if (!user2)
        return res.status(404).send({
          success: false,
          message,
        });
      return res.status(200).send({
        success: true,
        message: "You have successfully been assigned a driver",
      });
    }
);

trackerRouter.post(
    "/stop-tracking",
    jwtHandler.verifyToken,
    async (req, res, next) => {
      const { user } = req;

      const userGeo = await db.Geolocation.findOne({ where: { userID: user.id } });

      const driverGeo = await db.Geolocation.findOne({
          where: { driverID: userGeo.trackerID },
      });

      db.Geolocation.update(
          {
            trackerID: null,
            online: false,
          },
          { where: { userID: userGeo.id } }
      );

      db.Geolocation.update(
          {
            trackerID: null,
            online: false,
          },
          { where: { driverID: driverGeo.id } }
      );

        return res.status(200).send({
            success: true,
            message: "You have successfully been stopped tracking",
        });
    }
);

module.exports = { route: trackerRouter, name: "track" };