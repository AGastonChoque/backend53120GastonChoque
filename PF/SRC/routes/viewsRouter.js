import { Router } from "express";

import { productsController } from "../controllers/productsController.js";
import { cartsController } from "../controllers/cartsController.js";
import { tiketsController } from "../controllers/tiketController.js";
/* import {auth} from '../middlewares/auth.js'; */
import { authToken } from "../utils/jwt.js";
import { passportCall, userVerify } from "../utils/authUtil.js";
import { generateRandomProducts } from "../utils/fakerUtils.js";
import CustomError from '../services/errors/CustomError.js';
import { ErrorCodes } from '../services/errors/enums.js';

const viewsRouter = Router();

const products = new productsController()
const carts = new cartsController()
const tikets = new tiketsController()


viewsRouter.get('/', userVerify("jwt", ["PUBLIC", "USER", "PREMIUM", "ADMIN"]), async (req, res) => {
  try {
    const isUser = req.user.user.role === 'USER';
    if (req.user.user) {
      res.render("index", {
        title: "Home",
        cssName: "general.css",
        user: req.user.user,
        isUser: isUser
    })
    } else {
    res.redirect("/login")
    }
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del Home" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterHome fatal error'`);
    CustomError.createError({
      name: 'viewsRouterHome error',
      cause: 'Server fail to view home',
      message: 'Server ERROR, no se pudo obtener la vista del Home',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get("/realtimeproducts", userVerify('jwt', ["ADMIN", "PREMIUM"]), passportCall('jwt'), async (req, res) => {
  try {
    req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterRealTimeProducts entry'`);
    res.render("realTimeProducts", {
      title: "Real time products",
      cssName: "realTimeProducts.css",
      user: req.user.user
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista realtimeproducts" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterRealTimeProducts fatal error'`);
    CustomError.createError({
      name: 'viewsRouterRealTimeProducts error',
      cause: 'Server fail to view realtimeproducts',
      message: 'Server ERROR, no se pudo obtener la vista realtimeproducts',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

viewsRouter.get("/products", userVerify("jwt", ["USER", "PREMIUM", "ADMIN"]), passportCall("jwt"), async (req, res) => {
  try {
    const { limit, page, query, sort, status } = req.query;
    let result = await products.getProducts(limit, page, query, sort, status);
    let baseURL = "https://backend53120gastonchoque.onrender.com/products"
    result.prevLink = result.prevPage ? `${baseURL}?page=${result.prevPage}` : null,
      result.nextLink = result.nextPage ? `${baseURL}?page=${result.nextPage}` : null,
      result.isValid = !(page <= 0 || page > result.totalPages);

    res.render("products", {
      title: "Productos",
      cssName: "general.css",
      data: result,
      user: req.user.user
    })
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista de productos" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterProducts fatal error'`);
    CustomError.createError({
      name: 'viewsRouterProducts error',
      cause: 'Server fail to view products',
      message: 'Server ERROR, no se pudo obtener la vista de productos',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get("/carts/:cId", userVerify('jwt', ["USER", "PREMIUM", "ADMIN"]), passportCall('jwt'), async (req, res) => {
  try {
    const cId = req.user.user.cId
    const cart = await carts.getCartById(cId)
    res.render("cart", {
      title: "Carrito",
      cssName: "general.css",
      user: req.user.user
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del carrito" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterCart fatal error'`);
    CustomError.createError({
      name: 'viewsRouterCart error',
      cause: 'Server fail to view cart',
      message: 'Server ERROR, no se pudo obtener la vista del carrito',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

viewsRouter.get("/carts", userVerify("jwt", ["ADMIN"]), passportCall('jwt'), async (req, res) => {
  try {
    res.redirect("/products")
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del carrito" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterCarts fatal error'`);
    CustomError.createError({
      name: 'viewsRouterCarts error',
      cause: 'Server fail to view carts',
      message: 'Server ERROR, no se pudo obtener la vista de los carritos',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

viewsRouter.get('/products/:pid', userVerify('jwt', ["USER", "PREMIUM", "ADMIN"]), passportCall('jwt'), async (req, res) => {
  try {
    const pId = req.params.pid
    const product = await products.getProductById(pId)
    res.render("item", {
      title: "Producto: " + product.title,
      cssName: "item.css",
      product: product,
      user: req.user.user
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del producto" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterProduct fatal error'`);
    CustomError.createError({
      name: 'viewsRouterProduct error',
      cause: 'Server fail to view product',
      message: 'Server ERROR, no se pudo obtener la vista del producto',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

viewsRouter.get('/login', userVerify('jwt', ["PUBLIC"]), async (req, res) => {
  try {
    res.render("login", {
      title: "Login",
      cssName: "realTimeProducts.css"
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del login" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterLogin fatal error'`);
    CustomError.createError({
      name: 'viewsRouterLogin error',
      cause: 'Server fail to view login',
      message: 'Server ERROR, no se pudo obtener la vista del login',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get('/register', async (req, res) => {
  try {
    res.render("register", {
      title: "Register",
      cssName: "realTimeProducts.css"
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del register" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterRegister fatal error'`);
    CustomError.createError({
      name: 'viewsRouterRegister error',
      cause: 'Server fail to view register',
      message: 'Server ERROR, no se pudo obtener la vista del register',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get('/failRegister', async (req, res) => {
  try {
    req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterFailRegister entry'`);
    res.render("failRegister", {
      title: "Register error",
      cssName: "general.css"
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del register" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterFailRegister fatal error'`);
    CustomError.createError({
      name: 'viewsRouterFailRegister error',
      cause: 'Server fail to view failregister',
      message: 'Server ERROR, no se pudo obtener la vista del failregister',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get('/failLogin', async (req, res) => {
  try {
    req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterFailLogin entry'`);
    res.render("failLogin", {
      title: "Login error",
      cssName: "general.css"
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del register" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterFailLogin fatal error'`);
    CustomError.createError({
      name: 'viewsRouterFailLogin error',
      cause: 'Server fail to view failLogin',
      message: 'Server ERROR, no se pudo obtener la vista del failLogin',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get('/forgetPassword', async (req, res) => {
  try {
    res.render("forgetPassword", {
      title: "Recuperar contraseña",
      cssName: "realTimeProducts.css"
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del login" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterForgetPassword fatal error'`);
    CustomError.createError({
      name: 'forgetPassword error',
      cause: 'Server fail to view forgetPassword',
      message: 'Server ERROR, no se pudo obtener la vista del recuperador de contraseñas',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get('/restorePassword', passportCall('jwtQuery') , async (req, res) => {
  try {
    res.render("restorePassword", {
      title: "Nueva contraseña!",
      cssName: "realTimeProducts.css"
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del login" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterRestorePassword fatal error'`);
    CustomError.createError({
      name: 'restorePassword error',
      cause: 'Server fail to view restorePassword',
      message: 'Server ERROR, no se pudo obtener la vista del actualizador de contraseñas',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get('/sendEmailRecover', async (req, res) => {
  try {
    req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterRecoverPass entry'`);
    res.render("sendEmailRecover", {
      title: "Correo enviado!",
      cssName: "general.css"
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del register" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterRecoverPass fatal error'`);
    CustomError.createError({
      name: 'viewsRouterRecoverPass error',
      cause: 'Server fail to view recoverPass',
      message: 'Server ERROR, no se pudo obtener la vista del recuperador de contraseñas',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get('/sendEmailRecoverFail', async (req, res) => {
  try {
    req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterFailRecoverPassFail entry'`);
    res.render("sendEmailRecoverFail", {
      title: "Correo invalido!",
      cssName: "general.css"
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del register" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterFailRecoverPass fatal error'`);
    CustomError.createError({
      name: 'viewsRouterFailRecoverPass error',
      cause: 'Server fail to view recoverPassFail',
      message: 'Server ERROR, no se pudo obtener la vista del fallido recuperador de contraseñas',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get('/failRecover', async (req, res) => {
  try {
    req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterFailRecoverPassFail entry'`);
    res.render("failRecover", {
      title: "Error en correo o contraseña!",
      cssName: "general.css"
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del register" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterFailRecoverPass fatal error'`);
    CustomError.createError({
      name: 'viewsRouterFailRecoverPass error',
      cause: 'Server fail to view recoverPassFail',
      message: 'Server ERROR, no se pudo obtener la vista del fallido recuperador de contraseñas',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get('/current', userVerify("jwt", ["USER", "PREMIUM", "ADMIN"]), passportCall('jwt'), async (req, res) => {
  try {
    res.render("index", {
      title: "Home",
      cssName: "general.css",
      user: req.user.user
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del Home" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterCurrent fatal error'`);
    CustomError.createError({
      name: 'viewsRouterCurrent error',
      cause: 'Server fail to view current',
      message: 'Server ERROR, no se pudo obtener la vista del current',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get('/:cId/purchase', userVerify('jwt', ["USER", "PREMIUM", "ADMIN"]), async (req, res) => {
  try {
    const user = req.user.user
    const tiket = await tikets.findTiketByEmail({purchaser: user.email})
    res.render("purchaseTiket", {
      title: "Tiket",
      cssName: "general.css",
      user: user,
      tiket: tiket
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del carrito" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterPurchase fatal error'`);
    CustomError.createError({
      name: 'viewsRouterPurchase error',
      cause: 'Server fail to view purchase',
      message: 'Server ERROR, no se pudo obtener la vista de la compra',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

viewsRouter.get('/upLoaderPremium', userVerify('jwt', ["USER", "PREMIUM", "ADMIN"]), async (req, res) => {
  try {
    const user = req.user.user
    res.render("upLoaderPremium", {
      title: "Carga tu comprobante",
      cssName: "realTimeProducts.css",
      user: user
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del register" })
    return []; */
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'viewsRouterUpLoaderPremium fatal error'`);
    CustomError.createError({
      name: 'viewsRouterUpLoaderPremium error',
      cause: 'Server fail to view uploaderPremium',
      message: 'Server ERROR, no se pudo obtener la vista del uploaderPremium',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get('/loggerTest', async (req, res) => {
  try {
    req.logger.debug(`Este es el test del logger debug`);
    req.logger.http(`Este es el test del logger http`);
    req.logger.info(`Este es el test del logger info`);
    req.logger.warning(`Este es el test del logger warning`);
    req.logger.error(`Este es el test del logger error`);
    req.logger.fatal(`Este es el test del logger fatal`);
    /* req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}`); */
    res.redirect("/products")
  } catch {
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}`);
    CustomError.createError({
      name: 'viewsRouterLogger error',
      cause: 'Server fail to view test logger',
      message: 'Server ERROR, no se pudo obtener la vista del test logger',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});



export default viewsRouter