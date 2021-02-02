
var socket = io('http://192.168.100.16:3000/');

$(document).ready(function() {
    const a = { id_business: '1'};
   socket.emit('join-store',a);
  
});
socket.on('toa-do',function (params) {
    console.log(params);
});