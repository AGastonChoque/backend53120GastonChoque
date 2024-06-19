import { Router } from "express"
import { cartManager } from "../js/cartManager.js"

const cartsRouter = Router();

const carts = new cartManager("./SRC/FS/carts.json")


cartsRouter.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        let allCarts = await carts.getCarts();
        let limitCarts = allCarts.slice(0, limit);
        limit ? res.send(limitCarts) : res.send(allCarts)
    } catch (error) {
        res.status(500).send({ status: "error", error: "Server ERROR, no se pudieron obtener los carritos" });
        return [];
    }
});

cartsRouter.post('/', async (req, res) => {
    try {
        try {
            const result = await carts.addCart();
            res.send(result);
        } catch (error) {
            res.status(400).send(error.message);
        }
    } catch {
        res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar el carrito" })
        return [];
    }
});

cartsRouter.post('/:cId/products/:pId', async (req, res) => {
    try {
        try {
            const cId = parseInt(req.params.cId);
            const pId = parseInt(req.params.pId);
            const result = await carts.updateCart(cId, pId);
            res.send(result);
        } catch (error) {
            res.status(400).send(error.message);
        }
    } catch {
        res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar el carrito" })
        return [];
    }
});

cartsRouter.delete('/:cId/products/:pId', async (req, res) => {
    try {
        try {
            const cId = parseInt(req.params.cId);
            const pId = parseInt(req.params.pId);
            const result = await carts.deleteProductInCart(cId, pId);
            res.send(result);
        } catch (error) {
            res.status(400).send(error.message);
        }
    } catch {
        res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar el carrito" })
        return [];
    }
});

export default cartsRouter

