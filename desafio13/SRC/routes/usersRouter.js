import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import { cartsController } from "../controllers/cartsController.js";
import { isAdmin } from "../utils/functionsUtils.js"
import { generateToken, authToken } from "../utils/jwt.js";
import { passportCall, userVerify } from "../utils/authUtil.js";
import { authorization } from "../middlewares/auth.js";
import config from "../config.js";
import currentDTO from "../dao/DTOs/currentDTO.js";
import CustomError from '../services/errors/CustomError.js';
import { ErrorCodes } from '../services/errors/enums.js';

const usersRouter = Router();
const carts = new cartsController();

usersRouter.post("/register", passport.authenticate("register", { failureRedirect: "/failRegister", session: false }), async (req, res) => {
  try {
    return res.redirect("/login");
  } catch (error) {
    req.user.failRegister = true;
    /* res.status(500).send({ status: "error", error: error.message })
    return []; */
    CustomError.createError({
      name: 'usersRouterRegister error',
      cause: 'Server fail to register User',
      message: 'Server ERROR, no se pudo registrar el usuario',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

usersRouter.post("/login", passport.authenticate("login", { failureRedirect: "/failLogin", session: false }), async (req, res) => {
  const user = req.user
  try {
    let user = req.user
    if (isAdmin(req.body.email, req.body.password)) {
      user.role = "ADMIN"
    }
    /* delete req.user.password */

    carts.addUid(user)

    user = req.user

    const PRIVATE_KEY = config.PRIVATE_KEY_jWT
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" })

    res.cookie('cookieToken', token, { httpOnly: true, secure: true, maxAge: 60 * 60 * 1000 })

    req.user = user
    return res.redirect("/products")
  } catch (error) {
    user.failLogin = true;
    /* res.status(500).send({ status: "error", error: error.message })
    return []; */
    CustomError.createError({
      name: 'usersRouterLogin error',
      cause: 'Server fail to login user',
      message: 'Server ERROR, no se pudo loguear el usuario',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

usersRouter.get("/logout", passportCall('jwt'), (req, res) => {
  try {
    const data = req.user
    res.clearCookie("cookieToken")
    return res.redirect("/login")
  } catch (error) {
    /* res.status(500).send({ status: "error", error: error.message })
    return []; */
    CustomError.createError({
      name: 'usersRouterLogout error',
      cause: 'Server fail to logout User',
      message: 'Server ERROR, no se pudo desloguear el usuario',
      code: ErrorCodes.DATABASE_ERROR
    });
  }

});

usersRouter.get('/current', userVerify('jwt', ["USER", "ADMIN"]), passportCall('jwt'), async (req, res) => {
  try {
    const data = req.user
    const user = new currentDTO(data.user)
    req.user = user
    res.send(req.user);
  } catch (error) {
    CustomError.createError({
      name: 'usersRouterCurrent error',
      cause: 'Server fail to charge current User',
      message: 'Server ERROR, no se pudo cargar el usuario actual',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

usersRouter.get('/private', userVerify('jwt', ["ADMIN"]), passportCall('jwt'), authorization(), async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    CustomError.createError({
      name: 'usersRouterPrivate error',
      cause: 'Server fail to chargue private route',
      message: 'Server ERROR, no se pudo cargar la vista privada',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});


export default usersRouter;