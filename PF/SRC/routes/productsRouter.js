import { Router } from "express"

import { productsController } from "../controllers/productsController.js"
import { userVerify } from "../utils/authUtil.js";
import { generateRandomProducts } from "../utils/fakerUtils.js";
import CustomError from '../services/errors/CustomError.js';
import { ErrorCodes } from '../services/errors/enums.js';


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
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudieron obtener los productos" });
        return []; */
        req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'productsRouterGet error'`);
        CustomError.createError({
            name: 'productsRouterGet error',
            cause: 'Server fail to charge products',
            message: 'Server ERROR, no se pudieron obtener los productos',
            code: ErrorCodes.DATABASE_ERROR
        });
    }
});

productsRouter.get("/:pId", userVerify('jwt', ["PREMIUM", "ADMIN"]), async (req, res) => {
    try {
        try {
            const pId = req.params.pId;
            const result = await products.getProductById(pId)
            res.send(result)
        } catch (error) {
            res.status(400).send(error.message);
        }
    } catch (error) {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo obtener el producto" })
        return []; */
        req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'productRouterGet error'`);
        CustomError.createError({
            name: 'productRouterGet error',
            cause: "Server fail to charge product",
            message: 'Server ERROR, no se pudo obtener el producto',
            code: ErrorCodes.DATABASE_ERROR
        });
    }
})

productsRouter.post('/', userVerify('jwt', ["ADMIN", "PREMIUM"]), async (req, res) => {
    try {
        try {
            const newProduct = req.body;
            const userEmail = req.user.user.email;
            const userRole = req.user.user.role;
            const result = await products.addProduct(newProduct, userEmail, userRole);
            req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'productRouterPost entry'`);
            res.send(result);
        } catch (error) {
            req.logger.error(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'productRouterPost error'`);
            res.status(400).send(error.message);
        }
    } catch {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo agregar el producto" })
        return []; */
        req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'productRouterPost fatal error'`);
        CustomError.createError({
            name: 'productRouterPost error',
            cause: 'Server fail to post product',
            message: 'Server ERROR, no se pudo agregar el producto',
            code: ErrorCodes.DATABASE_ERROR
        });
    }
});

productsRouter.put("/", userVerify('jwt', ["ADMIN", "PREMIUM"]), async (req, res) => {
    try {
        try {
            const id = req.body.id;
            const updateProduct = req.body.newProduct;
            const userEmail = req.user.user.email;
            const userRole = req.user.user.role;
            const result = await products.updateProduct(id, updateProduct);
            req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'productRouterPost entry'`);
            res.send(result);
        } catch (error) {
            req.logger.error(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'productRouterPut error'`);
            res.status(400).send(error.message);
        }
    } catch {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo modificar el producto" })
        return []; */
        req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'productRouterPut fatal error'`);
        CustomError.createError({
            name: 'productRouterPut error',
            cause: 'Server fail to update product',
            message: 'Server ERROR, no se pudo modificar el producto',
            code: ErrorCodes.DATABASE_ERROR
        });
        
    }
});

productsRouter.delete("/", userVerify('jwt', ["ADMIN", "PREMIUM"]), async (req, res) => {
    try {
        try {
            const id = req.body.id;
            const userEmail = req.user.user.email;
            const userRole = req.user.user.role;
            const result = await products.deleteProduct(id, userEmail, userRole);
            req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'productRouterDelete entry'`);
            res.send(result);
        } catch (error) {
            req.logger.error(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'productRouterDelete error'`);
            res.status(400).send(error.message);
        }
    } catch {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo eliminar el producto" })
        return []; */
        req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'productRouterDelete fatal error'`);
        CustomError.createError({
            name: 'productRouterDelete error',
            cause: 'Server fail to delete product',
            message: 'Server ERROR, no se pudo eliminar el producto',
            code: ErrorCodes.DATABASE_ERROR
        });
    }
});

productsRouter.get("/generate/mockingproducts", userVerify('jwt', ["ADMIN"]), async (req, res) => {
    try {
        try {
            let result = generateRandomProducts(100)
            req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'productRouterMocking entry'`);
            res.send(result);
        } catch (error) {
            req.logger.error(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'productRouterMocking error'`);
            res.status(400).send(error.message);
        }
    } catch {
        /* res.status(500).send({ status: "error", error: "Server ERROR, no se pudo hacer el mocking de producto" })
        return []; */
        req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}, name: 'productRouterMocking fatal error'`);
        CustomError.createError({
            name: 'productRouterMocking error',
            cause: 'Server fail to generate mocking products',
            message: 'Server ERROR, no se pudo generar el mocking de productos',
            code: ErrorCodes.DATABASE_ERROR
        });
    }
});


export default productsRouter

