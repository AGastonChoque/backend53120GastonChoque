import { expect } from 'chai';
import mongoose from 'mongoose';
import productsMongo from '../SRC/dao/mongo/productsMongo.js';

const connection = await mongoose.connect('mongodb+srv://agastonchoque:39006538@cluster0.pbe0mgy.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0');
const dao = new productsMongo();
const testProduct = {
    title: 'Coca Cola 3L',
    description: 'Coca Cola de 3L producto carbonatado',
    price: 1500,
    code: 'Coc3L',
    stock: 50,
    category: 'Bebidas'
};
const updateProduct = {
    title: 'Coca Cola 3L',
    description: 'Coca Cola de 3L producto carbonatado',
    price: 5000,
    code: 'Coc3L',
    stock: 50,
    category: 'Bebidas'
};

describe('Tests DAO Products', function () {
    before(function () {
        mongoose.connection.collections.products_tests.drop();
    });
    beforeEach(function () {
        this.timeout = 1000;
    });
    after(function () {});
    afterEach(function () {});
    

    it('create() crea un producto y lo devuelve como objeto.', async function () {
        const product = await dao.create(testProduct);
        expect(product).to.be.an('object');
        expect(product).to.have.property('_id');
        testProduct._id = product._id;
    });

    it('findOneCode() busca el producto mediante su codigo y lo devuelve como objeto.', async function () {
        const productByCode = await dao.findOneCode(testProduct.code);
        expect(productByCode).to.be.an('object');
        expect(productByCode).to.have.property('code', testProduct.code);
    });

    it('findOneIdLean() busca el producto mediante su id de y lo devuelve como objeto.', async function () {
        const productByIdLean = await dao.findOneIdLean(testProduct._id);
        expect(productByIdLean).to.be.an('object');
        expect(productByIdLean._id).to.eql(testProduct._id)
    });

    it('findOneId() busca el producto mediante su id de y lo devuelve como objeto.', async function () {
        const productById = await dao.findOneId(testProduct._id);
        expect(productById).to.be.an('object');
        expect(productById._id).to.eql(testProduct._id)
    });

    it('findAndUpdateIdNewUpdate() se le brinda un id y un objeto nuevo, mediante el id se busca lo busca y lo actualiza con el objeto nuevo, devuelve el nuevo objeto actualizado.', async function () {
        const productUpdate = await dao.findAndUpdateIdNewUpdate(testProduct._id, updateProduct);
        expect(productUpdate).to.be.an('object');
        expect(productUpdate).to.have.property('_id');
        expect(productUpdate.price).to.eql(updateProduct.price);
    });

    it('paginate() devuelve todos los productos con filtros de paginacion.', async function () {
        const result = await dao.paginate({}, 1, 10);
        expect(result).to.be.an('object');
        expect(result).to.have.property('docs').that.is.an('array');
        expect(result.docs).to.have.lengthOf.at.least(1);
    });

    it('deleteOneId() elimina el producto con el ID brindado.', async function () {
        const deleteProdAct = await dao.deleteOneId(testProduct._id);
        expect(deleteProdAct).to.have.property('deletedCount', 1);
        const productDelete = await dao.findOneId(testProduct._id);
        expect(productDelete).to.be.null;
    });

});
