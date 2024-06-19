import { Router } from "express";
import passport from "passport";

import { cartManager } from "../dao/cartManager.js";


const carts = new cartManager()
const sessionsRouter = Router();

sessionsRouter.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {
  try {
    req.session.failRegister = false
    return res.send({ status: 'success', message: 'Success' });
  } catch (error) {
    req.session.failRegister = true;
    res.status(500).send({ status: "error", error: error.message })
    return [];
  }
});

sessionsRouter.get("/githubCallback", passport.authenticate("github", { failureRedirect: "/failRegister" }), async (req, res) => {
  try {
    const user = req.user
    req.session.failRegister = false;
    let newCart = await carts.addCart()
    user.cId = newCart._id
    req.session.user = user
    return res.redirect("/products");
  } catch (error) {
    req.session.failRegister = true;
    res.status(500).send({ status: "error", error: error.message })
    return [];
  }
});

export default sessionsRouter;