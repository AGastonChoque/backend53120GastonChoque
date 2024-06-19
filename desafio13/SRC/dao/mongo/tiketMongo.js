import tiketstModel from "./models/tiketsModel.js";

export default class tiketsMongo {

    async create(tiket) {
        return await tiketstModel.create(tiket)
    }

    async findByEmail(purchaserEmail) {
        return await tiketstModel.findOne(purchaserEmail).lean()
    }

    async findByEmailPopulate(purchaserEmail) {
        return await tiketstModel.findOne(purchaserEmail).populate("products.product").sort({ _id: -1 }).lean();
    }

    async findTiketByCodePopulate(code) {
        return await tiketstModel.findOne(code).populate("products.product").sort({ _id: -1 }).lean();
    }
    

}