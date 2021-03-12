
var socket = io('http://192.168.100.16:3001/');
socket.on('toa-do',function (params) {
    console.log(params);
});
socket.on('coordinates_real',function (params) {
    console.log(params);
});
socket.on('block-trading',function(data)
{
console.log(data);
});
socket.on('check-result',function(data)
{
console.log(data);
});