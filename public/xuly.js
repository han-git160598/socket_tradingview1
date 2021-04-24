
var socket = io('192.168.100.16:3000');

// socket.on('coordinates_real',function (params) {
//     console.log(params);
// });
// socket.on('block-trading',function(data)
// {
// console.log(data);
// });
// socket.on('check-result',function(data)
// {
// console.log(data);
// });
socket.on('ket-noi',function(data)
{
console.log(data);
});

socket.on('disconnect-socket',function(data){
console.log(data);
});
socket.on('forced_sign_out',function(data)
{
  console.log(data);
});
socket.on('khanh',function(data)
{
  console.log(data);
});