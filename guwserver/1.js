var WebSocketServer = require('websocket').server;
var http = require('http');
//创建websocket端口
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(3333, function() {
    console.log((new Date()) + ' Server is listening on port 3333');
});
//创建websocket服务器
wsServer = new WebSocketServer({
    httpServer: server
});

//websocket建立链接
wsServer.on('request', function(request) {
    //使用echo-protocol编码
    var connection = request.accept('echo-protocol', request.origin);
    setInterval(function() {
        connection.sendUTF('发送信息' + (new Date()));
    }, 1000)
    console.log((new Date()) + ' connected');
    //发送message后返回信息内容
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    //监听当前链接当close关闭触发
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' 断开链接');
    });
});