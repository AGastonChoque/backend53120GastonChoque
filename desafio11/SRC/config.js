import dotenv from "dotenv"
import { Command } from "commander";

const program = new Command();
program.option("--mode <mode>", "set the mode", "dev");
program.parse();

const options = program.opts();

const env = options.mode;
dotenv.config({
    path: env === "prod" ? "./.env.prod" : "./.env.dev"
});

export default {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
    APP_ID: process.env.APP_ID,
    CLIENT_ID: process.env.CLIENT_ID,
    SECRET_ID: process.env.SECRET_ID,
    PRIVATE_KEY_jWT: process.env.PRIVATE_KEY_jWT
}