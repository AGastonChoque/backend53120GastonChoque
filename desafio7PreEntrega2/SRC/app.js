import express from "express";
import { Server } from "socket.io"
import handlebars from "express-handlebars"
import mongoose from "mongoose";

import productsRouter from "./routes/productsRouter.js"
import cartsRouter from "./routes/cartsRouter.js"
import viewsRouter from "./routes/viewsRouter.js"
import __dirname from "./utils.js";
import webSocket from './websocket.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/../public`));

const connectionBBDD = async() => {
  try{
    const uri = "mongodb+srv://agastonchoque:39006538@cluster0.pbe0mgy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    const BD = "ecommerce"
    await mongoose.connect(uri, {dbName: BD})
    console.log("Conectado a la bbdd remota de mongoDB Atlas");

  }catch(error){
    console.log("Fallo la conexion");
  }
}

connectionBBDD()

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
app.use("/", viewsRouter);


const PORT = 8080
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});

const io = new Server(httpServer)

webSocket(io);
