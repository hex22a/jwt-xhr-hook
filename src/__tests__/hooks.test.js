/**
 * Crafted by x22a on 15.05.17.
 */

import superagent from 'superagent';
import { useFakeXMLHttpRequest, fakeServer } from 'sinon';
import { catchToken, injectToken } from '../hooks';

import { expect } from 'chai';

const response = {
  token: {
// eslint-disable-next-line max-len
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
// eslint-disable-next-line max-len
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiYWRtaW4iOmZhbHNlfQ.LlFOUnUtiyym7NVyKWshcrkuwQMGv6AriaTHH4ZK_dI',
  },
};

let xhr, requests, server;

describe('Default hooks tests', () => {
  beforeEach(() => {
    requests = [];
    server = fakeServer.create({
      autoRespond: true,
    });
    server.respondWith("GET", "/api/test", [200, { "Content-Type": "application/json" }, '{ "foo": "bar" }']);
    xhr = useFakeXMLHttpRequest();
    xhr.onCreate = xhr => {
      console.log('CREATE', xhr);
      requests.push(xhr);
    };
  });

  afterEach(() => {
    xhr.restore();
    server.restore();
    localStorage.clear();
  });

  it('Catches default token and saves it to localStorage by default saver', () => {
    xhr.readyState = 4;
    xhr.status = 200;
    xhr.response = response;
    xhr.responseType = 'json';
    catchToken(xhr);
    expect(localStorage.getItem('accessToken')).to.equal(response.token.accessToken);
    expect(localStorage.getItem('refreshToken')).to.equal(response.token.refreshToken);
  });

  it('Catches default token in text response and saves it to localStorage by default saver', () => {
    xhr.readyState = 4;
    xhr.status = 200;
    xhr.response = JSON.stringify(response);
    xhr.responseType = 'text';
    catchToken(xhr);
    expect(localStorage.getItem('accessToken')).to.equal(response.token.accessToken);
    expect(localStorage.getItem('refreshToken')).to.equal(response.token.refreshToken);
  });

  it('Injects access token from localStorage to request', () => {
    localStorage.setItem('accessToken', response.token.accessToken);
    injectToken(xhr);
    console.log(requests);
    superagent.get('/api/test').set('Accept', 'application/json').end((err, res) => {
      console.log(err);
      console.log(res);
    });
  });
});
