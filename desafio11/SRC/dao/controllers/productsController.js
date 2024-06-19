import productsServices from "../services/productsServices.js";


export class productsController {

    constructor () {
        this.productsServices = new productsServices()
    }


    async addProduct(product) {
        let productVerify = await this.inProductsByCode(product.code)
        if (!productVerify) {
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
                await this.saveToBD(product);
                return (`El producto "${product.title}" fue agregado correctamente`);
            } else {
                throw new Error(`El producto que estás intentando agregar "${product.title}" no contiene todos los valores, asegúrate de completar todos los campos`);
            }
        } else {
            throw new Error(`Error: El producto ${product.title} contiene un código "${product.code}" ya cargado.`);
        }
    }

    async getProducts(limit, page, query, sort, status) {
        const valLimit = limit ? limit : 10
        const valPage = page ? page : 1
        const valSort = sort ? sort : null
        let valQuery = {};
        if (query) {
            valQuery.category = query
        }
        if (status) {
            valQuery.status = status
        }

        let productsRender = await this.productsServices.paginate(valQuery, valPage, valLimit)

        if (valSort && productsRender.docs.length > 0) {
            productsRender.docs.sort((a, b) => {
              return sort === 'asc' ? a.price - b.price : b.price - a.price;
            });
          }

        return productsRender
    }

    async inProductsByCode(code) {
        return await this.productsServices.findOneCode(code)
    }

    async getProductById(id) {
        let inProductsById = await this.productsServices.findOneIdLean(id)
        if (inProductsById) {
            return inProductsById;
        } else {
            throw new Error("Not found");
        }
    }

    async saveToBD(newProduct) {
        return await this.productsServices.create(newProduct)
    }

    async updateProduct(id, newUpdate) {
        let product = await this.productsServices.findOneId(id)
        if (!product) {
            throw new Error(`El producto con el id: "${id}" no existe.`);
        } if (newUpdate.id === undefined || newUpdate.id === id) {
            if (!this.inProductsByCode(newUpdate.code) || newUpdate.code === product.code) {
                await this.productsServices.findAndUpdateIdNewUpdate(id, newUpdate)
                return (`${product.title} modificado correctamente`)
            } else {
                throw new Error(`El codigo "${newUpdate.code}" que estas intentando cambiar ya existe`)
            }
        } else if (newUpdate.id !== id) {
            throw new Error(`No puedes modificar el ID de este producto`)
        }
    }

    async deleteProduct(id) {
        let product = await this.productsServices.findOneId(id)
        if (!product) {
            throw new Error(`El producto con el id: "${id}" no existe.`);
        } else {
            await this.productsServices.deleteOneId(id)
            return product
        }
    }

}
