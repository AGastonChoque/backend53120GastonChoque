import { Router } from "express";

import { productManager } from "../dao/productManager.js";
import { cartManager } from "../dao/cartManager.js";
import {auth} from '../middlewares/auth.js';

const viewsRouter = Router();

const products = new productManager()
const carts = new cartManager()


viewsRouter.get('/', auth, async (req, res) => {
  try {
    res.render("index", {
      title: "Home",
      cssName: "general.css",
      user: req.session.user
    });
  } catch {
    res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del Home" })
    return [];
  }
})

viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realTimeProducts", {
      title: "Real time products",
      cssName: "realTimeProducts.css",
      user: req.session.user
    });
  } catch {
    res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista realtimeproducts" })
    return [];
  }
});

viewsRouter.get("/products", async (req, res) => {
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
      user: req.session.user
    })
  } catch {
    res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista de productos" })
    return [];
  }
})

viewsRouter.get("/carts/:cId", async (req, res) => {
  try {
    const cId = req.params.cId
    const cart = await carts.getCartById(cId)
    res.render("cart", {
      title: "Carrito",
      cssName: "general.css",
      user: req.session.user
    });
  } catch {
    res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del carrito" })
    return [];
  }
});

viewsRouter.get('/products/:pid', async (req, res) => {
  try {
    const pId = req.params.pid
    const product = await products.getProductById(pId)
    res.render("item", {
      title: "Producto: " + product.title,
      cssName: "item.css",
      product: product,
      user: req.session.user
    });
  } catch {
    res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del producto" })
    return [];
  }
});

viewsRouter.get('/login', async (req, res) => {
  try {
    res.render("login", {
      title: "Login",
      cssName: "realTimeProducts.css",
      user: req.session.user
    });
  } catch {
    res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del login" })
    return [];
  }
})

viewsRouter.get('/register', async (req, res) => {
  try {
    res.render("register", {
      title: "Register",
      cssName: "realTimeProducts.css",
      user: req.session.user
    });
  } catch {
    res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener la vista del register" })
    return [];
  }
})


export default viewsRouter