import { fakerES as faker } from "@faker-js/faker"

export const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseInt(faker.commerce.price()),
        thumbnails: faker.image.url(),
        code: faker.string.alphanumeric(6),
        stock: faker.number.int({ min: 0, max: 100 }),
        status: faker.datatype.boolean(1.0),
        category: faker.commerce.department()

    }
}

export const generateRandomProducts = (quantity) => {
    let products = [];
    for (let i = 0; i < quantity; i++) {
        products.push(generateProduct());
    }
    return {
        products
    };
};