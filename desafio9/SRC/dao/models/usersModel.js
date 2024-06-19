import mongoose from "mongoose";

const usersCollection = "users";

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
});

const usersModel = mongoose.model(usersCollection, userSchema);

export default usersModel;