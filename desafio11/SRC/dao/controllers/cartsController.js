import cartsServices from "../services/cartsServices.js";
import productsServices from "../services/productsServices.js"


export class cartsController {

    constructor () {
        this.cartsServices = new cartsServices()
        this.productsServices = new productsServices()
    }


    async addCart() {
        const cart = await this.saveToBD()
        return cart
    }

    async getCarts() {
        return await this.cartsServices.getAll();
    }

    async getCartById(cId) {
        let inCartsById = await this.cartsServices.getById(cId)
        return inCartsById ? inCartsById : [];
    }

    async saveToBD() {
        return await this.cartsServices.create()
    }

    async updateCart(cId, pId) {
        let cart = await this.cartsServices.findOne(cId)
        if (!cart) {
            throw new Error(`El carrito con el id: "${cId}" no existe.`);
        } else {
            let inProductsById = await this.productsServices.findOneId(pId)
            if (inProductsById) {
                let valQuantity = 1
                const enElCarrito = cart.products.find(prod => prod.product.toString() === pId);
                if (!enElCarrito) {
                    await this.cartsServices.findOneAndUpdateUpdCart(cId, pId, valQuantity)
                    return (`Se agrego el producto id: "${pId}" al carrito id: "${cId}"`)
                } else {
                    await this.cartsServices.updateOneUpdCart(cId, pId, valQuantity)
                    return (`El producto id: "${pId}" del carrito id: "${cId}" aumento su cantidad`)
                }
            } else {
                throw new Error(`El producto con el id: ${pId} que intenta agregar no existe.`)
            }
        }
    }

    async updateAllCart(cId, newCart) {
        let cart = await this.cartsServices.findOne(cId)
        if (!cart) {
            throw new Error(`El carrito con el id: "${cId}" no existe.`);
        } else {
            if (newCart.product === undefined || newCart.product === cId) {
                for (let product of newCart.products) {
                    let inProductsById = await this.productsServices.findById(product.product)
                    if (!inProductsById) {
                        throw new Error(`El producto con el id: "${product.product}" que intenta agregar no existe.`);
                    }
                }
                await this.cartsServices.findByIdAndUpdate(cId, newCart)
                return `Se modificó el carrito con id: "${cId}".`;
            } else {
                return `No puedes modificar el id del carrito este debe ser: "${cId}".`;
            }
        }
    }

    async clearCart(cId) {
        let cart = await this.cartsServices.findOne(cId)
        if (!cart) {
            throw new Error(`El carrito con el id: "${cId}" no existe.`);
        } else {
            await this.cartsServices.updateOneCleCart(cId)
            return (`Se vació el carrito con el id: "${cId}"`);
        }
    }

    async deleteCart(cId) {
        return await this.cartsServices.deleteCart(cId)
    }

    async deleteProductInCart(cId, pId) {
        let cart = await this.cartsServices.findOne(cId)
        if (!cart) {
            throw new Error(`El carrito con el id: "${cId}" no existe.`);
        } else {
            const enELcarrito = cart.products.find(prod => prod.product.toString() === pId);
            if (!enELcarrito) {
                return (`El producto que intenta eliminar con el id: "${pId}" no esta cargado en el carrito id: "${cId}"`)
            } else {
                await this.cartsServices.findOneAndUpdateDelProd(cId, pId)
                return (`El producto id: "${pId}" fue eliminado del carrito id: "${cId}".`)
            }
        }
    }

}
