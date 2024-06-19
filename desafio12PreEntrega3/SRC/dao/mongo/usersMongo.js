import usersModel from "./models/usersModel.js";

export default class usersMongo {

    async findUser(user) {
        return await usersModel.findOne(user);
    }

    async createUser(newUser) {
        return await usersModel.create(newUser);
    }

    async findUserLean(user) {
        return await usersModel.findOne(user).lean();
    }

    async findById(id) {
        return await usersModel.findById(id);
    }

    async getUsers() {
        return await usersModel.find();
    }

}