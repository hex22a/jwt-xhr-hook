# JWT XHR hook
[![Build Status](https://travis-ci.org/hex22a/jwt-xhr-hook.svg?branch=master)](https://travis-ci.org/hex22a/jwt-xhr-hook)
[![Coverage Status](https://coveralls.io/repos/github/hex22a/jwt-xhr-hook/badge.svg?branch=master)](https://coveralls.io/github/hex22a/jwt-xhr-hook?branch=master)

XHR hook to save JWT into localStorage and inject it to request. Suppose to work even in browser using `<script>` tag. Но это не точно.

## Installation

`yarn add jwt-xhr-hook`

or `npm i --save jwt-xhr-hook` if you are still using npm

## Usage

Simple import TokenHook using default export.

```javascript
import TokenHook, { catchToken, injectToken } from 'jwt-xhr-hook';

import { loginUrl, usersUrl } from './actions/urls';

const hook = new TokenHook();

hook.installHook(loginUrl, catchToken);
hook.installHook(usersUrl, injectToken);
```

JWT XHR hook contains 2 built-in callbacks:
```javascript
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
```

## Own inject/catch callbacks

```javascript
hook.installHook(loginUrl, (xhr, [options, token]) => {
	// do something
});

```

where xhr is a default XMLHttpRequest object

## Contributing
PR's are welcome 👍

## Credits
Maintained by [Albert Fazullin](http://github.com/AlbertFazullin).
[hex22a](http://github.com/hex22a) - that's also me.

Twitter: [@hex22a](https://twitter.com/hex22a)
