const agent = require('superagent');
const { expect } = require('chai');
require('dotenv').config();

describe('Repositories GET', () => {
  it('Follow aperdomo', async () => {
    const url = 'https://api.github.com/user/following/aperdomob';
    const res = await agent
      .put(url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    expect(res.status).to.equal(204);
    expect(res.body).to.eql({});
  });

  it('CHECK FOLLOWING Alejandro Perdomo', async () => {
    const followUrl = 'https://api.github.com/user/following';
    const res = await agent
      .get(followUrl)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    expect(res.body).to.be.an('array');
    const expectedUser = res.body.find(
      (element) => element.login === 'aperdomob'
    );

    expect(expectedUser).to.be.an('object');
    expect(expectedUser.login).to.equal('aperdomob');
  });

  it('VERIFY put method idempotencia', async () => {
    const url = 'https://api.github.com/user/following/aperdomob';
    const res = await agent
      .put(url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    expect(res.status).to.equal(204);
    expect(res.body).to.eql({});
  });
});
