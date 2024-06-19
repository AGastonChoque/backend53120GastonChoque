import fs from "fs";


export class cartManager {
    constructor(path) {
        this.fs = fs
        this.path = path;
        this.fs.existsSync(path) ? this.carts : this.fs.writeFileSync(path, "[]");
        this.carts = JSON.parse(this.fs.readFileSync(this.path));
        this.currentId = this.carts.reduce((max, cart) => {
            return typeof cart.id === 'number' && cart.id > max ? cart.id : max;
        }, 0);
        this.products = JSON.parse(this.fs.readFileSync("./SRC/FS/products.json"));
    }


    addCart() {
        this.currentId++
        const cartNew = {
            id: this.currentId,
            products: []
        }
        const allCarts = this.getCarts();
        allCarts.push(cartNew);
        this.saveToFS(allCarts);
        return (`El carrito "${cartNew.id}" fue agregado correctamente`);
    }

    getCarts() {
        return this.carts;
    }

    getCartById(id) {
        let inCartsById = this.carts.find((cart) => cart.id === id)
        return inCartsById ? inCartsById : console.log("Not found");
    }

    saveToFS(allCarts) {
        const carts = JSON.stringify(allCarts, null, "\t");
        this.fs.writeFileSync(this.path, carts);
    }

    updateCart(cId, pId) {
        let carts = this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cId);
        if (cartIndex === -1) {
            throw new Error(`El carrito con el id: "${cId}" no existe.`);
        } else {
            const inProductsById = this.products.find((prod) => prod.id === pId);
            if (inProductsById !== undefined) {
                let quantity = 1
                const productAddedIndex = carts[cartIndex].products.findIndex(prod => prod.productId == pId)
                if (productAddedIndex === -1) {
                    carts[cartIndex].products.push({ productId: pId, quantity });
                    this.saveToFS(carts);
                    return (`Se agrego el producto id: "${pId}" al carrito id: "${cId}"`)
                } else {
                    carts[cartIndex].products[productAddedIndex].quantity += quantity;
                    this.saveToFS(carts);
                    return (`El producto id: "${pId}" del carrito id: "${cId}" cambio su cantidad a ${carts[cartIndex].products[productAddedIndex].quantity}`)
                }
            } else {
                throw new Error(`El producto con el id: ${pId} que intenta agregar no existe.`)
            }
        }
    }

    deleteProductInCart(cId, pId) {
        let carts = this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cId);
        if (cartIndex === -1) {
            throw new Error(`El carrito con el id: "${cId}" no existe.`);
        } else {
            const productAddedIndex = carts[cartIndex].products.findIndex(prod => prod.productId == pId)
            if (productAddedIndex === -1) {
                return (`El producto que intenta eliminar con el id: "${pId}" no esta cargado en el carrito id: "${cId}"`)
            } else {
                carts[cartIndex].products.splice(productAddedIndex, 1);
                this.saveToFS(carts);
                return (`El producto id: "${pId}" fue eliminado del carrito id: "${cId}".`)
            }
        }
    }
}
