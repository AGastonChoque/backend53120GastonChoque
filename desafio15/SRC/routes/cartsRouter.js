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
        req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterGet fatal error'`);
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
            req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterPost entry'`);
            res.send(result);
        } catch (error) {
            req.logger.error(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterPost error'`);
            res.status(400).send(error.message);
        }
    } catch {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar el carrito" })
        return []; */
        req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterPost fatal error'`);
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
            req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterPostProduct entry'`);
            res.send(result);
        } catch (error) {
            req.logger.error(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterPostProduct error'`);
            res.status(400).send(error.message);
        }
    } catch {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar el carrito" })
        return []; */
        req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterPostProduct fatal error'`);
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
            req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterPut entry'`);
            res.send(result);
        } catch (error) {
            req.logger.error(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterPut error'`);
            res.status(400).send(error.message);
        }
    } catch {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar el carrito" })
        return []; */
        req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterPut fatal error'`);
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
            req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterDelete entry'`);
            res.send(result);
        } catch (error) {
            req.logger.error(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterDelete error'`);
            res.status(400).send(error.message);
        }
    } catch {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar el carrito" })
        return []; */
        req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterDelete fatal error'`);
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
            req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterDeleteProduct entry'`);
            res.send(result);
        } catch (error) {
            req.logger.error(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterDeleteProduct error'`);
            res.status(400).send(error.message);
        }
    } catch {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar el carrito" })
        return []; */
        req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterDeleteProduct fatal error'`);
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
            req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterGetPurchase entry'`);
            res.send(result);
        } catch (error) {
            req.logger.error(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterGetPurchase error'`);
            res.status(400).send(error.message);
        }
    } catch {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar su compra" })
        return []; */
        req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'cartsRouterGetPurchase fatal error'`);
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

