var http = require('http');
var socketIO = require('socket.io');
var core = require('core.js');
var port = 8080;
var ip = '127.0.0.1';
var server = http.createServer().listen(port, ip, function() {
    console.log('Connected');
});

var io = socketIO.listen(server);
io.set('match origin protocol', true);
io.set('origins', '*:*');

io.sockets.on('connection', function(socket) {
    var response = {
        data: {client_id: socket.id},
        message: 'Connected'
    };
    socket.emit('welcome', response);

    socket.on('request', function(request) {
        core.doRequest(request.control, request.action, request.data, socket, io);
    });

    socket.on('disconnect', function() {
        var rooms = io.sockets.manager.roomClients[socket.id];
        for (var room in rooms) {
            room_id = room.replace("/", "");
            socket.leave(room_id);
            response.code = 100000;
            response.data = {
                client_id: socket.id,
            };
            io.sockets.in(room_id).emit('disconnect', response);
        }
        console.log('disconnect');
    });
});




        