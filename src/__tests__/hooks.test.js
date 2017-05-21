/**
 * Crafted by x22a on 15.05.17.
 */

import { useFakeXMLHttpRequest } from 'sinon';
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

describe('Default hooks tests', () => {
  let xhr;

  beforeEach(() => {
    xhr = useFakeXMLHttpRequest();
  });

  afterEach(() => {
    xhr.restore();
    localStorage.clear();
  });

  it('Catches default token and saves it to localStorage by default saver', () => {
    const expectedXHR = new xhr();
    expectedXHR.readyState = 4;
    expectedXHR.status = 200;
    expectedXHR.responseType = 'json';
    expectedXHR.response = response;

    catchToken(expectedXHR);

    expect(localStorage.getItem('accessToken')).to.equal(response.token.accessToken);
    expect(localStorage.getItem('refreshToken')).to.equal(response.token.refreshToken);
  });

  it('Catches default token in text response and saves it to localStorage by default saver', () => {
    const expectedXHR = new xhr();
    expectedXHR.readyState = 4;
    expectedXHR.status = 200;
    expectedXHR.responseType = 'text';
    expectedXHR.response = JSON.stringify(response);

    catchToken(expectedXHR);

    expect(localStorage.getItem('accessToken')).to.equal(response.token.accessToken);
    expect(localStorage.getItem('refreshToken')).to.equal(response.token.refreshToken);
  });

  it('Injects access token from localStorage to request', () => {
    const expectedXHR = new xhr();
    localStorage.setItem('accessToken', response.token.accessToken);
    expectedXHR.readyState = 1;

    injectToken(expectedXHR);

    expect(expectedXHR.requestHeaders.Authorization).to.equal(`Bearer ${response.token.accessToken}`);
  });
});
