import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('https://backend53120gastonchoque.onrender.com/');
const testUser = { 
    username: 'agastonchoque',
    formName: 'Gaston',
    formLastname: 'Choque',
    email: 'gastonchaoque95@gmail.com',
    formAge: 22,
    password: '12345'
};
let cookie;

describe('Test integración Users Register and Login', function () {
    describe('Test Users', function () {
        before(function () {});
        beforeEach(function () {});
        after(function () {});
        afterEach(function () {});
        
        it('POST /api/sessions/register debe registrar un nuevo usuario y redirigir a /login', async function () {
            const res = await requester.post('/api/sessions/register').send(testUser)
            expect(res.status).to.equal(302);
            expect(res.headers.location).to.equal('/login');
        });

        it('POST /api/sessions/register vuelvo a registrar un usuario con el mismo mail y me deberia redirigir a /failRegister', async function () {
            const res = await requester.post('/api/sessions/register').send(testUser)
            expect(res.status).to.equal(302);
            expect(res.headers.location).to.equal('/failRegister');
        });

        it('POST /api/sessions/login debe loguear correctamente al usuario', async function () {
            const result = await requester.post('/api/sessions/login').send(testUser);
            const cookieData = result.headers['set-cookie'][0];
            cookie = { name: cookieData.split('=')[0], value: cookieData.split('=')[1] };

            expect(cookieData).to.be.ok;
            expect(cookie.name).to.be.equals('cookieToken');
            expect(cookie.value).to.be.ok;
        });

        it('POST /api/sessions/current debe devolver datos correctos de usuario despues de pasarlos por un DTO', async function () {
            const { _body } = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);

            expect(_body).to.have.property('username');
            expect(_body).to.have.property('role');
            expect(_body).to.have.property('email').and.to.be.equals(testUser.email);
        });

    });
});
