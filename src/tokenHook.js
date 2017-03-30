/**
 * Crafted by x22a on 27.03.17.
 */

export default class TokenHook {
  constructor() {
    const instance = this;

    this.hooks = {};
    this.initTime = new Date().getTime();

    this.oldOpen = XMLHttpRequest.prototype.open;
    this.oldSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function() {
      const currentUrl = arguments[1];
      const callback = instance.getHookCallbackForUrl(currentUrl);
      if (callback){
        this[instance.initTime] = {};
        this[instance.initTime].callback = callback;
      } else if (this[instance.initTime]){
        this.onreadystatechange = this[instance.initTime].orgCallback;
        delete this[instance.initTime];
      }
      instance.oldOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
      if (this[instance.initTime] && this[instance.initTime].callback){
        let handler;
        this[instance.initTime].orgCallback = this.onreadystatechange;
        this.onreadystatechange = handler = () => {
          if (this[instance.initTime].orgCallback) {
            this[instance.initTime].orgCallback.apply(this, Array.prototype.slice.apply(arguments));
          }
          this[instance.initTime].callback.call(this, this);
        };
        handler.call(this);
      }
      instance.oldSend.apply(this, arguments);
    };
  }

  convertStrToRegExp(str) {
    const targetExpr = str.substring(1, str.length-1);
    return new RegExp(targetExpr);
  }

  getHookCallbackForUrl(url) {
    const urlPats = Object.keys(this.hooks);
    for (let iter=0; iter<urlPats.length; iter++){
      if (this.convertStrToRegExp(urlPats[iter]).test(url)){
        return this.hooks[urlPats[iter]];
      }
    }
  }

  adaptAsRegEx(urlPat) {
    return new RegExp("^(http(s)?:\/\/)?" + urlPat + "(.)*$");
  }

  installHook(url, callback) {
    const targetUrl = (url instanceof RegExp) ? url : this.adaptAsRegEx(url);
    this.hooks[targetUrl] = callback;
  }

  removeHook(url) {
    const targetUrl = (url instanceof RegExp) ? url : this.adaptAsRegEx(url);
    delete this.hooks[targetUrl];
  }

  removeAllHooks() {
    this.hooks = {};
  }
}

const defaultCatchOpts = {
  tokens: [
    {
      name: 'authToken',
      path: ['token', 'auth_token'],
    },
    {
      name: 'refreshToken',
      path: ['token', 'refresh_token'],
    },
  ],
  saveToken: (key, token) => {
    localStorage.setItem(key, token);
  },
};

export const catchToken = (xhr, options = defaultCatchOpts) => {
  const { tokens, saveToken } = options;
  if (xhr.readyState === 4 && xhr.status === 200) {
    let res;
    if (xhr.responseType === 'json') {
      res = xhr.response;
    } else if (xhr.responseType === '' || xhr.responseType === 'text') {
      res = JSON.parse(xhr.response);
    }
    if (res) {
      tokens.forEach(({ name, path }) => {
        const resToken = path.reduce((prev, key) => {
          return prev[key];
        }, res);
        saveToken(name, resToken);
      });
    }
  }
};

export const injectToken = (xhr, token = 'authToken') => {
  const localToken = localStorage.getItem(token);
  if (xhr.readyState === 1 && localToken) {
    xhr.setRequestHeader('Authorization', `Bearer ${localToken}`);
  }
};
