import productsModel from "../models/productsModel.js";

export default class productsServices {

    async paginate(valQuery, valPage, valLimit) {
        return await productsModel.paginate(valQuery, { page: valPage, limit: valLimit, lean: true });
    }

    async findOneCode (code) {
        return await productsModel.findOne({ code: code })
    }

    async findOneIdLean (id) {
        return await productsModel.findOne({ _id: id }).lean();
    }

    async create (newProduct) {
        return await productsModel.create(newProduct)
    }

    async findOneId(id) {
        return await productsModel.findOne({ _id: id })
    }

    async findAndUpdateIdNewUpdate(id, newUpdate) {
        return await productsModel.findOneAndUpdate({ _id: id }, newUpdate)
    }

    async deleteOneId(id) {
        return await productsModel.deleteOne({ _id: id })
    }

    async findById (id) {
        return await productsModel.findById(id)
    }

}