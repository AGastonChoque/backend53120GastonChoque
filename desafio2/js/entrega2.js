//Creo una clase ProductManager

class ProductManager {
    constructor(path) {
        this.fs = require("fs")
        this.path = path;
        this.fs.writeFileSync(path, "[]");
        this.currentId = 0;
        this.readProducts = JSON.parse(this.fs.readFileSync(this.path));
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


// Productos correctos
const prod1 = { title: "Coca Cola", description: "Coca Cola de 500Ml para disfrutar", price: 1250, thumbnail: "none", code: "abc123", stock: 50 }
const prod2 = { title: "Fanta", description: "Fanta de 500Ml para disfrutar", price: 800, thumbnail: "none", code: "abc1234", stock: 100 }
const prod5 = { title: "Manaos", description: "Manaos Cola de 500Ml para disfrutar", price: 2000, thumbnail: "none", code: "abc12345", stock: 25 }
// Producto con "code" igual a otro porducto ya agregado (abc1234)
const prod3 = { title: "Sprite", description: "Sprite de 500Ml para disfrutar", price: 900, thumbnail: "none", code: "abc1234", stock: 20 }
// Producto con faltante en uno de los campos (price)
const prod4 = { title: "Pepsi", description: "Pepsi de 500Ml para disfrutar", thumbnail: "none", code: 261, stock: 10 }
// Producto para actualizar otro // Contiene propiedades faltantes, por lo que esas propiedades-valor quedaran guardadas con los datos anteriormente cargados
const prod6 = { title: "Coca Cola Zero Azucar", price: 900, stock: 40 }

// Array de productos
const arrProducts= [
    prod1, prod2, prod3, prod4, prod5, prod6
]

// Se creará una instancia de la clase “ProductManager”.
const products = new ProductManager(`${__dirname}/products.json`);

// Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío [].
console.log("Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío [].");
console.log(products.getProducts());

// Se llamará al método “addProduct” con los campos: "title, description, price, thumnail, code, stock" (Campos correspondientes en los objetos anteriormente creados)
// El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE.
console.log("Agrego objetos mediante el metodo addProduct con un id generado automáticamente SIN REPETIRSE.");
products.addProduct(arrProducts[0]);
products.addProduct(arrProducts[1]);
products.addProduct(arrProducts[4]);

// Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado.
console.log("Se llamará el método “getProducts” nuevamente, esta vez deben aparecer los productos recién agregados.");
console.log(products.getProducts());

// Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
console.log("Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.");
console.log(products.getProductById(1)); // Existe
products.getProductById(5); // No existe

// Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
console.log("Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.");
products.updateProduct(1, arrProducts[5]);
console.log(products.getProductById(1));

// Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
console.log("Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.");
console.log(products.deleteProduct(2)); // Existe
products.deleteProduct(5); // No existe

// Arreglo final
console.log("Arreglo final");
console.log(products.getProducts());