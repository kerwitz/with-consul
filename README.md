This is a very simple helper that will hook in on the .listen function of your express app to automatically register
a new service instance to consul.

## Installation
```
npm i -D with-consul
```
![npm](https://img.shields.io/npm/dm/with-consul?style=flat-square) ![npm](https://img.shields.io/npm/v/with-consul?style=flat-square)

## Usage
```js
const withConsul = require('with-consul');
const express = require('express');

const app = withConsul(express(), {
    name: 'my-service',
    address: 'localhost',
    tags: ['urlprefix-/my-service'],
});

const server = app.listen(0, () => {
    console.log(`Example app listening on port ${server.address().port}!`);

    app.get('/', () => {});
});
```

By default the package will create a new UUID for the service instance but you can overwrite it by providing your own
`id` in the options.