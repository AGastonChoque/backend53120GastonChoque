import express from "express";
import { ProductManager } from "./ProductManager.js";
import { arrProducts } from "./products.js";

const app = express()
app.use(express.urlencoded({extended : true}));

const products = new ProductManager("./desafio3/SRC/FS/products.json");

// Se cargan los productos
/* products.addProduct(arrProducts[0]);
products.addProduct(arrProducts[1]);
products.addProduct(arrProducts[2]);
products.addProduct(arrProducts[3]);
products.addProduct(arrProducts[4]);
products.addProduct(arrProducts[5]);
products.addProduct(arrProducts[6]);
products.addProduct(arrProducts[7]);
products.addProduct(arrProducts[8]);
products.addProduct(arrProducts[9]); */


app.get("/products", async (req, res) => {
    try {
        const { limit } = req.query;
        let allProducts = await products.getProducts();
        let limitProducts = allProducts.slice(0, limit);
        limit ? res.send(limitProducts) : res.send(allProducts)
    } catch (error) {
        console.log(error, "Server ERROR, no se pudieron obtener los productos.");
        return [];
    }
});

app.get("/products/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        products.getProductById(id) ? res.send(await products.getProductById(id)) : res.send(["El producto no existe"])
    } catch (error) {
        console.log(error, "Server ERROR, no se pudo obtener el producto.");
        return [];
    }
})

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});