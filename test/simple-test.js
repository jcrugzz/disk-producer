var test = require('tape');
var Disk = require('..');

test('ensure we receive a data object on produce', function (t) {
  t.plan(2);

  var saw = {};
  var disk = new Disk({ ttl: 5000 });

  disk.on('data', function (data) {
    saw[data.service] = data;
    var keys = Object.keys(saw);
    keys.forEach(function (key) {
      assess(saw[key]);
    });
    disk.destroy();
    t.end();
  });
  function assess(data) {
    t.ok(data, 'we have a data object wohoo');
    t.equals(typeof data.metric, 'number', 'it has a metric');
  }
});


