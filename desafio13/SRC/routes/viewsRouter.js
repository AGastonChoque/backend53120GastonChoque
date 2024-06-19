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


viewsRouter.get('/', userVerify("jwt", ["PUBLIC", "USER", "ADMIN"]), async (req, res) => {
  try {
    if (req.user.user) {
      res.render("index", {
        title: "Home",
        cssName: "general.css",
        user: req.user.user
    })
    } else {
    res.redirect("/login")
    }
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del Home" })
    return []; */
    CustomError.createError({
      name: 'viewsRouterHome error',
      cause: 'Server fail to view home',
      message: 'Server ERROR, no se pudo obtener la vista del Home',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get("/realtimeproducts", userVerify('jwt', ["ADMIN"]), passportCall('jwt'), async (req, res) => {
  try {
    res.render("realTimeProducts", {
      title: "Real time products",
      cssName: "realTimeProducts.css",
      user: req.user.user
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista realtimeproducts" })
    return []; */
    CustomError.createError({
      name: 'viewsRouterRealTimeProducts error',
      cause: 'Server fail to view realtimeproducts',
      message: 'Server ERROR, no se pudo obtener la vista realtimeproducts',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

viewsRouter.get("/products", userVerify("jwt", ["USER", "ADMIN"]), passportCall("jwt"), async (req, res) => {
  try {
    const { limit, page, query, sort, status } = req.query;
    let result = await products.getProducts(limit, page, query, sort, status);
    let baseURL = "http://localhost:8080/products"
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
    CustomError.createError({
      name: 'viewsRouterProducts error',
      cause: 'Server fail to view products',
      message: 'Server ERROR, no se pudo obtener la vista de productos',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get("/carts/:cId", userVerify('jwt', ["USER", "ADMIN"]), passportCall('jwt'), async (req, res) => {
  try {
    const cId = req.params.cId
    const cart = await carts.getCartById(cId)
    res.render("cart", {
      title: "Carrito",
      cssName: "general.css",
      user: req.user.user
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del carrito" })
    return []; */
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
    CustomError.createError({
      name: 'viewsRouterCarts error',
      cause: 'Server fail to view carts',
      message: 'Server ERROR, no se pudo obtener la vista de los carritos',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

viewsRouter.get('/products/:pid', userVerify('jwt', ["USER", "ADMIN"]), passportCall('jwt'), async (req, res) => {
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
    CustomError.createError({
      name: 'viewsRouterProduct error',
      cause: 'Server fail to view product',
      message: 'Server ERROR, no se pudo obtener la vista del producto',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});

viewsRouter.get('/login', async (req, res) => {
  try {
    res.render("login", {
      title: "Login",
      cssName: "realTimeProducts.css"
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del login" })
    return []; */
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
    res.render("failRegister", {
      title: "Register error",
      cssName: "general.css"
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del register" })
    return []; */
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
    res.render("failLogin", {
      title: "Login error",
      cssName: "general.css"
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del register" })
    return []; */
    CustomError.createError({
      name: 'viewsRouterFailLogin error',
      cause: 'Server fail to view failLogin',
      message: 'Server ERROR, no se pudo obtener la vista del failLogin',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get('/current', userVerify("jwt", ["USER", "ADMIN"]), passportCall('jwt'), async (req, res) => {
  try {
    res.render("index", {
      title: "Home",
      cssName: "general.css",
      user: req.user.user
    });
  } catch {
    /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del Home" })
    return []; */
    CustomError.createError({
      name: 'viewsRouterCurrent error',
      cause: 'Server fail to view current',
      message: 'Server ERROR, no se pudo obtener la vista del current',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
})

viewsRouter.get('/:cId/purchase', userVerify('jwt', ["USER", "ADMIN"]), async (req, res) => {
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
    CustomError.createError({
      name: 'viewsRouterPurchase error',
      cause: 'Server fail to view purchase',
      message: 'Server ERROR, no se pudo obtener la vista de la compra',
      code: ErrorCodes.DATABASE_ERROR
    });
  }
});


export default viewsRouter