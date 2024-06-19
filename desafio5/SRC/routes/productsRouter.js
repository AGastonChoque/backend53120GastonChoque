import { Router } from "express"
import { productManager } from "../js/productManager.js"

const productsRouter = Router();

const products = new productManager("./SRC/FS/products.json")


productsRouter.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        let allProducts = await products.getProducts();
        let limitProducts = allProducts.slice(0, limit);
        res.render("home", {
            title: "Home",
            cssName: "general.css",
            products: limit ? limitProducts : allProducts
        })
    } catch (error) {
        res.status(500).send({ status: "error", error: "Server ERROR, no se pudieron obtener los productos" });
        return [];
    }
});

productsRouter.get("/:pId", async (req, res) => {
    try {
        try {
            const id = parseInt(req.params.pId);
            const result = await products.getProductById(id)
            res.send(result)
        } catch (error) {
            res.status(400).send(error.message);
        }
    } catch {
        res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener el producto" })
        return [];
    }
})

productsRouter.post('/', async (req, res) => {
    try {
        try {
            const newProduct = req.body;
            const result = await products.addProduct(newProduct);
            res.send(result);
        } catch (error) {
            res.status(400).send(error.message);
        }
    } catch {
        res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar el producto" })
        return [];
    }
});

productsRouter.put("/", async (req, res) => {
    try {
        try {
            const id = req.body.id;
            const updateProduct = req.body.newProduct
            const result = await products.updateProduct(id, updateProduct);
            res.send(result);
        } catch (error) {
            res.status(400).send(error.message);
        }
    } catch {
        res.status(500).send({ status: "error", error: "Server ERROR, no se pudo eliminar el producto" })
        return [];
    }
});

productsRouter.delete("/", async (req, res) => {
    try {
        try {
            const id = req.body.id;
            const result = await products.deleteProduct(id);
            res.send(result);
        } catch (error) {
            res.status(400).send(error.message);
        }
    } catch {
        res.status(500).send({ status: "error", error: "Server ERROR, no se pudo eliminar el producto" })
        return [];
    }
});


export default productsRouter

