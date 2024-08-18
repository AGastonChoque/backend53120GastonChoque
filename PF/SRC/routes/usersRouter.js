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
import { usersController } from "../controllers/usersControler.js";
import { upLoader, setDestination } from "../utils/utils.js";

const usersRouter = Router();
const carts = new cartsController();
const users = new usersController();

usersRouter.post("/register", passport.authenticate("register", { failureRedirect: "/failRegister", session: false }), async (req, res) => {
  try {
    req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'usersRouterRegister new user Register'`);
    return res.redirect("/login");
  } catch (error) {
    req.user.failRegister = true;
    /* res.status(500).send({ status: "error", error: error.message })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'usersRouterRegister error'`);
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

    carts.addUid(user)

    user = req.user

    const updateLastConnect = await users.lastConnect(user._id);

    const PRIVATE_KEY = config.PRIVATE_KEY_jWT
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" })

    res.cookie('cookieToken', token, { httpOnly: true, secure: true, maxAge: 60 * 60 * 1000 })

    req.user = user

    return res.redirect("/products")
  } catch (error) {
    user.failLogin = true;
    /* res.status(500).send({ status: "error", error: error.message })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'usersRouterLogin error'`);
    CustomError.createError({
      name: 'usersRouterLogin error',
      cause: 'Server fail to login user',
      message: 'Server ERROR, no se pudo loguear el usuario',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

usersRouter.post("/forgetpassword", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await users.findUserAndSendEmailRecover(email);
    
    if (!user) {
      return res.redirect("/sendEmailRecoverFail")
    }

    return res.redirect("/sendEmailRecover");
  } catch (error) {
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'usersRouterRecoverPassword error'`);
    CustomError.createError({
      name: 'usersRouterRecoverPassword error',
      cause: 'Server fail to reccover password',
      message: 'Server ERROR, no se pudo recuperar contraseña',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

usersRouter.post("/restorePassword", async (req, res) => {
  try {
    const email = req.body.email;
    const newPassword= req.body.password;
    const result = await users.updateUserPassword(email, newPassword);

    if(!result){
      return res.redirect("/failRecover")
    }
  
    return res.redirect("/login");
  } catch (error) {
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'usersRouterRestorePassword error'`);
    CustomError.createError({
      name: 'usersRouterRestorePassword error',
      cause: 'Server fail to restore password',
      message: 'Server ERROR, no se pudo cambiar la contraseña',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

usersRouter.get("/premium/:uId", userVerify('jwt', ["ADMIN"]), async (req, res) => {
  try {
    const uId = req.params.uId;
    const result = await users.updateUserRole(uId);

    res.send(result);
  } catch (error) {
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'usersRouterChangeUser error'`);
    CustomError.createError({
      name: 'usersRouterChangeUser error',
      cause: 'Server fail to chargue change user route',
      message: 'Server ERROR, no se pudo cargar la vista de cambio de usuario',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

usersRouter.post("/:uId/documents", userVerify('jwt', ["USER", "PREMIUM"]), setDestination('documents') ,upLoader.array('docs', 2), async (req, res) => {
  try {
    const uId = req.user.user._id;
    const files = req.files
    const result = await users.updateUserDocuments(uId, files);
    return res.redirect("/products");
  } catch (error) {
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'usersRouterChangeUser error'`);
    CustomError.createError({
      name: 'usersRouterChangeUser error',
      cause: 'Server fail to chargue change user route',
      message: 'Server ERROR, no se pudo cargar la vista de cambio de usuario',
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
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'usersRouterLogout error'`);
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
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'usersRouterCurrent error'`);
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
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'usersRouterPrivate error'`);
    CustomError.createError({
      name: 'usersRouterPrivate error',
      cause: 'Server fail to chargue private route',
      message: 'Server ERROR, no se pudo cargar la vista privada',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

usersRouter.get('/', userVerify('jwt', ["ADMIN"]), passportCall('jwt'), async (req, res) => {
  try {
    const result = await users.getUsers();
    res.send(result);
  } catch (error) {
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'usersRouterPrivate error'`);
    CustomError.createError({
      name: 'usersRouterPrivate error',
      cause: 'Server fail to chargue private route',
      message: 'Server ERROR, no se pudo cargar la vista privada',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

usersRouter.delete('/delete', userVerify('jwt', ["ADMIN"]), async (req, res) => {
  try {
    const result = await users.deleteInactivity();
    res.send(req.user);
  } catch (error) {
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'usersRouteDelete error'`);
    CustomError.createError({
      name: 'usersRouteDelete error',
      cause: 'Server fail to chargue delete route',
      message: 'Server ERROR, no se pudo cargar la vista de eliminacion de usuarios',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

usersRouter.get('/delete', userVerify('jwt', ["ADMIN"]), async (req, res) => {
  try {
    const user = req.user
    const result = await users.deleteInactivity(user);
    res.send(req.user);
  } catch (error) {
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'usersRouteDelete error'`);
    CustomError.createError({
      name: 'usersRouteDelete error',
      cause: 'Server fail to chargue delete route',
      message: 'Server ERROR, no se pudo cargar la vista de eliminacion de usuarios',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});


export default usersRouter;