import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import mongoStore from "connect-mongo";
import passport from "passport";
import cors from "cors";

import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import __dirname from "./utils/utils.js";
import webSocket from "./websocket.js";
import initializatePassport from "./config/passportConfig.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import config from "./config.js";
import errorHandler from "./middlewares/errors/index.js"
import { addLogger } from "./utils/logger.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/../../public`));

app.use(cookieParser());

const uri = config.mongo_url
const connectionBBDD = async() => {
  try{
    await mongoose.connect(uri)
    console.log("Conectado a la bbdd remota de mongoDB Atlas");

  }catch(error){
    console.log("Fallo la conexion");
  }
}

connectionBBDD()

app.use(cors({
  origin: "http://localhost:5500",
  methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/../views`);
app.set("view engine", "handlebars");


initializatePassport();
app.use(passport.initialize());

app.use(addLogger)

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", usersRouter);
app.use("/api/sessions", sessionsRouter);

app.use(errorHandler);



const PORT = config.port
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});

const io = new Server(httpServer)

webSocket(io);
