import usersServices from "../services/usersServices.js";
import usersDTO from "../dao/DTOs/usersDTO.js";


export class usersController {

    constructor () {
        this.usersServices = new usersServices()
    }

    async findUser(user) {
        return await this.usersServices.findUser(user)
    }

    async createUser(user) {
        const newUser = new usersDTO(user)
        return await this.usersServices.createUser(newUser)
    }

    async findUserLean(user) {
        return await this.usersServices.findUserLean(user)
    }

    async findById(id) {
        return await this.usersServices.findById(id)
    }

    async getUsers() {
        return await this.usersServices.getUsers()
    }

    async findUserAndSendEmailRecover(email) {
        return await this.usersServices.findUserAndSendEmailRecover(email)
    }

    async updateUserPassword(email, newPassword) {
        return await this.usersServices.updateUserPassword(email, newPassword)
    }

    async updateUserRole(uId) {
        return await this.usersServices.updateUserRole(uId)
    }

    async updateUserDocuments(uId, files) {
        return await this.usersServices.updateUserDocuments(uId, files)
    }

    async lastConnect(uId) {
        return await this.usersServices.lastConnect(uId)
    }

}