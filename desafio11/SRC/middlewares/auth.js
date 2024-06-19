export const authorization = () => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({
                error: 'Unauthorized'
            });
        }

        if (req.user.role != "Admin") {
            return res.status(403).send({
                error: 'Not permissions'
            });
        }

        next();
    }
}