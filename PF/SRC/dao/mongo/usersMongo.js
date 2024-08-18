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

    async updatePassword(uId, newPasswordHash) {
        return await usersModel.findOneAndUpdate(
            { _id: uId },
            { password: newPasswordHash }
        )
    }
    
    async updateUserRole(uId, newRole) {
        return await usersModel.findOneAndUpdate(
            { _id: uId },
            { role: newRole }
        )
    }

    async updateUserDocuments(uId, files) {
        return await usersModel.findOneAndUpdate(
            { _id: uId },
            { $set: { documents: files } },
            { new: true }
        );
    }

    async lastConnect(uId, date) {
        return await usersModel.findOneAndUpdate(
            { _id: uId },
            { last_connect: date },
            { new: true }
        )
    }

}