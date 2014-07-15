# disk-producer

A readable stream based off of [`producer`][producer] that emits
a [`godot`][godot] event object on each ttl.

## example

```js
var Disk = require('disk-producer');

var disk = new Disk({ ttl: 5000 });

disk.on('data', function (data) {
  console.dir(data);
})

```

[producer]: https://github.com/jcrugzz/producer
[godot]: https://github.com/nodejitsu/godot
