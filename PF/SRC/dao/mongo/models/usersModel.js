import mongoose from "mongoose";

const usersCollection = "users";
/* const usersCollection = "users_test"; */

const userSchema = mongoose.Schema({
    username: {
        type: String,
        minLength: 2
    },
    first_name: {
        type: String,
        minLength: 2
    },
    last_name: {
        type: String,
        minLength: 2
    },
    complete_name: {
        type: String,
        minLength: 2,
    },
    email: {
        type: String,
        unique: false, 
        sparse: true
    },
    age: {
        type: Number,
        min: 18
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ['USER', 'PREMIUM', 'ADMIN' ],
        default: 'USER'
    },
    cId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
      },
    documents: {
        type: [{
            name: String,
            reference: String
        }]
      },
    last_connection: {
        type: String
    },
});

const usersModel = mongoose.model(usersCollection, userSchema);

export default usersModel;