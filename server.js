const express = require("express");
const app = express();
const axios = require('axios')
const cors = require("cors");
const cron = require("node-cron"); 
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
const io = require('socket.io')(server, {
    pingTimeout: 43200000,
    pingInterval: 2000,
    cors: {
      origin: '*',  
    }
  });

server.listen(process.env.PORT || 3000 );

// const url = 'http://192.168.100.31/muaban_pos/api/'
// const headers = {
//     'Authorization': 'Basic YWRtaW46cXRjdGVrQDEyMwx=='
//   }

io.on("connection", function(socket){ 
  console.log("có người kết nối");

  function TaoSoNgauNhien(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  setInterval(function () {
    const y = TaoSoNgauNhien(10000, 90000);
    const x = new Date().getTime();
    //var data = { 'x': x, 'y': y };
    //data.push({ 'x': x, 'y': y });
    //console.log(x);
    io.sockets.emit('toa-do',{'x':x, 'y':y});
    
  
  }, 5000); 
  


});





app.get("/",function(req,res){
    res.render("index");
});
app.get("/bep",function(req,res){
    res.render("bep");
});