import tikets from "../dao/mongo/tiketMongo.js"
import { productsController } from "../controllers/productsController.js";
import config from "../config.js";
import nodemailer from "nodemailer"
import __dirname from "../utils/utils.js";

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.APP_EMAIL_EMAIL,
        pass: config.APP_EMAIL_PASSWORD
    }
});


export default class tiketsServices {

    constructor() {
        this.tikets = new tikets()
        this.productsController = new productsController()
    }

    async createTiket(tiket) {
        return await this.tikets.create(tiket);
    }

    async findTiketByEmail(purchaserEmail) {
        return await this.tikets.findByEmailPopulate(purchaserEmail)
    }

    async findTiketByCode(code) {
        return await this.tikets.findTiketByCodePopulate(code)
    }

    async calculateAmount(purchasedProducts) {
        let amount = 0;
        let purchased = purchasedProducts.products

        for (const product of purchased) {
            try {
                const productPrice = await this.getProductPrice(product.product)
                amount += productPrice * product.quantity;
            } catch (error) {
                console.error(`Error al obtener el precio del producto para el ID ${product.product}`, error);
            }
        }
        return amount
    }

    async getProductPrice(productId) {
        const product = await this.productsController.getProductById(productId);
        return parseFloat(product.price)
    }

    async sendEmailPurchase(userMail) {
        try {
            const tiketData = await this.findTiketByEmail({ purchaser: userMail });

            if (!tiketData) {
                console.error(`No se encontró tiket para el correo electrónico del usuario: ${userMail}`);
                return;
            }

            let productTiket = `
            <table>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Imagen</th>
                  <th scope="col">Producto</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Precio Unitario</th>
                  <th scope="col">Subtotal</th>
                </tr>
              </thead>
              <tbody>`;

            let itemCount = 0;
            tiketData.products.forEach((prod) => {
                const subt = parseFloat(prod.product.price) * prod.quantity;
                itemCount++;

                productTiket += `
                <tr key=${prod.product._id}>
                  <th scope="row">${itemCount}</th>
                  <td>
                    <a href="https://backend53120gastonchoque.onrender.com/products/${prod.product._id}">
                      <img src="${prod.product.thumbnail}" alt="${prod.product.title}" width="50" />
                    </a>
                  </td>
                  <td>${prod.product.title}</td>
                  <td>${prod.quantity}</td>
                  <td>$${prod.product.price}</td>
                  <td>$${subt.toFixed(2)}</td> </tr>`;
            });

            productTiket += `
              </tbody>
            </table>
            <tbody>
                    <tr>
                        <th>Total de la compra</th>
                        <th>$${tiketData.amount}</th>
                    </tr>
                </tbody>`;

            const email = await transport.sendMail({
                from: `AppCoderEmail <${config.APP_EMAIL_EMAIL}>`,
                to: userMail,
                subject: 'Te enviamos tu tiket de compra!',
                html: `
              <div>
                <h1>¡Gracias por tu compra!</h1>
                <p>Te adjuntamos tu tiket de compra.</p>
                ${productTiket}
              </div>`,
                attachments: [{
                    filename: 'arrows.jpg',
                    path: `${__dirname}/../../public/images/arrows.jpg`,
                    cid: 'flechas'
                }]
            });

            console.log('Correo electrónico enviado correctamente!');
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
        }
    }


}