import nodemailer from "nodemailer"

import products from "../dao/mongo/productsMongo.js"
/* import products from "../dao/memory/produtsMemory.js" */

import CustomError from './errors/CustomError.js';
import { ErrorCodes } from './errors/enums.js';
import { generateUserErrorInfo, generateProductErrorInfo, generateProductCodeErrorInfo } from './errors/info.js';
import config from "../config.js";


const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.APP_EMAIL_EMAIL,
        pass: config.APP_EMAIL_PASSWORD
    }
});

export default class productsServices {

    constructor() {
        this.products = new products()
    }

    async addProduct(product, userEmail, userRole) {
        let productVerify = await this.products.inProductsByCode(product.code)

        if (!productVerify) {
            const productNew = {
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail ? product.thumbnail : [],
                code: product.code,
                stock: product.stock,
                status: true,
                category: product.category,
                owner: userRole === "PREMIUM" ? userEmail : "ADMIN",
            };
            if (!Object.values(productNew).includes(undefined)) {
                await this.products.create(productNew);
                return (`El producto "${product.title}" fue agregado correctamente`);
            } else {
                /* throw new Error(`El producto que estás intentando agregar "${product.title}" no contiene todos los valores, asegúrate de completar todos los campos`); */
                CustomError.createError({
                    name: 'AddProduct error',
                    cause: generateProductErrorInfo(product),
                    message: 'El producto que esta intentando agregar no contiene todos los valores, asegurate de completar todos los campos',
                    code: ErrorCodes.INVALID_TYPES_ERROR
                });
            }
        } else {
            /* throw new Error(`Error: El producto ${product.title} contiene un código "${product.code}" ya cargado.`); */
            CustomError.createError({
                name: 'AddProduct code error',
                cause: generateProductCodeErrorInfo(product),
                message: 'El codigo del producto que estas intentando cargar ya fue cargado previamente',
                code: ErrorCodes.INVALID_TYPES_ERROR
            });
        }
    }

    async getProductById(id) {
        let inProductsById = await this.products.findOneIdLean(id)
        if (inProductsById) {
            return inProductsById;
        } else {
            throw new Error("Not found");
        }
    }

    async getProducts(limit, page, query, sort, status) {
        const valLimit = limit ? limit : 10
        const valPage = page ? page : 1
        const valSort = sort ? sort : null
        let valQuery = {};
        if (query) {
            valQuery.category = query
        }
        if (status) {
            valQuery.status = status
        }

        let productsRender = await this.products.paginate(valQuery, valPage, valLimit)

        if (valSort && productsRender.docs.length > 0) {
            productsRender.docs.sort((a, b) => {
                return sort === 'asc' ? a.price - b.price : b.price - a.price;
            });
        }

        return productsRender
    }

    async updateProduct(id, newUpdate) {
        let product = await this.products.findOneId(id)
        if (!product) {
            throw new Error(`El producto con el id: "${id}" no existe.`);
        } if (newUpdate.id === undefined || newUpdate.id === id) {
            if (!this.products.inProductsByCode(newUpdate.code) || newUpdate.code === product.code) {
                await this.products.findAndUpdateIdNewUpdate(id, newUpdate)
                return (`${product.title} modificado correctamente`)
            } else {
                throw new Error(`El codigo "${newUpdate.code}" que estas intentando cambiar ya existe`)
            }
        } else if (newUpdate.id !== id) {
            throw new Error(`No puedes modificar el ID de este producto`)
        }
    }

    async deleteProduct(id, userEmail, userRole) {
        let product = await this.products.findOneId(id)
        let owner = product.owner
        if (!product) {
            throw new Error(`El producto con el id: "${id}" no existe.`);
        } if (userRole === 'ADMIN' || owner === userEmail) {
            await this.products.deleteOneId(id);
            if (owner !== 'ADMIN') {
                const emailDeleteProduct = await transport.sendMail({
                    from: `AppCoderDeleteProduct <${config.APP_EMAIL_EMAIL}>`,
                    to: owner,
                    subject: 'Tu producto fue borrado!',
                    html: `
              <div>
                <h1>¡Tu producto fue ${product.title} borrado!</h1>
                <p>Este mensaje es para avisarte que el producto mencionado fue eliminado de nuestra BBDD.</p>
              </div>`
                });
                return product;
            }
            return product;
        } else {
            throw new Error('No tienes permiso para borrar este producto.');
        }
    }

}