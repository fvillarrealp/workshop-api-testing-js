const agent = require('superagent');
require('dotenv').config();
const { expect } = require('chai');

describe('Repositories DELETE', () => {
  let gist;

  it('CREATE Gist with POST', async () => {
    const res = await agent
      .post('https://api.github.com/gists')
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent')
      .send({
        files: {
          'promiseExample.js': {
            content: 'content'
          }
        },
        public: true
      });
    expect(res.status).to.equal(201);
    gist = res.body;
    expect(gist.public).to.equal(true);
    expect(gist.files).to.be.an('object');
    const expectedFile = gist.files['promiseExample.js'];
    expect(expectedFile).to.be.an('object');
    expect(expectedFile.content).to.equal('content');
  });

  it('CHECK gist', async () => {
    const res = await agent.get(gist.url).auth('token', process.env.ACCESS_TOKEN).set('User-Agent', 'agent');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
  });

  it('DELETE gist', async () => {
    const res = await agent
      .delete(gist.url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    expect(res.status).to.equal(204);
    expect(res.body).to.eql({});
  });

  it('Check gist elimination', async () => {
    let res;
    try {
      res = await agent.get(gist.url).auth('token', process.env.ACCESS_TOKEN).set('User-Agent', 'agent');
    } catch (error) {
      res = error;
    }
    expect(res.status).to.equal(404);
  });
});
