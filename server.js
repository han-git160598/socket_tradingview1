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
const headers = { 'Authorization': 'Basic YWRtaW46cXRjdGVrQDEyMwx==' }

var dem = 0;
io.on("connection", function(socket){ 
  dem++;
  console.log("có người kết nối");  
  console.log(dem);
  function TaoSoNgauNhien(min, max) {
    return Math.random() * (max - min) + min;
  }
  function random_y(number)
  {
    return Math.round((number + (Math.random() < 0.5 ? 1 : -1) * Math.random()) *1000)/1000;
  }
  if(dem < 2 )
  {
      var visits=10;
      setInterval(function () {
      var y = random_y(visits);
      var x = Math.floor((new Date().getTime())/1000);
      var xy = {x:x, y:y};
      var coordinate_xy = JSON.stringify(xy);
      
      const data_round1 = { detect: 'check_time_block',session_time_break:x };
      axios.post(url, data_round1, { headers,
      }).then((res) => {
           
        if(res.data.data[0].status_trade == 'trading')
        {
          console.log('trading');
          const data_add_coordinate = { detect: 'add_coordinate',coordinate_xy:coordinate_xy, time_present:x,
          session_time_open:x};
          axios.post(url, data_add_coordinate, { headers,
          }).then((res) => {
            
            io.sockets.emit('toa-do',coordinate_xy);

          }).catch((error) => {
          })
        }
        else
        {
          console.log('block');
          const data_round = { detect: 'win_lose_trade',time_break:x};
          axios.post(url, data_round, { headers,
          }).then((res) => {

            if(res.data.data[0].result_trade == "up")
            {
              console.log('up');
              if(parseInt(res.data.data[0].time_close) ==  Math.floor((new Date().getTime())/1000))
              {
                console.log('finish');
                var G = JSON.parse(res.data.data[0].coordinate_g);
                y = Math.round((TaoSoNgauNhien(G.y+0.1, G.y+0.9)) * 1000) / 1000;
                coordinate_xy = JSON.stringify({x:x, y:y}); 
                const data_add_coordinate = { detect: 'add_coordinate',coordinate_xy:coordinate_xy, time_present:x,
                session_time_open:x};
                axios.post(url, data_add_coordinate, { headers,
                }).then((res) => {
                    io.sockets.emit('toa-do',coordinate_xy);
                }).catch((error) => {
                })

              }else{
                console.log('break');
                var G = JSON.parse(res.data.data[0].coordinate_g);
                y = Math.round((TaoSoNgauNhien(G.y-0.3, G.y+0.5)) * 1000) / 1000;
                coordinate_xy = JSON.stringify({x:x, y:y}); 
                const data_add_coordinate = { detect: 'add_coordinate',coordinate_xy:coordinate_xy, time_present:x,
                session_time_open:x};
                axios.post(url, data_add_coordinate, { headers,
                }).then((res) => {
                    io.sockets.emit('toa-do',coordinate_xy);
                }).catch((error) => {
                })
              }
              
            }else{
              console.log('down');
            }


          }).catch((error) => {
          }) 
          

        }
          
      }).catch((error) => {
      })

//// nói phi trả về 1 cái json thông báo tơi time break




      
      
      // const data_round = { detect: 'win_lose_trade',time_break:x};
      // axios.post(url, data_round, { headers,
      // }).then((res) => {
      //   console.log(res.data.data[0]);
      //    var G = JSON.parse(res.data.data[0].coordinate_g);
      //    console.log(G.y-0.3);
      //   if(res.data.success == "true")  
      //   { 
      //     console.log('vo true');
      //     if(res.data.data[0].result_trade == "up")
      //     {
      //       console.log('up');
      //       io.sockets.emit('block-tradeing',{'notification':'block_trading'});
      //     //  console.log(G.y-0.3);
      //      // y = TaoSoNgauNhien(G.y - 0.3, G.y+0.5);  
      //       var coordinate_xy = {x:x, y:y};
      //       var coordinate_xy_string = JSON.stringify(coordinate_xy);
      //       const data_round1 = { detect: 'add_coordinate',coordinate_xy:coordinate_xy_string, time_present:x,
      //       session_time_open:x};
      //       axios.post(url, data_round1, { headers,
      //       }).then((res) => {
              
      //         io.sockets.emit('toa-do',coordinate_xy);

      //       }).catch((error) => {
      //       })
                                                                    
      //     }else{
      //       console.log('down');
      //     // io.sockets.emit('toa-do',coordinate_xy);

      //      io.sockets.emit('block-tradeing',{'notification':'block_trading'});
          
      //     }
          
      //   }else{ 
      //     console.log('add toa do');
      //     var coordinate_xy = {x:x, y:y};
      //     var coordinate_xy_string = JSON.stringify(coordinate_xy);
      //     const data_round1 = { detect: 'add_coordinate',coordinate_xy:coordinate_xy_string, time_present:x,
      //     session_time_open:x};
      //     axios.post(url, data_round1, { headers,
      //     }).then((res) => {
      //       io.sockets.emit('toa-do',coordinate_xy);
      //     }).catch((error) => {
      //     })
    
      //   }

      // }).catch((error) => {
      // }) 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //var time_start = new Date().getTime();
    //   y = Math.round((visits + (Math.random() < 0.5 ? 1 : -1) * Math.random()) *1000)/1000;
    //   var x = Math.floor((new Date().getTime())/1000);
    //   var coordinate_xy = {x:x, y:y};
    //   var coordinate_xy_string = JSON.stringify(coordinate_xy);
    //   const data_round1 = { detect: 'add_coordinate',coordinate_xy:coordinate_xy_string, time_present:x,
    //   session_time_open:x};
    //   axios.post(url, data_round1, { headers,
    //   }).then((res) => {
    //     console.log(res.data);
    //     if(res.data.success == "true")
    //     {
    //       io.sockets.emit('diem-g',coordinate_xy);

    //     }
        
    //   }).catch((error) => {
    //   })

    //   io.sockets.emit('toa-do',coordinate_xy);

    //   //get DB

    //   const data_round = { detect: 'win_lose_trade',time_break:x};
    //   axios.post(url, data_round, { headers,
    //   }).then((res) => {
       
    
    //     if(res.data.success == "true")  
    //     { 
    //       if(res.data.data[0].result_trade == "up")
    //       {
    //        // console.log(res.data.data[0].coordinate_g);
    //         var G = JSON.parse(res.data.data[0].coordinate_g);
    //         console.log('diem G up');
    //         console.log(G.y);
    //         (g+500, G-5000);

    //         io.sockets.emit('block-tradeing',{'notification':'block_trading'});

    //       }else{
    //        console.log('diem G down');
    //        console.log(G);
    //        io.sockets.emit('block-tradeing',{'notification':'block_trading'});
          
    //       }
          
    //     }

    //   }).catch((error) => {
    //   }) 
      
      
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