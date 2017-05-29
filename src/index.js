/**
 * Crafted by x22a on 27.03.17.
 */

import { catchToken, injectToken } from './hooks';

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

  static convertStrToRegExp(str) {
    const targetExpr = str.substring(1, str.length-1);
    return new RegExp(targetExpr);
  }

  getHookCallbackForUrl(url) {
    const urlPats = Object.keys(this.hooks);
    for (let iter=0; iter<urlPats.length; iter++){
      if (TokenHook.convertStrToRegExp(urlPats[iter]).test(url)){
        return this.hooks[urlPats[iter]];
      }
    }
  }

  static adaptAsRegEx(urlPat) {
    return new RegExp("^(http(s)?:\/\/)?" + urlPat + "(.)*$");
  }

  installHook(url, callback = catchToken) {
    const targetUrl = (url instanceof RegExp) ? url : TokenHook.adaptAsRegEx(url);
    this.hooks[targetUrl] = callback;
  }

  removeHook(url) {
    const targetUrl = (url instanceof RegExp) ? url : TokenHook.adaptAsRegEx(url);
    delete this.hooks[targetUrl];
  }

  removeAllHooks() {
    this.hooks = {};
  }
}

export { catchToken, injectToken };
