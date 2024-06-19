import bcrypt from "bcrypt";

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (loginPassword, userPassword) => bcrypt.compareSync(userPassword, loginPassword);

export const isAdmin = (email, password) => {
    return email === "adminCoder@coder.com" && password === "adminCod3r123";
}