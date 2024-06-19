import passport from "passport"
import local from "passport-local"
import GitHubStrategy from "passport-github2"

import usersModel from "../dao/models/usersModel.js"
import { createHash, isValidPassword } from "../utils/functionsUtils.js"


const localStrategy = local.Strategy

const initializatePassport = () => {

    passport.use("register", new localStrategy(
        {
            passReqToCallback: true,
            usernameField: "email"
        },
        async (req, username, password, done) => {

            try {
                let userVerify = await usersModel.findOne({ email: username })

                if (userVerify) {
                    req.session.failRegister = true;
                    return done(null, false, { message: "User already exist!" });
                }

                const newUser = {
                    first_name: req.body.formName ?? "",
                    last_name: req.body.formLastname ?? "",
                    email: req.body.email,
                    age: req.body.formAge ?? "",
                    password: createHash(password)
                }

                const createNewUser = await usersModel.create(newUser);

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
        },
        async (req, username, password, done) => {
            try {
                const user = await usersModel.findOne({ email: username }).lean();
                if (!user) {
                    req.session.failLogin = true;
                    return done(null, false, { message: "User does not exist!" });
                }

                if (!isValidPassword(user.password, password)) {
                    req.session.failLogin = true;
                    return done(null, false, { message: "User or Password is incorrect!" });
                }

                return done(null, user)
            } catch (error) {
                return done(error.message)
            }
        }
    ))


    const CLIENT_ID = "";
    const SECRET_ID = "";

    passport.use("github", new GitHubStrategy(
        {
            clientID: CLIENT_ID,
            clientSecret: SECRET_ID,
            callbackURL: "http://localhost:8080/api/sessions/githubCallback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                /* console.log(profile); */
                const userByUsername = await usersModel.findOne({ username: profile._json.login }).lean()
                const userByEmail = await usersModel.findOne({ email: profile._json.email }).lean()
                const userEmail = userByEmail ? userByEmail.email : null

                if (!userByUsername && (!userByEmail || userEmail == null)) {
                    let newUser = {
                        username: profile._json.login,
                        complete_name: profile._json.name,
                        email: profile._json.email,
                        password: ""
                    }
                    await usersModel.create(newUser);
                    let newUserUpload = await usersModel.findOne({ username: profile._json.login }).lean()
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
        let user = await usersModel.findById(id);
        done(null, user);
    })


}

export default initializatePassport;