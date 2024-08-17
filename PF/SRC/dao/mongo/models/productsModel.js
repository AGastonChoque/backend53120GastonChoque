import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = "products"
/* const productsCollection = "products_test" */

const productsSchema = new mongoose.Schema({
  title: {
    type: String
  }, 
  description: {
    type: String
  },
  price: {
    type: Number
  },
  thumbnails: {
    type: Array,
    default: []
  },
  code: {
    type: String
  },
  stock : {
    type: Number,
  },
  status: {
    type: Boolean,
  },
  category: {
    type: String
  },
  owner: {
    type: String,
    default: 'ADMIN'
  }
})

productsSchema.plugin(mongoosePaginate)

const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel