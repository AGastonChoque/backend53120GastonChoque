import bcrypt from "bcrypt";
import config from "../config.js";

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (loginPassword, userPassword) => bcrypt.compareSync(userPassword, loginPassword);

export const isAdmin = (email, password) => {
    return email === config.admin_email && password === config.admin_password;
}