const agent = require('superagent');
const { StatusCodes } = require('http-status-codes');
const chai = require('chai');

const urlBase = 'https://api.github.com';

chai.use(require('chai-subset'));

const { expect } = chai;

describe('Github list users', () => {
  it('Default user quantity', async () => {
    const defaultUsers = await agent.get(`${urlBase}/users`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    expect(defaultUsers.status).equal(StatusCodes.OK);
    expect(defaultUsers.body).to.have.lengthOf(30);
  });
  it('Get 10 users', async () => {
    const defaultUsers = await agent.get(`${urlBase}/users`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent')
      .query({ per_page: 10 });
    expect(defaultUsers.status).equal(StatusCodes.OK);
    expect(defaultUsers.body).to.have.lengthOf(10);
  });
  it('Get 50 users', async () => {
    const defaultUsers = await agent.get(`${urlBase}/users`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent')
      .query({ per_page: 50 });
    expect(defaultUsers.status).equal(StatusCodes.OK);
    expect(defaultUsers.body).to.have.lengthOf(50);
  });
});
