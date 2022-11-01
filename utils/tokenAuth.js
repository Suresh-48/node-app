import jwt from "jsonwebtoken";
import { SESSION_REFRESH_TOKEN, TOKEN_KEY } from "../config.js";

export async function verifyToken(req, res, next) {
  const token = req.body.token || req.query.token || req.headers.token || req.params.token;
  const refreshToken =
    req.body.refreshtoken || req.query.refreshtoken || req.headers.refreshtoken || req.params.refreshtoken;

  // if (!token) {
  //   return res.status(403).send("Token is Required for Authentication");
  // }

  if (refreshToken) {
    try {
      const verify = jwt.verify(refreshToken, SESSION_REFRESH_TOKEN);
      return next();
    } catch (error) {
      return res.status(401).send("Token Expired").json({
        status: "Token expired",
      });
    }
  }

  if (!token) {
    return next();
  }
  try {
    const verify = jwt.verify(token, TOKEN_KEY);
    return next();
  } catch (error) {
    return res.status(401).send("Token Expired").json({
      status: "Token expired",
    });
  }
}
