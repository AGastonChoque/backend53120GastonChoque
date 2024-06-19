import { Router } from "express";
import passport from "passport";

import { cartManager } from "../dao/cartManager.js";
import { isAdmin } from "../utils/functionsUtils.js"

const usersRouter = Router();
const carts = new cartManager();

usersRouter.post("/register", passport.authenticate("register", { failureRedirect: "/failRegister" }), async (req, res) => {
  try {
    req.session.failRegister = false;
    return res.redirect("/login");
  } catch (error) {
    req.session.failRegister = true;
    res.status(500).send({ status: "error", error: error.message })
    return [];
  }
});

usersRouter.post("/login", passport.authenticate("login", { failureRedirect: "/failLogin" }), async (req, res) => {
  try {
    const user = req.user

    req.session.role = "User"
    req.session.failLogin = false

    if (isAdmin(req.body.email, req.body.password)) {
      req.session.role = "Admin"
    }

    delete user.password

    let newCart = await carts.addCart()
    user.cId = newCart._id
    req.session.user = user;

    return res.redirect("/products");
  } catch (error) {
    req.session.failLogin = true;
    res.status(500).send({ status: "error", error: error.message })
    return [];
  }
});

usersRouter.get("/logout", (req, res) => {
  try {
    carts.deleteCart(req.session.user.cId)
    req.session.destroy(error => {
      if (!error) return res.redirect("/login");
    })
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message })
    return [];
  }

});

export default usersRouter;