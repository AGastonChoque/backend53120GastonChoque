import passport from "passport"
import local from "passport-local"
import GitHubStrategy from "passport-github2"

import { createHash, isValidPassword } from "../utils/functionsUtils.js"
import jwt, { ExtractJwt } from 'passport-jwt';
import config from "../config.js"
import { usersController } from "../controllers/usersControler.js"
import { cartsController } from "../controllers/cartsController.js";
import { isAdmin } from "../utils/functionsUtils.js";



const localStrategy = local.Strategy
const JWTStratergy = jwt.Strategy;

const initializatePassport = () => {

    const users = new usersController()
    const carts = new cartsController()

    passport.use("register", new localStrategy(
        {
            passReqToCallback: true,
            usernameField: "email",
            session: false
        },
        async (req, username, password, done) => {

            try {
                let userVerify = await users.findUser({ email: username })

                if (userVerify) {
                    return done(null, false, { message: "User already exist!" });
                }
                
                let newCart = await carts.addCart()

                if (isAdmin(req.body.email, req.body.password)) {
                    req.body.role = "ADMIN"
                }

                const newUser = {
                    first_name: req.body.formName ?? "",
                    last_name: req.body.formLastname ?? "",
                    email: req.body.email,
                    age: req.body.formAge ?? "",
                    password: createHash(password),
                    cId: newCart._id,
                    role: req.body.role
                }

                const createNewUser = await users.createUser(newUser);

                return done(null, createNewUser)
            } catch (error) {
                return done(error.message)
            }
        }
    ))

    passport.use("login", new localStrategy(
        {
            usernameField: "email",
            passReqToCallback: true,
            session: false
        },
        async (req, username, password, done) => {
            try {
                const user = await users.findUserLean({ email: username });
                if (!user) {
                    /* user.failLogin = true; */
                    return done(null, false, { message: "User does not exist!" });
                }

                if (!isValidPassword(user.password, password)) {
                    /* user.failLogin = true; */
                    return done(null, false, { message: "User or Password is incorrect!" });
                }
                return done(null, user)
            } catch (error) {
                return done(error.message)
            }
        }
    ))


    const CLIENT_ID = config.CLIENT_ID
    const SECRET_ID = config.SECRET_ID

    passport.use("github", new GitHubStrategy(
        {
            clientID: CLIENT_ID,
            clientSecret: SECRET_ID,
            callbackURL: "http://localhost:8080/api/sessions/githubCallback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                /* console.log(profile); */
                const userByUsername = await users.findUserLean({ username: profile._json.login })
                const userByEmail = await users.findUserLean({ email: profile._json.email })
                const userEmail = userByEmail ? userByEmail.email : null

                if (!userByUsername && (!userByEmail || userEmail == null)) {
                    let newCart = await carts.addCart()
                    let newUser = {
                        username: profile._json.login,
                        complete_name: profile._json.name,
                        email: profile._json.email,
                        password: "",
                        cId: newCart._id
                    }
                    await users.createUser(newUser);
                    let newUserUpload = await users.findUserLean({ username: profile._json.login })
                    done(null, newUserUpload);
                } else {
                    done(null, userByUsername);
                }
            } catch (error) {
                return done(error.message);
            }
        }));


    passport.serializeUser(async (user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        let user = await users.findById(id)
        done(null, user);
    })


    const PRIVATE_KEY_jWT = config.PRIVATE_KEY_jWT
    passport.use("jwt", new JWTStratergy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY_jWT
        },
        async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload);
            } catch (error) {
                return done(error);
            }
        }
    )
    )
}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.cookieToken ?? null;
    }

    return token;
}




export default initializatePassport;