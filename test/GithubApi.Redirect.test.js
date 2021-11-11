const agent = require('superagent');
const { StatusCodes } = require('http-status-codes');
const chai = require('chai');

const urlBase = 'https://github.com';
const githubUserName = 'aperdomob';

chai.use(require('chai-subset'));

const { expect } = chai;

describe('Github redirect test', () => {
  const newUrl = 'https://github.com/aperdomob/new-redirect-test';
  it('Check HEAD redirect', async () => {
    try {
      await agent.head(`${urlBase}/${githubUserName}/redirect-test`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
    } catch (error) {
      expect(error.status).equal(StatusCodes.MOVED_PERMANENTLY);
      expect(error.response.headers.location).equal(newUrl);
    }
  });

  it('Check GET redirect', async () => {
    const getRedirect = await agent.get(`${urlBase}/${githubUserName}/redirect-test`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    expect(getRedirect.status).equal(StatusCodes.OK);
  });
});
