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

}