import nodemailer from "nodemailer"
import jwt from "jsonwebtoken";

import users from "../dao/mongo/usersMongo.js"
/* import users from "../dao/memory/userMemory.js" */
import config from "../config.js";
import { createHash, isValidPassword } from "../utils/functionsUtils.js";
import usersDTOGet from "../dao/DTOs/usersDTOGet.js";


const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.APP_EMAIL_EMAIL,
        pass: config.APP_EMAIL_PASSWORD
    }
});


export default class usersServices {

    constructor() {
        this.users = new users()
    }

    async findUser(user) {
        return await this.users.findUser(user);
    }

    async createUser(newUser) {
        return await this.users.createUser(newUser);
    }

    async findUserLean(user) {
        return await this.users.findUserLean(user);
    }

    async findById(id) {
        return await this.users.findById(id);
    }

    async getUsers() {
        return await this.users.getUsers();
    }

    async findUserAndSendEmailRecover(mail) {
        try {
            const user = await this.findUserLean({ email: mail })
            if (!user) {
                console.error(`No se encontró el user con el correo electrónico: ${mail}`);
                return user;
            }

            const PRIVATE_KEY = config.PRIVATE_KEY_jWT
            const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "10m" })

            const emailRecover = await transport.sendMail({
                from: `AppCoderPasswordRecover <${config.APP_EMAIL_EMAIL}>`,
                to: user.email,
                subject: 'Correo de recuperacion de contraseña!',
                html: `
          <div>
            <h1>¡Recupera la contraseña de tu cuenta!</h1>
            <p><b>Atención!</b>: si usted NO ha solicitado este mail, simplemente ignórelo</p>
            <p>Recuerda que este mail tiene una vigencia de 5 minutos, y no permite colocar la misma contraseña.</p>
            <p>Para generar una nueva contraseña, ingrese por favor al siguiente enlace:</p>
                <p><a href="https://backend53120gastonchoque.onrender.com/restorepassword?access_token=${token}">https://backend53120gastonchoque.onrender.com/restorepassword?access_token=${token}</a></p>
          </div>`
            });

            console.log('Correo electrónico enviado correctamente!');
            return user
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
        }

    }

    async updateUserPassword(mail, newPassword) {
        const user = await this.findUserLean({ email: mail })
        const oldPassword = user.password
        const invalidPassword = newPassword === undefined || isValidPassword(oldPassword, newPassword)
        const newPasswordHash = createHash(newPassword)
        const uId = user._id

        if (!user) {
            console.log(`El usuario con el email: "${mail}" no existe.`);
            return user;
        } if (invalidPassword) {
            console.log(`La contraseña que proporciona no puede ser utilizada.`);
            return undefined;
        } else {
            await this.users.updatePassword(uId, newPasswordHash)
            const emailPasswordChange = await transport.sendMail({
                from: `AppCoderPasswordChange <${config.APP_EMAIL_EMAIL}>`,
                to: user.email,
                subject: 'Tu contraseña fue cambiada exitosamente!',
                html: `
          <div>
            <h1>¡Tu contraseña fue cambiada exitosamente!</h1>
            <p>Este es un correo informativo, tu contraseña fue cambiada correctamente.</p>
            <p>Ingresa a nuestro sitio web mediante el siguiente enlace:</p>
                <p><a href="https://backend53120gastonchoque.onrender.com/login">https://backend53120gastonchoque.onrender.com/login</a></p>
          </div>`
            });
            return (`El usuario con el mail: ${mail} ha modificado correctamente su password.`)
        }
    }

    async updateUserRole(uId) {
        const user = await this.findById(uId)
        const oldRole = user.role

        if (!user) {
            console.log(`El usuario con el id: "${uId}" no existe.`);
            return user;
        } if (oldRole === 'PREMIUM') {
            await this.users.updateUserRole(uId, 'USER')
            const userUpdt = await this.findById(uId)
            return userUpdt;
        } else if (oldRole === 'USER') {
            if (user.documents.length === 0) {
                console.log(`El usuario con el id: "${uId}" no tiene docuemntacion cargada.`);
                return user
            }
            await this.users.updateUserRole(uId, 'PREMIUM')
            const userUpdt = await this.findById(uId)
            return userUpdt;
        }
    }

    async updateUserDocuments(uId, files) {
        const user = await this.findById(uId)

        if (!user) {
            console.log(`El usuario con el id: "${uId}" no existe.`);
            return user;
        } if (!files || files.length === 0) {
            console.log(`No cargo archivos.`);
            return user;
        }
        const documents = files.map(file => ({
            name: file.filename,
            reference: file.path
        }));

        await this.users.updateUserDocuments(uId, documents);
        return user

    }

    async getUsers() {
        let users = await this.users.getUsers()
        const usersByDTO = users.map(user => new usersDTOGet(user));
        return usersByDTO
    }

    async lastConnect(uId) {
        const date = new Date();
        date.setHours(date.getHours() - (date.getTimezoneOffset() / 60 + 3));

        const lastConnect = await this.users.lastConnect(uId, date);
        return lastConnect;
    }

    async deleteInactivity() {
        const users = await this.getUsers(); 
        const actualDate = new Date();
        actualDate.setHours(actualDate.getHours() - (actualDate.getTimezoneOffset() / 60 + 3));

        const userIdsToDelete = users
            .filter(user => {
                if (user.role === 'ADMIN') {
                    return false;
                }
                const lastConnectDate = new Date(user.last_connection);
            const timeDifferenceInMilliseconds = actualDate - lastConnectDate;
            const timeDifferenceInDays = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);
            return timeDifferenceInDays > 2;
            })
            .map(user => user._id);

        if (userIdsToDelete.length === 0) {
            return { success: true, deletedCount: 0 };
        }

        const deleteResult = await this.users.deleteInactivity(userIdsToDelete);
        return deleteResult;
    }

}