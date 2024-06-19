import fs from "fs";


export class ProductManager {
    constructor(path) {
        this.fs = fs
        this.path = path;
        this.currentId = 0;
        this.fs.existsSync(path) ? this.readProducts = JSON.parse(this.fs.readFileSync(this.path)) : this.readProducts = []
    }


    addProduct(product) {
        if (this.inProductsByCode(product.code)) {
            console.log(`Error el producto ${product.title} contiene un codigo "${product.code}" ya cargado.`);
        } else {
            const productNew =
            {
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock
            }

            if (!Object.values(productNew).includes(undefined)) {
                const newProducts = this.getProducts()
                this.currentId++
                newProducts.push({ ...productNew, id: this.currentId })
                this.saveToFS(newProducts)
            } else {
                console.log(`El producto que estas intentando agregar "${product.title}" no contiene todos los valores, asegurate de completar todos los campos`);
            }
        }
    }

    getProducts() {
        return this.readProducts;
    }

    inProductsById(id) {
        return this.readProducts.find((prod) => prod.id === id)
    }

    inProductsByCode(code) {
        return this.readProducts.some((prod) => prod.code === code)
    }

    getProductById(id) {
        return this.inProductsById(id) ? this.inProductsById(id) : console.log("Not found");
    }

    saveToFS(newProducts) {
        const products = JSON.stringify(newProducts, null, "\t");
        this.fs.writeFileSync(this.path, products);
    }

    updateProduct(id, newUpdate) {
        let products = this.getProducts();
        const productIndex = products.findIndex(prod => prod.id === id);
        if (productIndex === -1) {
            return console.log(`El producto con el id: "${id}" no existe.`);
        } else {
            const productToUpdate = { ...products[productIndex], ...newUpdate };
            products[productIndex] = productToUpdate;
            this.saveToFS(products)
        }
    }

    deleteProduct(id) {
        let products = this.getProducts();
        const productIndex = products.findIndex(prod => prod.id === id);
        if (productIndex === -1) {
            return console.log(`El producto con el id: "${id}" no existe.`);
        } else {
            let deletedProduct = products[productIndex]
            products.splice(productIndex, 1);
            this.saveToFS(products);
            return deletedProduct
        }
    }
}