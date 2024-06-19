import users from "../dao/mongo/usersMongo.js"
/* import users from "../dao/memory/userMemory.js" */


export default class usersServices {

    constructor () {
        this.users = new users()
    }

    async findUser(user) {
        return await this.users.findUser(user);
    }

    async createUser(newUser) {
        return await this.users.createUser(newUser);
    }

    async findUserLean(user) {
        return await this.users.findUserLean(user);
    }

    async findById(id) {
        return await this.users.findById(id);
    }

    async getUsers() {
        return await this.users.getUsers();
    }

}