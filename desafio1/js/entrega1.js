//Creo una clase ProductManager

class ProductManager {
    constructor() {
        this.products = [];
        this.currentId = 0;
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
                this.currentId++
                this.products.push({ ...productNew, id: this.currentId })
            }else{
                console.log(`El producto que estas intentando agregar "${product.title}" no contiene todos los valores, asegurate de completar todos los campos`);
            }
        }
    }

    getProducts() {
        return this.products;
    }

    inProductsById(id) {
        return this.products.find((prod) => prod.id === id)
    }

    inProductsByCode(code) {
        return this.products.some((prod) => prod.code === code)
    }

    getProductById(id) {
        this.inProductsById(id) ? console.log(`Producto encontrado "${this.inProductsById(id).title}"`) : console.log("Not found");;
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


// Se creará una instancia de la clase “ProductManager”
const products = new ProductManager

// Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
console.log(products.getProducts());

// Se llamará al método “addProduct” 
// El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
products.addProduct(prod1);
products.addProduct(prod2);
products.addProduct(prod5);

// Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
console.log(products.getProducts());

// Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.
products.addProduct(prod3);

// Se llamará al método “addProduct” con faltante/s en alguno/s de los campos, debe arrojar un error.
products.addProduct(prod4);

// Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
products.getProductById(2);
products.getProductById(50);











