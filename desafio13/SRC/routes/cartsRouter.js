import { Router } from "express"
import { cartsController } from "../controllers/cartsController.js"
import { tiketsController } from "../controllers/tiketController.js";
import { userVerify } from "../utils/authUtil.js";
import config from "../config.js";
import CustomError from '../services/errors/CustomError.js';
import { ErrorCodes } from '../services/errors/enums.js';

const cartsRouter = Router();

const carts = new cartsController()
const tikets = new tiketsController()


cartsRouter.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        let allCarts = await carts.getCarts();
        let limitCarts = allCarts.slice(0, limit);
        limit ? res.send(limitCarts) : res.send(allCarts)
    } catch (error) {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudieron obtener los carritos" });
        return []; */
        CustomError.createError({
            name: 'cartsRouterGet error',
            cause: 'Server fail to charge carts',
            message: 'Server ERROR, no se pudieron obtener los carritos',
            code: ErrorCodes.DATABASE_ERROR
        });
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
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar el carrito" })
        return []; */
        CustomError.createError({
            name: 'cartsRouterPost error',
            cause: 'Server fail to post carts',
            message: 'Server ERROR, no se pudo agregar el carrito',
            code: ErrorCodes.DATABASE_ERROR
        });
    }
});

cartsRouter.post('/:cId/products/:pId', userVerify('jwt', ["USER"]), async (req, res) => {
    try {
        try {
            const cId = req.params.cId;
            const pId = req.params.pId;
            const result = await carts.updateCart(cId, pId);
            res.send(result);
        } catch (error) {
            res.status(400).send(error.message);
        }
    } catch {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar el carrito" })
        return []; */
        CustomError.createError({
            name: 'cartsRouterPostProduct error',
            cause: 'Server fail to post product in cart',
            message: 'Server ERROR, no se pudo cargar el producto en el carrito',
            code: ErrorCodes.DATABASE_ERROR
        });
    }
});

cartsRouter.put('/:cId', userVerify('jwt', ["ADMIN"]), async (req, res) => {
    try {
        try {
            const cId = req.params.cId;
            const newCart = req.body.newCart;
            const result = await carts.updateAllCart(cId, newCart);
            res.send(result);
        } catch (error) {
            res.status(400).send(error.message);
        }
    } catch {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar el carrito" })
        return []; */
        CustomError.createError({
            name: 'cartsRouterPut error',
            cause: 'Server fail to upload all cart',
            message: 'Server ERROR, no se pudo modificar todo el carrito',
            code: ErrorCodes.DATABASE_ERROR
        });
    }
});

cartsRouter.delete('/:cId', userVerify('jwt', ["ADMIN"]), async (req, res) => {
    try {
        try {
            const cId = req.params.cId;
            const result = await carts.deleteCart(cId);
            res.send(result);
        } catch (error) {
            res.status(400).send(error.message);
        }
    } catch {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar el carrito" })
        return []; */
        CustomError.createError({
            name: 'cartsRouterDelete error',
            cause: 'Server fail to delete cart',
            message: 'Server ERROR, no se pudo eliminar el carrito',
            code: ErrorCodes.DATABASE_ERROR
        });
    }
});

cartsRouter.delete('/:cId/products/:pId', userVerify('jwt', ["USER", "ADMIN"]), async (req, res) => {
    try {
        try {
            const cId = req.params.cId;
            const pId = req.params.pId;
            const result = await carts.deleteProductInCart(cId, pId);
            res.send(result);
        } catch (error) {
            res.status(400).send(error.message);
        }
    } catch {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar el carrito" })
        return []; */
        CustomError.createError({
            name: 'cartsRouterDeleteProduct error',
            cause: 'Server fail to delete product in cart',
            message: 'Server ERROR, no se pudo eliminar el producto del carrito',
            code: ErrorCodes.DATABASE_ERROR
        });
    }
});

cartsRouter.get('/:cId/purchase', userVerify('jwt', ["USER", "ADMIN"]), async (req, res) => {
    try {
        try {
            const cId = req.params.cId;
            const result = await carts.buyCart(cId);
            res.send(result);
        } catch (error) {
            res.status(400).send(error.message);
        }
    } catch {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar su compra" })
        return []; */
        CustomError.createError({
            name: 'cartsRouterGetPurchase error',
            cause: 'Server fail to purchase cart',
            message: 'Server ERROR, no se pudo realizar la compra!',
            code: ErrorCodes.DATABASE_ERROR
        });
    }
});

/* cartsRouter.get('/sendTiketEmail', userVerify('jwt', ["USER", "ADMIN"]), async (req, res) => {
    try {
        
    } catch {
        res.status(500).send({ status: "error", error: "Server ERROR, no se pudo enviar el email de su compra" })
        return [];
    }
}); */

export default cartsRouter

