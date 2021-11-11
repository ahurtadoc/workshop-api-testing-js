const agent = require('superagent');
const { StatusCodes } = require('http-status-codes');
const chai = require('chai');

const urlBase = 'https://api.github.com';

chai.use(require('chai-subset'));

const { expect } = chai;

const content = `
let myFirstPromise = new Promise((resolve, reject) => {
  // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
  // In this example, we use setTimeout(...) to simulate async code.
  // In reality, you will probably be using something like XHR or an HTML5 API.
  setTimeout( function() {
    resolve("Success!")  // Yay! Everything went well!
  }, 250)
})

myFirstPromise.then((successMessage) => {
  // successMessage is whatever we passed in the resolve(...) function above.
  // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
  console.log("Yay! " + successMessage)
});
`;
const description = 'Promise example from MDN documentation';

describe('Github DELETE method consume', () => {
  it('Create gist', async () => {
    const gistObject = { description, public: true, files: { 'promiseSample.js': { content } } };
    const response = await agent.post(`${urlBase}/gists`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set({ 'User-Agent': 'ahurtadoc', 'Content-Type': 'application/json' })
      .send(gistObject);
    expect(response.status).equal(StatusCodes.CREATED);
    const gistUrl = await response.body.url;
    expect(response.body).to.containSubset(gistObject);

    describe('Gist created and deleted', () => {
      it('Verify git exist', async () => {
        const gist = await agent.get(response.body.url)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Aget', 'ahurtadoc');
        expect(gist.status).equal(StatusCodes.OK);
      });

      it('Delete gist', async () => {
        const deletedGist = await agent.delete(gistUrl)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'ahurtadoc');
        expect(deletedGist.status).equal(StatusCodes.NO_CONTENT);
      });

      it('Verify gist deleted', async () => {
        const noFindGist = await agent.get(gistUrl)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Aget', 'ahurtadoc');
        expect(noFindGist.status).equal(StatusCodes.NOT_FOUND);
      });
    });
  });
});
