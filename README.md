# disk-producer

A readable stream based off of [`producer`][producer] that emits
a [`godot`][godot] event object on each ttl.

## example

```js
var Disk = require('disk-producer');

// You can pass in a percent option of where it will change the state of the
// event to 'error' from 'ok'
var disk = new Disk({ ttl: 5000, percent: 90 });

disk.on('data', function (data) {
  console.dir(data);
})

```

[producer]: https://github.com/jcrugzz/producer
[godot]: https://github.com/nodejitsu/godot
