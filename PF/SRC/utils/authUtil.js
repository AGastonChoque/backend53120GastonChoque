import passport from "passport";

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if (error) return next(error);
            if (!user) {
                return res.status(401).send({
                    error: info.messages ? info.messages : info.toString()
                })
            }
            req.user = user
            next();
        })(req, res, next);
    }
}

export const userVerify = (strategy, allowedRoles) => {
    return async (req, res, next) => {
        if (allowedRoles.includes("PUBLIC")) {
            if (allowedRoles.length === 1 && allowedRoles.includes("PUBLIC")) {
                return next();
            }

            return passport.authenticate(strategy, async (error, user, info) => {
                if (error) {
                    return next(error);
                }
                if (user) {
                    if (allowedRoles.includes(user.user.role)) {
                        req.user = user;
                        return next();
                    } else {
                        return res.status(403).send({ error: "Prohibido: Rol de usuario no autorizado" });
                    }
                } else {
                    return res.redirect("/login");
                }
            })(req, res, next);
        } else {
            return passport.authenticate(strategy, async (error, user, info) => {
                if (error) {
                    return next(error);
                }
                if (user) {
                    if (allowedRoles.includes(user.user.role)) {
                        req.user = user;
                        return next();
                    } else {
                        return res.status(403).send({ error: "Prohibido: Rol de usuario no autorizado" });
                    }
                } else {
                    return res.redirect("/login");
                }
            })(req, res, next);
        }
    }
}






