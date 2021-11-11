const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');
const crypto = require('crypto');

const createMD5Hash = (input) => crypto.createHash('md5').update(input).digest('hex');

describe('Repositories Api Test', () => {
  let repositorioActual;
  let readmeURL = '';

  describe('Repositories GET', () => {
    it('TEST by name', async () => {
      const response = await agent.get('https://api.github.com/users/aperdomob')
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.name).equal('Alejandro Perdomo');
    });
  });

  it('TEST by location', () => agent.get('https://api.github.com/users/aperdomob')
    .set('User-Agent', 'agent')
    .then((response) => {
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.location).equal('Colombia');
    }));

  it('SEARCH jasmine report', async () => {
    const res = await agent.get('https://api.github.com/users/aperdomob/repos')
      .set('User-Agent', 'agent');
    expect(res.body).to.be.an('array');
    const repo = res.body.find(
      (element) => element.name === 'jasmine-awesome-report'
    );
    expect(repo).not.equal(undefined);
    expect(repo.private).to.equal(false);
    expect(repo.description).to.equal('An awesome html report for Jasmine');
    repositorioActual = repo;
  });

  it('DOWNLOAD Repo', async () => {
    const repoUrl = `${repositorioActual.url}/zipball/master`;
    const res = await agent.get(repoUrl).set('User-Agent', 'agent');
    expect(res.status).to.equal(200);
    // Analyze md5
    expect(createMD5Hash(res.body)).to.equal(
      'df39e5cda0f48ae13a5c5fe432d2aefa'
    );
  });

  it('ANALYZE Readme', async () => {
    const readmeUrl = `${repositorioActual.url}/contents/README.md`;
    const res = await agent.get(readmeUrl).set('User-Agent', 'agent');
    expect(res.status).to.equal(200);
    expect(res.body.sha).to.equal('1eb7c4c6f8746fcb3d8767eca780d4f6c393c484');
    expect(res.body.path).to.equal('README.md');
    expect(res.body.name).to.equal('README.md');
    readmeURL = res.body.download_url;
  });

  it('Dowload and analyze README', async () => {
    const res = await agent.get(readmeURL).set('User-Agent', 'agent');
    expect(res.status).to.equal(200);
    expect(createMD5Hash(res.text)).to.equal(
      '97ee7616a991aa6535f24053957596b1'
    );
  });
});
