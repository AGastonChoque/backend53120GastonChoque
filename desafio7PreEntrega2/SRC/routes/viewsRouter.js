import { Router } from "express";

import { productManager } from "../dao/productManager.js";
import { cartManager } from "../dao/cartManager.js";

const viewsRouter = Router();

const products = new productManager()
const carts = new cartManager()

viewsRouter.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {
    title: "Real time products",
    cssName: "realTimeProducts.css"
  });
});

viewsRouter.get("/products", async (req, res) => {
  const { limit, page, query, sort, status } = req.query;
  let result = await products.getProducts(limit, page, query, sort, status);
  let baseURL = "http://localhost:8080/products"
  result.prevLink = result.prevPage ? `${baseURL}?page=${result.prevPage}` : null,
  result.nextLink = result.nextPage ? `${baseURL}?page=${result.nextPage}` : null,
  result.isValid = !(page <= 0 || page > result.totalPages);

  res.render("products", {
    title: "Productos",
    cssName: "products.css",
    data: result
  })
})

viewsRouter.get("/carts/:cId", async (req, res) => {
  const cId = req.params.cId
  const cart = await carts.getCartById(cId)
  res.render("cart", {
    title: "Carrito",
    cssName: "cart.css",
    products: cart.products
  });
});

viewsRouter.get('/products/:pid', async (req, res) => {
  const pId = req.params.pid
  const product = await products.getProductById(pId)
  res.render("item", {
    title: "Producto: " + product.title,
    cssName: "item.css",
    product: product
  });
});

export default viewsRouter