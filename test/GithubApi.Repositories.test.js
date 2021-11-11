const agent = require('superagent');
const { StatusCodes } = require('http-status-codes');
const chai = require('chai');
const { createHash } = require('crypto');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';

chai.use(require('chai-subset'));

const { expect } = chai;

describe('Github Api Test', () => {
  describe('Repositories', () => {
    it('User name, company and location', async () => {
      const userInfo = {
        name: 'Alejandro Perdomo',
        company: 'Perficient Latam',
        location: 'Colombia'
      };
      const response = await agent.get(`${urlBase}/users/${githubUserName}`)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.containSubset(userInfo);

      describe('Find repo jasmine-awesome-report', () => {
        it('Check name, private, description', async () => {
          const url = response.body.repos_url;
          const repoInfo = {
            name: 'jasmine-awesome-report',
            private: false,
            description: 'An awesome html report for Jasmine'
          };
          const repos = await agent.get(url)
            .set('User-Agent', 'agent');
          const findedRepo = repos.body.find((repo) => repo.name === repoInfo.name);
          expect(repos.status).to.equal(StatusCodes.OK);
          expect(findedRepo).to.containSubset(repoInfo);

          describe('Download repo zip', () => {
            it('Check download', async () => {
              const md5Zip = 'df39e5cda0f48ae13a5c5fe432d2aefa';
              const download = await agent.get(findedRepo.downloads_url.replace('downloads', 'zipball'))
                .set('User-Agent', 'agent');

              expect(download.status).to.equal(StatusCodes.OK);
              expect(createHash('md5').update(download.body).digest('hex')).equal(md5Zip);
            });
          });

          describe('README.md info', () => {
            it('Check name, path, sha ', async () => {
              const { contents_url: readmeUrl } = findedRepo;
              const readmeInfo = {
                name: 'README.md',
                path: 'README.md',
                sha: '1eb7c4c6f8746fcb3d8767eca780d4f6c393c484'
              };
              const readMe = await agent.get(readmeUrl.replace('{+path}', readmeInfo.name))
                .set('User-Agent', 'agent');
              expect(readMe.status).to.equal(StatusCodes.OK);
              expect(readMe.body).to.containSubset(readmeInfo);

              describe('Download README.md file', () => {
                it('Checksum md5', async () => {
                  const { download_url: readmeDownloadUrl } = readMe.body;
                  const readmeMd5 = '97ee7616a991aa6535f24053957596b1';
                  const readmeFile = await agent.get(readmeDownloadUrl)
                    .set('User-Agent', 'agent');

                  expect(readmeFile.status).to.equal(StatusCodes.OK);
                  expect(createHash('md5').update(readmeFile.text).digest('hex')).equal(readmeMd5);
                });
              });
            });
          });
        });
      });
    });
  });
});
