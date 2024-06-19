import fs from "fs";

const path = "./SRC/FS/carts.json";

export default class cartsMemory {

    constructor() {
        this.fs = fs
        this.path = path
        this.fs.existsSync(path) ? this.carts : this.fs.writeFileSync(path, "[]");
        this.carts = JSON.parse(this.fs.readFileSync(this.path));
        this.currentId = this.carts.reduce((max, cart) => {
            return typeof cart._id === 'number' && cart._id > max ? cart._id : max;
        }, 0);
    }

    async getAll() {
        return await this.carts;
    }

    async getById(cId) {
        let inCartsById = await this.carts.find((data) => data._id === parseInt(cId))
        return inCartsById ? inCartsById : console.log("Not found id");
    }

    async addCart() {
        this.currentId++
        const cartNew = {
            _id: this.currentId,
            products: []
        }
        const allCarts = await this.getAll();
        allCarts.push(cartNew);
        const carts = JSON.stringify(allCarts, null, "\t");
        this.fs.writeFileSync(this.path, carts);
        let cartCreate = this.getById(cartNew._id)
        return cartCreate
    }


    async findOne(cId) {
        let inCartsById = await this.carts.find((data) => data._id === parseInt(cId))
        return inCartsById ? inCartsById : console.log("Not found id");
    }

    async deleteProdInCart(cId, pId) {
        const allCarts = await this.getAll();
        const cartIndex = allCarts.findIndex(cart => cart._id === cId);
      
        if (cartIndex !== -1) {
          allCarts[cartIndex].products = allCarts[cartIndex].products.filter(
            product => product.product !== pId
          );
      
          const updatedCartsData = JSON.stringify(allCarts, null, "\t");
          await this.fs.writeFileSync(this.path, updatedCartsData);
          return true;
        } else {
          throw new Error(`Cart with ID "${cId}" not found.`);
        }
      }
      

      async findByIdAndUpdate(cId, newCart) {
        const allCarts = await this.getAll();
        const cartIndex = allCarts.findIndex(cart => cart._id === cId);
      
        if (cartIndex !== -1) {
          allCarts[cartIndex] = newCart;
          const updatedCartsData = JSON.stringify(allCarts, null, "\t");
          await this.fs.writeFileSync(this.path, updatedCartsData);
          return true;
        } else {
          throw new Error(`Cart with ID "${cId}" not found.`);
        }
      }
      

      async updateOneCleCart(cId) {
        const allCarts = await this.getAll();
        const cartIndex = allCarts.findIndex(cart => cart._id === cId);
      
        if (cartIndex !== -1) {
          allCarts[cartIndex].products = [];
          const updatedCartsData = JSON.stringify(allCarts, null, "\t");
          await this.fs.writeFileSync(this.path, updatedCartsData);
          return true;
        } else {
          throw new Error(`Cart with ID "${cId}" not found.`);
        }
      }
      

      async deleteCart(cId) {
        const allCarts = await this.getAll();
        const filteredCarts = allCarts.filter(cart => cart._id !== cId);
      
        if (filteredCarts.length === allCarts.length) {
          throw new Error(`Cart with ID "${cId}" not found.`);
        }
      
        const updatedCartsData = JSON.stringify(filteredCarts, null, "\t");
        await this.fs.writeFileSync(this.path, updatedCartsData);
        return true;
      }
      

      async findOneAndUpdateUpdCart(cId, pId, valQuantity) {
        const allCarts = await this.getAll();
        const cartIndex = allCarts.findIndex(cart => cart._id === parseInt(cId));
      
        if (cartIndex !== -1) {
          const foundProductIndex = allCarts[cartIndex].products.findIndex(
            product => product.product === pId
          );
      
          if (foundProductIndex !== -1) {
            allCarts[cartIndex].products[foundProductIndex].quantity = valQuantity;
          } else {
            allCarts[cartIndex].products.push({ product: pId, quantity: valQuantity });
          }
          const updatedCartsData = JSON.stringify(allCarts, null, "\t");
          await this.fs.writeFileSync(this.path, updatedCartsData);
          return true;
        } else {
          throw new Error(`Cart with ID "${cId}" not found.`);
        }
      }
      

      async updateOneUpdCart(cId, pId, valQuantity) {
        const allCarts = await this.getAll();
        const cartIndex = allCarts.findIndex(cart => cart._id === parseInt(cId));
      
        if (cartIndex !== -1) {
          let productUpdated = false;
      
          for (let i = 0; i < allCarts[cartIndex].products.length; i++) {
            if (allCarts[cartIndex].products[i].product === pId) {
              allCarts[cartIndex].products[i].quantity += valQuantity;
              productUpdated = true;
              break;
            }
          }
      
          if (!productUpdated) {
            throw new Error(`Product with ID "${pId}" not found in cart with ID "${cId}".`);
          }
      
          const updatedCartsData = JSON.stringify(allCarts, null, "\t");
          await this.fs.writeFileSync(this.path, updatedCartsData);
          return true;
        } else {
          throw new Error(`Cart with ID "${cId}" not found.`);
        }
      }
      
}