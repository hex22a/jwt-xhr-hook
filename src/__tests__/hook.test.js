/**
 * Crafted by x22a on 01.04.17.
 */

import TokenHook, { catchToken, injectToken } from '../index';
import { expect } from 'chai';

describe('Hook test', () => {
  it('Installs Hook', () => {
    const hook = new TokenHook();
    expect(hook).to.be.an('object');
  });

  it('Injects hook to catch token', () => {
    const hook = new TokenHook();
    expect(catchToken).to.be.a('function');
    hook.installHook('https://test.test/login', catchToken);
  });

  it('Injects hook to inject token', () => {
    const hook = new TokenHook();
    expect(injectToken).to.be.a('function');
    hook.installHook('https://test.test/users', injectToken);
  });
});
