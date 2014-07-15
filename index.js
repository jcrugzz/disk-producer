/*
 * disk.js :: responsible for getting disk usage metrics from the df command
 *
 * (C) 2014, Jarrett Cruger, MIT
 *
 */

var exec = require('child_process').exec,
    util = require('util'),
    Producer = require('producer');

//
// ### function Disk (options)
// @options {Object} Options for this instance (see producer options)
// Constructor function for this custom producer that grabs the % disk usage
// from the df command
//
var Disk = module.exports = function (options) {
  if(!(this instanceof Disk)) { return new Disk(options) }
  // Percent to detect when this is an error
  this.percent = options.percent || 90;

  Producer.call(this, options);
};

//
// Inherit from a godot producer
//
util.inherits(Disk, Producer);

//
// ### function produce()
// Produces events on disk usage
//
Disk.prototype.produce = function () {
  var self = this,
      now = Date.now();

  this._diskUsage(function (err, percent) {
    self.emit('data', {
      host: self.values.host,
      service: 'disk/usage',
      state: percent > self.percent ? 'error' : 'ok',
      time: now,
      description: 'Disk usage metric',
      metric: percent,
      ttl: self.ttl
    });
  });

};

//
// ### function _diskUsage(callback)
// #### @callback Continuation after the exec process
// Grab the disk usage % so we can properly act on a machine when it gets to
// that point
//
Disk.prototype._diskUsage = function (callback) {
  //
  // Remark: Exec df command and use awk to grab the filesystem column and the
  // disk usage column as we might want the disk name column in the future
  //
  exec('df -Pkh | awk \'{print $1, $5}\'', function (err, stdout, stderr) {
    if (err) return callback(err);
    var lines = stdout.split('\n').filter(Boolean);
    //
    // Remark: We will take a naive approach here and assume the disk we are
    // checking is the first one. This is the case from what I've seen and the
    // P is used so the output is consistent. THis may need to be more complex
    // in the case of azure
    //
    var diskPerc = lines[1].split(' ')[1].slice(0, -1);

    callback(null, parseInt(diskPerc, 10));
  });
};

