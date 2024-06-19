import fs from "fs";

const path = "./SRC/FS/products.json";

export default class productsMemory {

    constructor() {
        this.fs = fs
        this.path = path
        this.fs.existsSync(path) ? this.products : this.fs.writeFileSync(path, "[]");
        this.products = JSON.parse(this.fs.readFileSync(this.path));
        this.currentId = this.products.reduce((max, prod) => {
            return typeof prod._id === 'number' && prod._id > max ? prod._id : max;
        }, 0);
    }

    async paginate(valQuery, valPage, valLimit) {
        const products = await this.getProducts()
      
        const filteredProducts = await products.filter(product => {
          let match = true
      
          if (valQuery.category && valQuery.category !== product.category) {
            match = false
          }
      
          if (valQuery.status && valQuery.status !== product.status) {
            match = false;
          }
      
          return match;
        });
      
        const startIndex = (valPage - 1) * valLimit;
        const endIndex = startIndex + valLimit;
        const paginatedProducts = await filteredProducts.slice(startIndex, endIndex);
      
        return {
          docs: paginatedProducts,
          totalDocs: filteredProducts.length, 
          limit: valLimit,
          page: valPage,
        }
    }

    async findOneCode(code) {
        let inUsersByCode = await this.products.find((data) => data.code === code)
        return inUsersByCode ? inUsersByCode : console.log("Not found");
    }

    async findOneIdLean(id) {
        let inUsersById = await this.products.find((data) => data._id === parseInt(id))
        return inUsersById ? inUsersById : console.log("Not found id");
    }

    async getProducts() {
        return await this.products;
    }

    async create(newProduct) {
        this.currentId++
        const productNew = {
            _id: this.currentId,
            ...newProduct
        }
        const allProducts = await this.getProducts();
        allProducts.push(productNew);
        const products = JSON.stringify(allProducts, null, "\t");
        this.fs.writeFileSync(this.path, products);
        return (`El product "${productNew._id}" fue agregado correctamente`);
    }

    async findOneId(id) {
        let inUsersById = await this.products.find((data) => data._id === parseInt(id))
        return inUsersById ? inUsersById : console.log("Not found");
    }

    async findAndUpdateIdNewUpdate(id, newUpdate) {
        const productToUpdate = await this.findById(id);
      
        if (!productToUpdate) {
          console.error("Producto no encontrado");
          return null;
        }
      
        Object.assign(productToUpdate, newUpdate);
      
        const productIndex = await this.products.findIndex((product) => product._id === id);
      
        if (productIndex !== -1) {
          this.products[productIndex] = productToUpdate;
      
          const updatedProductsData = JSON.stringify(this.products, null, "\t");
          this.fs.writeFileSync(this.path, updatedProductsData);
        }
      
        return productToUpdate;
      }
      

      async deleteOneId(id) {
        let products = await this.getProducts();
        const productIndex = products.findIndex(prod => prod._id === id);
      
        if (productIndex === -1) {
          throw new Error(`El producto con el id: "${id}" no existe.`);
        }
      
        const deletedProduct = products.splice(productIndex, 1)[0];
        await this.create(products);
        return deletedProduct;
      }

    async findById(id) {
        let inUsersById = await this.products.find((data) => data._id === parseInt(id))
        return inUsersById ? inUsersById : console.log("Not found");
    }

    async inProductsByCode(code) {
        return await this.products.some((prod) => prod.code === code)
    }

}