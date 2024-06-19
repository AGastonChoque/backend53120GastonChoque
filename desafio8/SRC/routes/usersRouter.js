import {Router} from 'express';

import usersModel from '../dao/models/usersModel.js';
import {createHash, isValidPassword, isAdmin} from '../utils/functionsUtils.js';
import { cartManager } from "../dao/cartManager.js"

const usersRouter = Router();
const carts = new cartManager();

usersRouter.post("/register", async (req, res) => {
    try {
        req.session.failRegister = false;
        let userVerify = await usersModel.findOne({ email: req.body.formEmail })

        if (!req.body.formEmail || !req.body.formPassword) throw new Error("Register error, introduzca su email y contraseña.");

        if (userVerify) {
            req.session.failRegister = true;
            throw new Error("Register error, el correo ya esta registrado.")
        }

        const newUser = {
            first_name: req.body.formName ?? "",
            last_name: req.body.formLastname ?? "",
            email: req.body.formEmail,
            age: req.body.formAge ?? "",
            password: createHash(req.body.formPassword)
        }
        await usersModel.create(newUser);
        res.redirect("/login");
    } catch (error) {
        req.session.failRegister = true;
        res.status(500).send({ status: "error", error: error.message })
        return [];
      }
});

usersRouter.post("/login", async (req, res) => {
    try {
        req.session.failLogin = false;
        req.session.role = "User"
        const result = await usersModel.findOne({email: req.body.formEmail}).lean();
        if (!result) {
            req.session.failLogin = true;
            return res.redirect("/login");
        }
        
        if (!isValidPassword(result.password, req.body.formPassword)) {
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        if (isAdmin(req.body.formEmail, req.body.formPassword )) {
            req.session.role = "Admin"
        }
        
        delete result.password;

        let newCart = await carts.addCart()
        result.cId = newCart._id
        req.session.user = result;

        return res.redirect("/products");
    } catch {
        req.session.failLogin = true;
        res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del login" })
        return [];
      }
});

usersRouter.get("/logout", (req, res) => {
    try{
        carts.deleteCart(req.session.user.cId)
      req.session.destroy(error => {
        if(!error) return res.redirect("/login");
    })
    }catch {
      res.status(500).send({ status: "error", error: "Server ERROR, no se pudo cerrar la sesion" })
      return [];
    }
    
  });

export default usersRouter;