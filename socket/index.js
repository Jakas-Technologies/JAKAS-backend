const { hoistedIODriver } = require("./driversocket");
const { hoistedIOUser } = require("./usersocket");
const db = require("../models")

const configureSockets = (io, socket) => {
  return {
    driverLocation: hoistedIODriver(io),
    userLocation: hoistedIOUser(io),
  };
};

const onConnection = (io) => async (socket) => {
  console.log(socket)
  const geo = await db.Geolocation.update(
    { socketID: socket.id },
    { where: { id: socket.user.id } }
  )
  const { userLocation, driverLocation } = configureSockets(io, socket);
  socket.on("usermove", userLocation);
  socket.on("drivermove", driverLocation);
};
module.exports = { onConnection };