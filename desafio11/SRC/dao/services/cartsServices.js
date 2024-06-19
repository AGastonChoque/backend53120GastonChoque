import cartsModel from "../models/cartsModel.js";

export default class cartsServices {

    async getAll() {
        return await cartsModel.find();
    }

    async getById(cId) {
        return await cartsModel.findById(cId).populate("products.product").lean();
    }

    async create() {
        return await cartsModel.create({})
    }

    async findOne(cId) {
        return await cartsModel.findOne({ _id: cId })
    }

    async findOneAndUpdateUpdCart(cId, pId, valQuantity) {
        return await cartsModel.findOneAndUpdate(
            { _id: cId },
            { $push: { products: { product: pId, quantity: valQuantity } } }
        )
    }

    async updateOneUpdCart(cId, pId, valQuantity) {
        await cartsModel.updateOne(
            { _id: cId, "products.product": pId },
            { $inc: { "products.$.quantity": valQuantity } }
        )
    }

    async findOneAndUpdateDelProd(cId, pId) {
        return await cartsModel.findOneAndUpdate(
            { _id: cId },
            { $pull: { products: { product: pId } } }
        )
    }

    async findByIdAndUpdate(cId, newCart) {
        return await cartsModel.findByIdAndUpdate(cId, newCart);
    }

    async updateOneCleCart(cId) {
        await cartsModel.updateOne(
            { _id: cId },
            { $set: { products: [] } }
        );
    }

    async deleteCart(cId) {
        return await cartsModel.deleteOne({ _id: cId })
    }

}