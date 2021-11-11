const agent = require('superagent');
const { StatusCodes } = require('http-status-codes');
const chai = require('chai');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';

const { expect } = chai;

describe('Github PUT method consume', () => {
  it('Follow with authenticated user', async () => {
    const response = await agent.put(`${urlBase}/user/following/${githubUserName}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set({ 'User-Agent': 'ahurtadoc', 'Content-Length': 0 });
    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
    // eslint-disable-next-line no-unused-expressions
    expect(response.body).to.be.empty;
  });

  it('Verify follow user', async () => {
    const response = await agent.get(`${urlBase}/user/following`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'ahurtadoc');
    expect(response.status).to.equal(StatusCodes.OK);
    const findedUser = response.body.find((user) => user.login === githubUserName);
    expect(findedUser).to.not.equal(undefined);
  });

  it('Verify PUT idempotent method', async () => {
    const response = await agent.put(`${urlBase}/user/following/${githubUserName}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set({ 'User-Agent': 'ahurtadoc', 'Content-Length': 0 });
    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
    // eslint-disable-next-line no-unused-expressions
    expect(response.body).to.be.empty;
  });
});
