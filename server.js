var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get('/chat', function(req, res){
  res.render('chat');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(process.env.PORT, process.env.IP, () => {
   console.log('Server started'); 
});