module.exports = (req, res, next) => {
  const userIP = req.ip || req.connection.remoteAddress;
  console.log(`Request received from IP: ${userIP}`);
  next();
};
