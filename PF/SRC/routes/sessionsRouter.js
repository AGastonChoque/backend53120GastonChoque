import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import { cartsController } from "../controllers/cartsController.js";
import { generateToken } from "../utils/jwt.js";
import CustomError from '../services/errors/CustomError.js';
import { ErrorCodes } from '../services/errors/enums.js';


const carts = new cartsController()
const sessionsRouter = Router();

sessionsRouter.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {
  try {
    return res.send({ status: 'success', message: 'Success' });
  } catch (error) {
    /* res.status(500).send({ status: "error", error: error.message })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'sessionsRouterGet error'`);
    CustomError.createError({
      name: 'sessionsRouterGet error',
      cause: 'Server fail to initializate GitHub',
      message: 'Server ERROR, no se pudo conectar a GitHub',
      code: ErrorCodes.DATABASE_ERROR
  });
  }
});

sessionsRouter.get("/githubCallback", passport.authenticate("github", { failureRedirect: "/failRegister", session: false }), async (req, res) => {
  const user = req.user
  try {
    carts.addUid(user)
    const PRIVATE_KEY = "secretKeyJWT"
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: "1h"})
    res.cookie('cookieToken', token, { httpOnly: true, secure: true, maxAge: 60*60*1000 })
    req.user = user
    return res.redirect("/products");
  } catch (error) {
    user.failLogin = true;
    /* res.status(500).send({ status: "error", error: error.message })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'sessionsRouterGetCallback error'`);
    CustomError.createError({
      name: 'sessionsRouterGetCallback error',
      cause: 'Server fail to charge GitHub callback',
      message: 'Server ERROR, no se pudo obtener el callback de GitHub',
      code: ErrorCodes.DATABASE_ERROR
  });
  }
});

export default sessionsRouter;