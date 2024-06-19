import express from "express";
import productsRouter from "./routes/productsRouter.js"
import cartsRouter from "./routes/cartsRouter.js"
import handlebars from "express-handlebars"
import __dirname from "./utils.js";
import { Server } from "socket.io"
import { productManager } from "./js/productManager.js";


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/../public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");


app.get('/', (req, res) => {
  try {
    res.render("index",
      {
        title: "Backend",
        name: "Gaston Choque",
        course: "Backend",
        comision: "53120",
        desafio: "Desafio 5",
        cssName: "general.css"
      }
    )
  } catch (error) {
    res.status(500).send({ status: "error", error: "Server ERROR, no se pudieron obtener los carritos" });
    return [];
  }
});
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


const PORT = 8080
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer)

const products = new productManager("./SRC/FS/products.json")

app.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {
    title: "Real time products",
    cssName: "realTimeProducts.css"
  });
});

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado -----> ", socket.id);

  socket.on("getProducts", async () => {
    let productsData = await products.getProducts();
    socketServer.emit("productsRender", productsData);
  });

  socket.on("addProduct", async (productData) => {
    await products.addProduct(productData);
  });

  socket.on("deleteProduct", async (productId) => {
    await products.deleteProduct(productId);
  });
});
