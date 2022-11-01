import { promisify } from "util";

import jsonwebtoken from "jsonwebtoken";
const { sign, verify } = jsonwebtoken;

// App Error
import AppError from "../utils/appError.js";

//
/**
 * Create Token
 *
 * @param {*} id
 */
const createToken = (id) => {
  return sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

/**
 * Login
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
//Login Api
export async function login(req, res, next) {
  try {
    res.status(200).json({
      status: "updated",
      data: "data",
    });
  } catch (err) {
    next(err);
  }
}

// Sign Up Module
export async function signup(req, res, next) {
  try {
  } catch (err) {
    next(err);
  }
}

export async function protect(req, res, next) {
  try {
    // 1) check if the token is there
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization;
    }

    if (!token) {
      return next(new AppError(401, "fail", "You are not logged in! Please login in to continue"), req, res, next);
    }

    // 2) Verify token
    // const decode = await promisify(verify)(token, process.env.JWT_SECRET);

    // 3) check if the user is exist (not deleted)
    const user = await User.find({
      token: { $eq: token },
    });

    if (!user) {
      return next(new AppError(401, "fail", "This user is no longer exist"), req, res, next);
    }

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
}

// Authorization check if the user have rights to do this action
export function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "fail", "You are not allowed to do this action"), req, res, next);
    }

    next();
  };
}
