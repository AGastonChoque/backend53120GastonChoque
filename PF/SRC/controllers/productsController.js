/* import productsServices from "../dao/services/productsServices.js"; */
import productsServices from "../services/productsServices.js";


export class productsController {

    constructor () {
        this.productsServices = new productsServices()
    }


    async addProduct(product, userEmail, userRole) {
        return await this.productsServices.addProduct(product, userEmail, userRole)
    }

    async getProducts(limit, page, query, sort, status) {
        return await this.productsServices.getProducts(limit, page, query, sort, status)
    }

    async getProductById(id) {
        return await this.productsServices.getProductById(id)
    }

    async updateProduct(id, newUpdate) {
        return await this.productsServices.updateProduct(id, newUpdate)
    }

    async deleteProduct(id, userEmail, userRole) {
        return await this.productsServices.deleteProduct(id, userEmail, userRole)
    }

}
