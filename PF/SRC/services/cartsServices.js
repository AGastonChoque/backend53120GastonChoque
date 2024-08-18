import carts from "../dao/mongo/cartsMongo.js"
import products from "../dao/mongo/productsMongo.js"
import productServices from "../services/productsServices.js"

/* import carts from "../dao/memory/cartsMemory.js"
import products from "../dao/memory/produtsMemory.js" */


export default class cartsServices {

    constructor() {
        this.products = new products()
        this.carts = new carts()
        this.productServices = new productServices()
    }

    async getAll() {
        return await this.carts.getAll();
    }

    async getById(cId) {
        return await this.carts.getById(cId);
    }

    async addCart() {
        return await this.carts.addCart()
    }

    async deleteCart(cId) {
        return await this.carts.deleteCart(cId)
    }

    async updateCart(cId, pId, userEmail) {
        let cart = await this.carts.findOne(cId)
        if (!cart) {
            throw new Error(`El carrito con el id: "${cId}" no existe.`);
        } else {
            let inProductsById = await this.products.findOneId(pId)
            if (inProductsById && userEmail != inProductsById.owner) {
                let valQuantity = 1
                const enElCarrito = cart.products.find(prod => prod.product.toString() === pId);
                if (!enElCarrito) {
                    await this.carts.findOneAndUpdateUpdCart(cId, pId, valQuantity)
                    return (`Se agrego el producto id: "${pId}" al carrito id: "${cId}"`)
                } else {
                    await this.carts.updateOneUpdCart(cId, pId, valQuantity)
                    return (`El producto id: "${pId}" del carrito id: "${cId}" aumento su cantidad`)
                }
            } else {
                /* throw new Error(`El producto con el id: ${pId} que intenta agregar no existe o es propio.`) */
                return userEmail
            }
        }
    }

    async updateAllCart(cId, newCart) {
        let cart = await this.carts.findOne(cId)
        if (!cart) {
            throw new Error(`El carrito con el id: "${cId}" no existe.`);
        } else {
            if (newCart.product === undefined || newCart.product === cId) {
                for (let product of newCart.products) {
                    let inProductsById = await this.products.findById(product.product)
                    if (!inProductsById) {
                        throw new Error(`El producto con el id: "${product.product}" que intenta agregar no existe.`);
                    }
                }
                await this.carts.findByIdAndUpdate(cId, newCart)
                return `Se modificó el carrito con id: "${cId}".`;
            } else {
                return `No puedes modificar el id del carrito este debe ser: "${cId}".`;
            }
        }
    }

    async clearCart(cId) {
        let cart = await this.carts.findOne(cId)
        if (!cart) {
            throw new Error(`El carrito con el id: "${cId}" no existe.`);
        } else {
            await this.carts.updateOneCleCart(cId)
            return (`Se vació el carrito con el id: "${cId}"`);
        }
    }

    async deleteProductInCart(cId, pId) {
        let cart = await this.carts.findOne(cId)
        if (!cart) {
            throw new Error(`El carrito con el id: "${cId}" no existe.`);
        } else {
            const enELcarrito = cart.products.find(prod => prod.product.toString() === pId);
            if (!enELcarrito) {
                return (`El producto que intenta eliminar con el id: "${pId}" no esta cargado en el carrito id: "${cId}"`)
            } else {
                await this.carts.deleteProdInCart(cId, pId)
                return (`El producto id: "${pId}" fue eliminado del carrito id: "${cId}".`)
            }
        }
    }

    async getProductStock(id) {
        let product = await this.products.findById(id)
        return product.stock
    }

    async buyCart(cId, userRole) {
        let cart = await this.getById(cId)
        const purchasedProducts  = { products: [] }
        const stockErrors = {products:[]}
        if (userRole === 'ADMIN') {
            return userRole
        }
        for (const product of cart.products) {
            const productStock = await this.getProductStock(product.product)
            if (productStock < product.quantity) {
                stockErrors.products.push({
                    product: product.product._id,
                    quantity: product.quantity
                  });
            } else if (productStock >= product.quantity) {
                await this.productServices.updateProduct(product.product, { ...product.product, stock: productStock - product.quantity })
                purchasedProducts.products.push({
                    product: product.product._id,
                    quantity: product.quantity
                })
            }
        }
        await this.updateAllCart(cId, stockErrors);
        const notPurchased = stockErrors

        return {purchasedProducts, notPurchased}
    }

    async updateIdCart(cId, uId) {
        let cart = await this.carts.findOne(cId)
        if (!cart) {
            throw new Error(`El carrito con el id: "${cId}" no existe.`);
        } else {
            this.carts.findOneAndUpdateUid(cId, uId)
        }
    }

}