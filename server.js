const express = require("express");
const app = express();
const axios = require('axios')
const cors = require("cors");
const cron = require("node-cron"); 
const mysql = require("mysql2");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',  
    }
  });

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "your_user",
//   password: "your_password",
//   database: "your_database"
// })

server.listen(process.env.PORT || 3000 );

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!!!")
// });

 const url = 'http://192.168.100.29/trading_view/api/'
const headers = {
    'Authorization': 'Basic YWRtaW46cXRjdGVrQDEyMwx=='
}

var dem = 0;
io.on("connection", function(socket){ 
  dem++;
  console.log("có người kết nối");  
  console.log(dem);
  function TaoSoNgauNhien(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  if(dem < 2 )
  {
    var visits=22532;
    // var GG = TaoSoNgauNhien(G-5000, G+5000);
    setInterval(function () {

      //var time_start = new Date().getTime();
      y = Math.round((visits + (Math.random() < 0.5 ? 1 : -1) * Math.random()) *1000)/1000;
     // var y = TaoSoNgauNhien(10000, 90000);
     // var now_time = new Date().getTime();
      var x = Math.floor((new Date().getTime())/1000);
      var coordinate_xy = {x:x, y:y};
      var coordinate_xy_string = JSON.stringify(coordinate_xy);
      const data_round1 = { detect: 'add_coordinate',coordinate_xy:coordinate_xy_string, time_present:x,
      session_time_open:x};
      axios.post(url, data_round1, { headers,
      }).then((res) => {
        console.log(res.data);
        if(res.data.success == "true")
        {
          io.sockets.emit('diem-g',coordinate_xy);
        }
        
      }).catch((error) => {
      })

      io.sockets.emit('toa-do',coordinate_xy);

      //get DB

      const data_round = { detect: 'win_lose_trade',time_break:x};
      axios.post(url, data_round, { headers,
      }).then((res) => {
       
    
        if(res.data.success == "true")  
        { 
          if(res.data.data[0].result_trade == "UP")
          {
            var G = JSON.parse(res.data.data[0].coordinate_g);
            console.log(G);

            io.sockets.emit('block-tradeing',{'notification':'block_trading'});

          }else{

           io.sockets.emit('block-tradeing',{'notification':'block_trading'});
          
          }
          
        }

      }).catch((error) => {
      }) 
      
      
    }, 1000); 


 }

  // mở sàn
  // var time = 0;
  // cron.schedule("*/60 9 * * *", function() { 
  //    var z = TaoSoNgauNhien(30000, 70000);
  // //   setInterval(function () {
  // //     //var time_start = new Date().getTime();
  // //     var y = TaoSoNgauNhien(10000, 90000);
  // //     var x = new Date().getTime();
  // //     io.sockets.emit('toa-do',{'x':x, 'y':y , 'z':z});
  // //     //get DB
      
  // //   }, 1000); 



    
  // });

});





app.get("/",function(req,res){
    res.render("index");
});
app.get("/bep",function(req,res){
    res.render("bep");
});