import { productsController } from "./controllers/productsController.js";
import { cartsController } from "./controllers/cartsController.js";
import { tiketsController } from "./controllers/tiketController.js";
const products = new productsController();
const carts = new cartsController();
const tikets = new tiketsController()

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

    socket.on("buyCart", async (cId, userEmail) => {
      console.log(cId);
      console.log(userEmail);
      const { purchasedProducts, notPurchased } = await carts.buyCart(cId)
      let cartData = await carts.getCartById(cId);
      let newTiket = await tikets.createTiket(purchasedProducts, cId)
      let sendEmailPurchase = await tikets.sendEmailPurchase(userEmail)
      io.emit("cartRender", cartData);
      io.emit("toPurchase", { url: `/${cId}/purchase`});
    });

    socket.on("getTiket", async (purchaserEmail) => {
      let tiketData = await tikets.findTiketByEmail({purchaser: purchaserEmail});
      io.emit("tiketRender", tiketData);
    });


  });


}

export default webSocket
