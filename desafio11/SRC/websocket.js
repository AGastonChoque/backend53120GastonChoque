import { productsController } from "./dao/controllers/productsController.js";
import { cartsController } from "./dao/controllers/cartsController.js";
const products = new productsController();
const carts = new cartsController();

const webSocket = (io) => {
  io.on("connection", async (socket) => {
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

    socket.on("addProductToCart", async (cId, pId) => {
      await carts.updateCart(cId, pId);
    })

    socket.on("getCart", async (cId) => {
      let cartData = await carts.getCartById(cId);
      io.emit("cartRender", cartData);
    });

    socket.on("deleteProductToCart", async (cId, pId) => {
      await carts.deleteProductInCart(cId, pId);
      let cartData = await carts.getCartById(cId);
      io.emit("cartRender", cartData);
    });

    socket.on("clearCart", async (cId) => {
      await carts.clearCart(cId);
      let cartData = await carts.getCartById(cId);
      io.emit("cartRender", cartData);
    });


  });


}

export default webSocket
