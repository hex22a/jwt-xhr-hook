/**
 * Crafted by x22a on 15.05.17.
 */

/**
 * Definition type
 * @param {string} name - Token name
 * @param {[string]} path - Token path
 * @constructor
 */
const Definition = (name, path) => {
  this.name = name;
  this.path = path;
};

Definition.prototype = {};

/**
 * Default definitions
 * @typedef Definition
 */
const defaultDefinitions = [
  {
    name: 'accessToken',
    path: ['token', 'accessToken'],
  },
  {
    name: 'refreshToken',
    path: ['token', 'refreshToken'],
  },
];

/**
 * @name defaultSaver
 * @function
 * Saves token to localStorage
 * @param {string} key - key in localStorage where token will be saved
 * @param {string} token
 */
const defaultSaver = (key, token) => {
  localStorage.setItem(key, token);
};

/**
 * Default function to catch token from response
 * @function
 * @param xhr - XMLHTTPRequest object
 * @param {object | [object]} [tokenDefinitions=defaultDefinitions] - object or array of objects
 * describing how the token is stored in response
 * @param {function} [saver=defaultSaver] - function that saves token. {@link defaultSaver}
 */
export const catchToken = (xhr, tokenDefinitions = defaultDefinitions, saver = defaultSaver) => {
  if (xhr.readyState === 4 && xhr.status === 200) {
    let res;
    if (xhr.responseType === 'json') {
      res = xhr.response;
    } else if (xhr.responseType === '' || xhr.responseType === 'text') {
      res = JSON.parse(xhr.response);
    }
    if (res) {
      tokenDefinitions.forEach(({ name, path }) => {
        const resToken = path.reduce((prev, key) => {
          return prev[key];
        }, res);
        saver(name, resToken);
      });
    }
  }
};

/**
 * Default function to inject token into request (if present)
 * @param xhr - XMLHTTPRequest object
 * @param {string} [tokenKey=accessToken] - key where token is stored
 * @param {string} [schema=Bearer] - authorization schema
 */
export const injectToken = (xhr, tokenKey = 'accessToken', schema = 'Bearer') => {
  const localToken = localStorage.getItem(tokenKey);
  if (xhr.readyState === 1 && localToken) {
    xhr.setRequestHeader('Authorization', `${schema} ${localToken}`);
  }
};
