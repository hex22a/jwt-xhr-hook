# JWT XHR hook
[![Build Status](https://travis-ci.org/AlbertFazullin/fs-jwt-xhr-hook.svg?branch=master)](https://travis-ci.org/AlbertFazullin/fs-jwt-xhr-hook)
[![Coverage Status](https://coveralls.io/repos/github/AlbertFazullin/fs-jwt-xhr-hook/badge.svg?branch=master)](https://coveralls.io/github/AlbertFazullin/fs-jwt-xhr-hook?branch=master)

XHR hook to save JWT into localStorage and inject it to request. Suppose to work even in browser using `<script>` tag. Но это не точно.

## Installation

`yarn add fs-jwt-xhr-hook` 

or `npm i --save fs-jwt-xhr-hook` if you are still using npm

## Usage

Simple import TokenHook using default export.

```ecmascript 6
import TokenHook, { catchToken, injectToken } from 'fs-jwt-xhr-hook';

import { loginUrl, usersUrl } from './actions/urls';

const hook = new TokenHook();

hook.installHook(loginUrl, catchToken);
hook.installHook(usersUrl, injectToken);
```

JWT XHR hook contains 2 built-in callbacks:
```ecmascript 6
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

```ecmascript 6
hook.installHook(loginUrl, (xhr, [options, token]) => {
	// do something
});

```

where xhr is a default XMLHttpRequest object

## Contributing
PR's are welcome 👍

## Credits
Maintained by [Albert Fazullin](http://github.com/AlbertFazullin).

Twitter: [@hex22a](https://twitter.com/hex22a)

Written by [Flatstack](http://www.flatstack.com).

[<img src="http://www.flatstack.com/logo.svg" width="100"/>](http://www.flatstack.com)

