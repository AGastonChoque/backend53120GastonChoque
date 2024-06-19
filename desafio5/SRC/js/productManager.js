import fs from "fs";


export class productManager {
    constructor(path) {
        this.fs = fs
        this.path = path;
        this.fs.existsSync(path) ? this.products : this.fs.writeFileSync(path, "[]");
        this.products = JSON.parse(this.fs.readFileSync(this.path))
        this.currentId = this.products.reduce((max, prod) => {
            return typeof prod.id === 'number' && prod.id > max ? prod.id : max;
        }, 0);
    }


    addProduct(product) {
        if (!this.inProductsByCode(product.code)) {
            const productNew = {
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail ? product.thumbnail : [],
                code: product.code,
                stock: product.stock,
                status: true,
                category: product.category
            };
            if (!Object.values(productNew).includes(undefined)) {
                const newProducts = this.getProducts();
                this.currentId++;
                newProducts.push({ ...productNew, id: this.currentId });
                this.saveToFS(newProducts);
                return (`El producto "${product.title}" fue agregado correctamente`);
            } else {
                throw new Error(`El producto que estás intentando agregar "${product.title}" no contiene todos los valores, asegúrate de completar todos los campos`);
            }
        } else {
            throw new Error(`Error: El producto ${product.title} contiene un código "${product.code}" ya cargado.`);
        }
    }

    getProducts() {
        return this.products;
    }

    inProductsByCode(code) {
        return this.products.some((prod) => prod.code === code)
    }

    getProductById(id) {
        let inProductsById = this.products.find((prod) => prod.id === id);
        if (inProductsById) {
            return inProductsById;
        } else {
            throw new Error("Not found");
        }
    }

    saveToFS(newProducts) {
        const products = JSON.stringify(newProducts, null, "\t");
        this.fs.writeFileSync(this.path, products);
    }

    updateProduct(id, newUpdate) {
        let products = this.getProducts();
        const productIndex = products.findIndex(prod => prod.id === id);
        if (productIndex === -1) {
            throw new Error(`El producto con el id: "${id}" no existe.`);
        } if (newUpdate.id === undefined || newUpdate.id === id) {
            if (!this.inProductsByCode(newUpdate.code) || newUpdate.code === products[productIndex].code) {
                const productToUpdate = { ...products[productIndex], ...newUpdate };
                products[productIndex] = productToUpdate;
                this.saveToFS(products)
                return (`${products[productIndex].title} modificado correctamente`)
            } else {
                throw new Error(`El codigo "${newUpdate.code}" que estas intentando cambiar ya existe`)
            } 
        } else if (newUpdate.id !== id) {
            throw new Error(`No puedes modificar el ID de este producto`)
        }
    }

    deleteProduct(id) {
        let products = this.getProducts();
        const productIndex = products.findIndex(prod => prod.id === id);
        if (productIndex === -1) {
            throw new Error(`El producto con el id: "${id}" no existe.`);
        } else {
            let deletedProduct = products[productIndex]
            products.splice(productIndex, 1);
            this.saveToFS(products);
            return deletedProduct
        }
    }
}
