var SerialPort = require('serialport');
var port = new SerialPort('/dev/tty.usbserial-1460', {
  baudRate: 9600
});

port.on('data', function (data) {
  console.log('Data:', data);
});

port.write(new Buffer('o'));

module.exports.on = function(){
  /*var buf = new Buffer('o\n');
  console.log(buf);
  port.write(buf);*/
  var data = 'o';
  port.write(data);
    // Sending String character by character


  // Because there's no callback to write, write errors will be emitted on the port:

};
