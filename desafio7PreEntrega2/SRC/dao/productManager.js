import productsModel from "./models/productsModel.js"


export class productManager {


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

        let productsRender = await productsModel.paginate(valQuery, { page: valPage, limit: valLimit, lean: true });

        if (valSort && productsRender.docs.length > 0) {
            productsRender.docs.sort((a, b) => {
              return sort === 'asc' ? a.price - b.price : b.price - a.price;
            });
          }

        return productsRender
    }

    async inProductsByCode(code) {
        return await productsModel.findOne({ code: code })
    }

    async getProductById(id) {
        let inProductsById = await productsModel.findOne({ _id: id }).lean();
        if (inProductsById) {
            return inProductsById;
        } else {
            throw new Error("Not found");
        }
    }

    async saveToBD(newProduct) {
        return await productsModel.create(newProduct)
    }

    async updateProduct(id, newUpdate) {
        let product = await productsModel.findOne({ _id: id })
        if (!product) {
            throw new Error(`El producto con el id: "${id}" no existe.`);
        } if (newUpdate.id === undefined || newUpdate.id === id) {
            if (!this.inProductsByCode(newUpdate.code) || newUpdate.code === product.code) {
                await productsModel.findOneAndUpdate({ _id: id }, newUpdate)
                return (`${product.title} modificado correctamente`)
            } else {
                throw new Error(`El codigo "${newUpdate.code}" que estas intentando cambiar ya existe`)
            }
        } else if (newUpdate.id !== id) {
            throw new Error(`No puedes modificar el ID de este producto`)
        }
    }

    async deleteProduct(id) {
        let product = await productsModel.findOne({ _id: id })
        if (!product) {
            throw new Error(`El producto con el id: "${id}" no existe.`);
        } else {
            await productsModel.deleteOne({ _id: id })
            return product
        }
    }

}
