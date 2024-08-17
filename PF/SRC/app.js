import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import mongoStore from "connect-mongo";
import passport from "passport";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUiExpress from "swagger-ui-express"

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

/* const uri = config.mongo_url */
const connectionBBDD = async() => {
  try{
    await mongoose.connect(process.env.mongo_url)
    console.log("Conectado a la bbdd remota de mongoDB Atlas");

  }catch(error){
    console.log("Fallo la conexion");
  }
}

connectionBBDD()

const PORT = process.env.port || config.port

app.use(cors({
  origin: `http://localhost:${PORT}`,
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

const swaggerOptions = {
  definition: {
      openapi: '3.0.1',
      info: {
          title: 'Documentación sistema AdoptMe',
          description: 'Esta documentación cubre toda la API habilitada para AdoptMe',
      },
  },
  apis: ['./src/docs/**/*.yaml'],
};
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


const httpServer = app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});

const io = new Server(httpServer)

webSocket(io);
