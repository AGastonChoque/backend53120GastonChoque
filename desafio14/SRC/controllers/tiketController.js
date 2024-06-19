import tiketsDTO from "../dao/DTOs/tiketsDTO.js";

import tiketsServices from "../services/tiketsServices.js"
import usersServices from "../services/usersServices.js"
import cartsServices from "../services/cartsServices.js"



export class tiketsController {

    constructor () {
        this.tiketsServices = new tiketsServices()
        this.usersServices = new usersServices()
        this.cartsServices = new cartsServices()
    }

    async createTiket(purchasedProducts, cId) {
        let cart = await this.cartsServices.getById(cId)
        let userId = cart.uId
        let user = await this.usersServices.findById(userId)
        let amount = await this.calculateAmount(purchasedProducts)
        const tiket = new tiketsDTO(user, purchasedProducts, amount)
        return await this.tiketsServices.createTiket(tiket)
    }

    async findTiketByEmail (purchaserEmail) {
        return await this.tiketsServices.findTiketByEmail(purchaserEmail)
    }

    async findTiketByCode (code) {
        return await this.tiketsServices.findTiketByCode(code)
    }

    async calculateAmount (purchasedProducts) {
        return await this.tiketsServices.calculateAmount(purchasedProducts)
    }

    async sendEmailPurchase (userMail) {
        return await this.tiketsServices.sendEmailPurchase(userMail)
    }



}