
var socket = io('http://192.168.100.22:3000/');

$(document).ready(function() {
    const a = { id_business: '1'};
   socket.emit('join-store',a);
  
});
socket.on('toa-do',function (params) {
    console.log(params);
});
socket.on('block-tradeing',function(data)
{
console.log(data);
});