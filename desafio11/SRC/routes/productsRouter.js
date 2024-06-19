import { Router } from "express"

import { productsController } from "../dao/controllers/productsController.js"


const productsRouter = Router();

const products = new productsController()


productsRouter.get("/", async (req, res) => {
    try {
        const { limit=4, page, query, sort, status } = req.query;
        let result = await products.getProducts(limit, page, query, sort, status);
        let baseURL = "http://localhost:8080/api/products"
        result.prevLink = result.prevPage ? `${baseURL}?page=${result.prevPage}` : null,
            result.nextLink = result.nextPage ? `${baseURL}?page=${result.nextPage}` : null,
            result.isValid = !(page <= 0 || page > result.totalPages);
        res.render("apiProducts", {
            title: "API Products",
            cssName: "general.css",
            data: result
        })
    } catch (error) {
        res.status(500).send({ status: "error", error: "Server ERROR, no se pudieron obtener los productos" });
        return [];
    }
});

productsRouter.get("/:pId", async (req, res) => {
    try {
        try {
            const id = req.params.pId;
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

