var WebSocketServer = require('websocket').server;
var http = require('http');
//����websocket�˿�
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(3333, function() {
    console.log((new Date()) + ' Server is listening on port 3333');
});
//����websocket������
wsServer = new WebSocketServer({
    httpServer: server
});

//websocket��������
wsServer.on('request', function(request) {
    //ʹ��echo-protocol����
    var connection = request.accept('echo-protocol', request.origin);
    setInterval(function() {
        connection.sendUTF('������Ϣ' + (new Date()));
    }, 1000)
    console.log((new Date()) + ' connected');
    //����message�󷵻���Ϣ����
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    //������ǰ���ӵ�close�رմ���
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' �Ͽ�����');
    });
});