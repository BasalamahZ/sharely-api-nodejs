import Jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.status(401).send({
      success: false,
      message: "you are not authorized",
    });
  }
  Jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      res.status(403).send({
        success: false,
        message: "token is not valid!",
      });
    }
    req.user = user;
    next();
  });
};
