import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import { cartsController } from "../dao/controllers/cartsController.js";
import { isAdmin } from "../utils/functionsUtils.js"
import { generateToken, authToken } from "../utils/jwt.js";
import { passportCall, userVerify } from "../utils/authUtil.js";
import { authorization } from "../middlewares/auth.js";

const usersRouter = Router();
const carts = new cartsController();

usersRouter.post("/register", passport.authenticate("register", { failureRedirect: "/failRegister", session: false }), async (req, res) => {
  try {
    req.user.failRegister = false;
    return res.redirect("/login");
  } catch (error) {
    req.user.failRegister = true;
    res.status(500).send({ status: "error", error: error.message })
    return [];
  }
});

usersRouter.post("/login", passport.authenticate("login", { failureRedirect: "/failLogin", session: false }), async (req, res) => {
  const user = req.user
  try {
    user.role = "User"
    user.failLogin = false

    if (isAdmin(req.body.email, req.body.password)) {
      user.role = "Admin"
    }

    delete user.password

    let newCart = await carts.addCart()
    user.cId = newCart._id

    const PRIVATE_KEY = "secretKeyJWT"
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: "1h"})

    res.cookie('cookieToken', token, { httpOnly: true, secure: true, maxAge: 60*60*1000 })

    req.user = user
    return res.redirect("/products")
  } catch (error) {
    user.failLogin = true;
    res.status(500).send({ status: "error", error: error.message })
    return [];
  }
});

usersRouter.get("/logout", passportCall('jwt'), (req, res) => {
  try {
    const data = req.user
    carts.deleteCart(data.user.cId)
    res.clearCookie("cookieToken")
    return res.redirect("/login")
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message })
    return [];
  }

});

usersRouter.get('/current', passportCall('jwt'), (req, res) => {
    res.send(req.user);
});

usersRouter.get('/private', passportCall('jwt'), authorization(), (req, res) => {
  res.send(req.user);
});


export default usersRouter;