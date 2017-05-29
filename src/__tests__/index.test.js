/**
 * Crafted by x22a on 01.04.17.
 */
import TokenHook, { catchToken } from '../index';
import { expect } from 'chai';

describe('Hook test', () => {
  it('Adapts string url to RegExp url', () => {
    // Arrange
    const expectedStringURL = 'www.test.test/login';
    const expectedRegExpURL = /^(http(s)?:\/\/)?www.test.test\/login(.)*$/;

    // Act
    const actualURL = TokenHook.adaptAsRegEx(expectedStringURL);

    //Assert
    expect(actualURL).to.deep.equal(expectedRegExpURL);
  });

  it('Converts string to RegExp', () => {
    // Arrange
    const expectedRegExp = /^(http(s)?:\/\/)?www.test.test\/login(.)*$/;
    const expectedString = expectedRegExp.toString();

    // Act
    const actualRegexp = TokenHook.convertStrToRegExp(expectedString);

    // Assert
    expect(actualRegexp).to.be.an.instanceof(RegExp);
    expect(actualRegexp).to.deep.equal(expectedRegExp);
  });

  it('Injects hook to catch token by URL and default catcher function', () => {
    // Arrange
    const expectedStringURL = 'www.test.test/login';
    const expectedRegExpURL = /^(http(s)?:\/\/)?www.test.test\/login(.)*$/;
    const expectedHook = new TokenHook();

    // Act
    expectedHook.installHook(expectedStringURL);

    // Assert
    expect(expectedHook.hooks[expectedRegExpURL]).to.be.equal(catchToken);
  });

  it('Injects hook to catch token by URL RegExp', () => {
    // Arrange
    const expectedRegExpURL = /^(.*)\/login$/;
    const expectedHook = new TokenHook();

    // Act
    expectedHook.installHook(expectedRegExpURL);
    // Assert
    expect(expectedHook.hooks[expectedRegExpURL]).to.be.equal(catchToken);
  });

  it('Gets hook callback for URL', () => {
    // Arrange
    const expectedRegExpURL = /^(.*)\/login$/;
    const expectedHook = new TokenHook();
    expectedHook.installHook(expectedRegExpURL);

    // Act
    const actualCallback = expectedHook.getHookCallbackForUrl('https://test.test/login');

    // Assert
    expect(actualCallback).to.be.equal(catchToken);
  });

  it('Removes hook', () => {
    const expectedRegExpLoginURL = /^(.*)\/login$/;
    const expectedRegExpFooURL = /^(.*)\/foo$/;
    const expectedHook = new TokenHook();
    expectedHook.installHook(expectedRegExpLoginURL);
    expectedHook.installHook(expectedRegExpFooURL);

    // Act
    expectedHook.removeHook(expectedRegExpLoginURL);

    // Assert
    expect(expectedHook.hooks[expectedRegExpFooURL]).to.be.equal(catchToken);
    expect(expectedHook.hooks[expectedRegExpLoginURL]).to.be.undefined;
  });

  it('Removes all token', () => {
    const expectedRegExpLoginURL = /^(.*)\/login$/;
    const expectedRegExpFooURL = /^(.*)\/foo$/;
    const expectedHook = new TokenHook();
    expectedHook.installHook(expectedRegExpLoginURL);
    expectedHook.installHook(expectedRegExpFooURL);

    // Act
    expectedHook.removeAllHooks();

    // Assert
    expect(expectedHook.hooks[expectedRegExpFooURL]).to.be.undefined;
    expect(expectedHook.hooks[expectedRegExpLoginURL]).to.be.undefined;
  });
});
