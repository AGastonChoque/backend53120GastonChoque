import jwt from "jsonwebtoken";

import config from "../config.js";

const PRIVATE_KEY_JWT = config.PRIVATE_KEY_jWT

const generateToken = (user) => {
    const token = jwt.sign(
        { user },
        PRIVATE_KEY_JWT,
        { expiresIn: "1h" }
    )
    return token;
}

const authToken = (req, res, next) => {
    const access_token = req.cookies.authorization
    if (!access_token) {
        return res.redirect("/login");
    }

    jwt.verify(access_token, PRIVATE_KEY_JWT, (error, credentials) => {
        if (error) {
            return res.redirect("/login")
        }
        req.user = credentials.user
        next()
    })
}

export {generateToken, authToken}