const { hoistedIODriver } = require("./driversocket");
const { hoistedIOUser } = require("./usersocket");
const configureSockets = (io, socket) => {
  return {
    driverLocation: hoistedIODriver(io),
    userLocation: hoistedIOUser(io),
  };
};
const onConnection = (io) => (socket) => {
  const { userLocation, driverLocation } = configureSockets(io, socket);
  socket.on("user-move", userLocation);
  socket.on("driver-move", driverLocation);
};
module.exports = { onConnection };