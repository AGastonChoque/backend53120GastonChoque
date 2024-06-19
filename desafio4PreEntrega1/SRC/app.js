import express from "express";
import productsRouter from "./routes/productsRouter.js"
import cartsRouter from "./routes/cartsRouter.js"

const app = express()
app.use(express.urlencoded({extended : true}));
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Bienvenido a la ruta raiz")
  })

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});