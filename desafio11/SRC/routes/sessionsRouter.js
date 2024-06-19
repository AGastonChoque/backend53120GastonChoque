import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import { cartsController } from "../dao/controllers/cartsController.js";
import { generateToken } from "../utils/jwt.js";


const carts = new cartsController()
const sessionsRouter = Router();

sessionsRouter.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {
  try {
    return res.send({ status: 'success', message: 'Success' });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message })
    return [];
  }
});

sessionsRouter.get("/githubCallback", passport.authenticate("github", { failureRedirect: "/failRegister", session: false }), async (req, res) => {
  const user = req.user
  try {
    user.failLogin = false;
    let newCart = await carts.addCart()
    user.cId = newCart._id
    const PRIVATE_KEY = "secretKeyJWT"
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: "1h"})
    res.cookie('cookieToken', token, { httpOnly: true, secure: true, maxAge: 60*60*1000 })
    return res.redirect("/products");
  } catch (error) {
    user.failLogin = true;
    res.status(500).send({ status: "error", error: error.message })
    return [];
  }
});

export default sessionsRouter;