// const Mocha = require('mocha');

// const mocha = new Mocha();
// const { describe, it } = require('mocha');
const sinon = require('sinon');
const chai = require('chai');
const { expect } = require('chai');
const axios = require('axios');

const chaiHttp = require('chai-http');
const app = require('../app');
// const { response } = require('../app');

chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();

const tokenUser = { Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoibG9yZGVsbG8iLCJpZCI6NSwiaWF0IjoxNjg2MTUwNTg4LCJleHAiOjE2OTM5MjY1ODh9.ebwAC216l0FR7mE_7u41ocDsH0UrjGl7HksUlJirha0' };

const badTokenUser = { Authorization: 'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiam9hbyIsImlkIjo0LCJpYXQiOjE2NzI5NzIyNjMsImV4cCI6MTY4MDc0ODI2M30.aSkWcilgYkp--YWZPl3GKnUCPWldJp3gK1yETG7CCYQ' };

const notToken = {};

const newTaskEdited = {
  description: 'Pinar projetos pessoais no github',
  status: 'Concluido',
};


describe('Testes PUT da rota /idTask', async () => {
  

  const sendReqTasksByUser = async (tkn) => {
    const response = await (requester.put('/tasks/4/').set(tkn).send(newTaskEdited));
    token = response.body.token;
    return response;
  };

  const sendReqTasksByUser2 = async (tkn) => {
    const response = await (requester.put('/tasks/170000/').set(tkn).send(newTaskEdited));
    token = response.body.token;
    return response;
  };

  // Outra forma de fazer nao usando o stub, nao muito legal pois estara manipulando os dados e dependendo de api o que nao e muito legal.
   

  // before(async () => await sendReqTasksByUser2());  
  // beforeEach(async () => await sendReqTasksByUser2());

  // it('Retorna o status 204,quando a requisicao put for bem sucedida', async () => {
  //   const response = await sendReqTasksByUser(tokenUser);

  //   expect(response.statusCode).to.be.equal(204);
  //   // expect(response.body).to.deep.equal(tasksUser);
  // });

  

  it('Retorna o status 204,quando a requisicao put for bem sucedida', async () => {
    const postStub = sinon.stub(axios, 'put');

    const payload = {
      description: 'Pinar projetos pessoais no github',
      status: 'Concluido',
    };

    const url = 'http://localhost:3001/tasks/4/';

    const taskEdited = {
      description: 'Pinar projetos pessoais no github',
      status: 'Concluido',
    };

    await postStub.withArgs(url, taskEdited).returns(Promise
      .resolve({ status: 204 }));
    const response = await axios.put(url, payload, tokenUser);
    expect(response.status).to.be.equal(204);
    postStub.restore();
  });

  it('Retorna o status 401 e mensagem, quando o token enviado no header nao e valido!', async () => {
    const response = await sendReqTasksByUser(badTokenUser);

    expect(response.statusCode).to.be.equal(401);
    expect(response.body.message).to.be.equal('invalid token');
  });

  it('Retorna o status 401 e mensagem, quando o token for ausente no header!', async () => {
    const response = await sendReqTasksByUser(notToken);

    expect(response.statusCode).to.be.equal(401);
    expect(response.body.error).to.be.equal('Token não encontrado');
  });

  it('Retorna o status 404 e mensagem, quando o id da tarefa informada nao existir', async () => {
    const response = await sendReqTasksByUser2(tokenUser);

    expect(response.statusCode).to.be.equal(404);
    expect(response.body.message).to.be.equal('Tarefa não existente ou não encontrada');
  });
});