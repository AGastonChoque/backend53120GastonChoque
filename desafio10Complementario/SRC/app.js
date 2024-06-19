import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoStore from "connect-mongo";
import passport from "passport";

import productsRouter from "./routes/productsRouter.js"
import cartsRouter from "./routes/cartsRouter.js"
import viewsRouter from "./routes/viewsRouter.js"
import usersRouter from "./routes/usersRouter.js"
import __dirname from "./utils/utils.js";
import webSocket from "./websocket.js";
import initializatePassport from "./config/passportConfig.js"
import sessionsRouter from "./routes/sessionsRouter.js";



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/../../public`));


const uri = "mongodb+srv://agastonchoque:39006538@cluster0.pbe0mgy.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
const connectionBBDD = async() => {
  try{
    await mongoose.connect(uri)
    console.log("Conectado a la bbdd remota de mongoDB Atlas");

  }catch(error){
    console.log("Fallo la conexion");
  }
}

connectionBBDD()

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/../views`);
app.set("view engine", "handlebars");

app.use(session(
  {
      store: mongoStore.create(
          {
              mongoUrl: uri,
              ttl: 3600
          }
      ),
      secret: 'secretPhrase',
      resave: true,
      saveUninitialized: true
  }
));

initializatePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", usersRouter);
app.use("/api/sessions", sessionsRouter);


const PORT = 8080
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});

const io = new Server(httpServer)

webSocket(io);
