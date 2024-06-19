import { productManager } from "./dao/productManager.js";
import { cartManager } from "./dao/cartManager.js";
const products = new productManager();
const carts = new cartManager();

const webSocket = (io) => {
  io.on("connection", async (socket) => {
    /* let newCart = await carts.addCart() */
    console.log("Nuevo cliente conectado -----> ", socket.id);

    let limit = 999

    socket.on("getProducts", async () => {
      let productsData = await products.getProducts(limit);
      io.emit("productsRender", productsData);
    });

    socket.on("addProduct", async (productData) => {
      await products.addProduct(productData);
      let productsData = await products.getProducts(limit);
      io.emit("productsRender", productsData);
    });

    socket.on("deleteProduct", async (pId) => {
      await products.deleteProduct(pId);
      let productsData = await products.getProducts(limit);
      io.emit("productsRender", productsData);
    });

    /* socket.on("addProductToCart", async (pId) => {
      const match = newCart.match(/El carrito "([a-f\d]{24})" fue agregado correctamente/);
      if (match) {
        const cId = match[1];
        await carts.updateCart(cId, pId);
      }
    }) */


  });


}

export default webSocket
