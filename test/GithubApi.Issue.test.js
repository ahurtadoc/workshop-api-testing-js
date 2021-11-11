const agent = require('superagent');
const { StatusCodes } = require('http-status-codes');
const chai = require('chai');

const urlBase = 'https://api.github.com';
const userRepo = 'protractor-workshop-2021';

chai.use(require('chai-subset'));

const { expect } = chai;

describe('Github POST  and PATCH  methods consume', () => {
  it('Get logged user', async () => {
    const user = await agent.get(`${urlBase}/user`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    expect(user.status).equal(StatusCodes.OK);
    const { repos_url: reposUrl, login: userName } = user.body;
    expect(user.body.public_repos).greaterThan(0);

    describe('User repo protractor-workshop-2021', () => {
      it('Verify repo exist', async () => {
        const repos = await agent.get(reposUrl)
          .set('User-Agent', 'agent');
        expect(repos.status).equal(StatusCodes.OK);
        const findedRepo = repos.body.find((repo) => repo.name === userRepo);
        expect(findedRepo).to.not.equal(undefined);
        const { name: repoName } = findedRepo;

        describe('Create issue in repo', () => {
          it('POST issue title', async () => {
            const title = 'Test issue';
            const infoIssue = {
              title,
              body: null
            };
            const issue = await agent.post(`${urlBase}/repos/${userName}/${repoName}/issues`)
              .auth('token', process.env.ACCESS_TOKEN)
              .set('User-Agent', 'agent')
              .send({ title });

            expect(issue.status).to.equal(StatusCodes.CREATED);
            const { number: issueNumber } = issue.body;
            expect(issue.body).to.containSubset(infoIssue);

            describe('Update body issue', () => {
              it('Patch issue', async () => {
                const body = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
                infoIssue.body = body;
                const issueUpdated = await agent.patch(`${urlBase}/repos/${userName}/${repoName}/issues/${issueNumber}`)
                  .auth('token', process.env.ACCESS_TOKEN)
                  .set('User-Agent', 'agent')
                  .send({ body });
                expect(issueUpdated.status).to.equal(StatusCodes.OK);
                expect(issueUpdated.body).to.containSubset(infoIssue);
              });
            });
          });
        });
      });
    });
  });
});
