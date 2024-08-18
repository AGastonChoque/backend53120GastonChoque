import cartsServices from "../services/cartsServices.js";


export class cartsController {

    constructor () {
        this.cartsServices = new cartsServices()
    }

    async getCarts() {
        return await this.cartsServices.getAll();
    }

    async getCartById(cId) {
        let inCartsById = await this.cartsServices.getById(cId)
        return inCartsById ? inCartsById : [];
    }

    async addCart() {
        return await this.cartsServices.addCart()
    }

    async updateCart(cId, pId, userEmail) {
        return await this.cartsServices.updateCart(cId, pId, userEmail)
    }

    async updateAllCart(cId, newCart) {
        return await this.cartsServices.updateAllCart(cId, newCart)
    }

    async clearCart(cId) {
        return await this.cartsServices.clearCart(cId)
    }

    async deleteCart(cId) {
        return await this.cartsServices.deleteCart(cId)
    }

    async deleteProductInCart(cId, pId) {
        return await this.cartsServices.deleteProductInCart(cId, pId)
    }

    async buyCart(cId, userRole) {
        return await this.cartsServices.buyCart(cId, userRole)
    }

    async addUid(user) {
        let uId= user._id;
        let cId= user.cId;
        return await this.cartsServices.updateIdCart(cId, uId)
    }

}
