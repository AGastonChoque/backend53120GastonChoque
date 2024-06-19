import cartsModel from "./models/cartsModel.js"
import productsModel from "./models/productsModel.js";


export class cartManager {


    async addCart() {
        const cart = await this.saveToBD()
        return cart
    }

    async getCarts() {
        return await cartsModel.find();
    }

    async getCartById(cId) {
        let inCartsById = await cartsModel.findById(cId).populate("products.product").lean();
        return inCartsById ? inCartsById : [];
    }

    async saveToBD() {
        return await cartsModel.create({})
    }

    async updateCart(cId, pId) {
        let cart = await cartsModel.findOne({ _id: cId })
        if (!cart) {
            throw new Error(`El carrito con el id: "${cId}" no existe.`);
        } else {
            let inProductsById = await productsModel.findOne({ _id: pId })
            if (inProductsById) {
                let quantity = 1
                const enELcarrito = cart.products.find(prod => prod.product.toString() === pId);
                if (!enELcarrito) {
                    await cartsModel.findOneAndUpdate(
                        { _id: cId },
                        { $push: { products: { product: pId, quantity: quantity } } }
                    );
                    return (`Se agrego el producto id: "${pId}" al carrito id: "${cId}"`)
                } else {
                    await cartsModel.updateOne(
                        { _id: cId, "products.product": pId },
                        { $inc: { "products.$.quantity": quantity } }
                    )
                    return (`El producto id: "${pId}" del carrito id: "${cId}" aumento su cantidad`)
                }
            } else {
                throw new Error(`El producto con el id: ${pId} que intenta agregar no existe.`)
            }
        }
    }

    async updateAllCart(cId, newCart) {
        let cart = await cartsModel.findOne({ _id: cId })
        if (!cart) {
            throw new Error(`El carrito con el id: "${cId}" no existe.`);
        } else {
            if (newCart.product === undefined || newCart.product === cId) {
                for (let product of newCart.products) {
                    let inProductsById = await productsModel.findById(product.product);
                    if (!inProductsById) {
                        throw new Error(`El producto con el id: "${product.product}" que intenta agregar no existe.`);
                    }
                }
                await cartsModel.findByIdAndUpdate(cId, newCart);
                return `Se modificó el carrito con id: "${cId}".`;
            } else {
                return `No puedes modificar el id del carrito este debe ser: "${cId}".`;
            }
        }
    }

    async clearCart(cId) {
        let cart = await cartsModel.findOne({ _id: cId });
        if (!cart) {
            throw new Error(`El carrito con el id: "${cId}" no existe.`);
        } else {
            await cartsModel.updateOne(
                { _id: cId },
                { $set: { products: [] } }
            );
            return (`Se vació el carrito con el id: "${cId}"`);
        }
    }

    async deleteCart(cId) {
        return await cartsModel.deleteOne({ _id: cId })
    }

    async deleteProductInCart(cId, pId) {
        let cart = await cartsModel.findOne({ _id: cId })
        if (!cart) {
            throw new Error(`El carrito con el id: "${cId}" no existe.`);
        } else {
            const enELcarrito = cart.products.find(prod => prod.product.toString() === pId);
            if (!enELcarrito) {
                return (`El producto que intenta eliminar con el id: "${pId}" no esta cargado en el carrito id: "${cId}"`)
            } else {
                await cartsModel.findOneAndUpdate(
                    { _id: cId },
                    { $pull: { products: { product: pId } } }
                )
                return (`El producto id: "${pId}" fue eliminado del carrito id: "${cId}".`)
            }
        }
    }

}
