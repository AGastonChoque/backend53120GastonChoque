import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const tiketsCollection = "tikets";

const tiketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        required: false,
        default: Date.now
    },
    amount: {
        type: Number,
    },
    purchaser: {
        type: String,
        required: true
    },
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    }
});

tiketSchema.plugin(mongoosePaginate);
const tiketsModel = mongoose.model(tiketsCollection, tiketSchema);

export default tiketsModel;