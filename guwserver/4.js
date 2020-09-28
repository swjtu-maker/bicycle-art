var WebSocketServer = require('websocket').server;
var http = require('http');
const websocket = require('websocket/lib/websocket');
var deviceName = null;
var deviceVersion = null;
var deviceState = null;
var deviceIPaddress = null; //这个变量我不是特别明白发过来的数据哪个是的
var deviceSensorspeed = null;
var lastConnectTimeMs = null;
var OFFLINE = 0;
var ONLINE = 1;
var Disconnected = 0;
var WaitforData = 1;
var SendResp = 2;
var CommunicationState = Disconnected; //建立网络连接之前，状态处于Disconnected
var Resp_OK = 0;
var Resp_Error = 1; //这个变量说的是不用的
var Connect_Req = 2;
var Sensor_Data = 3;
var SERVER = 0;
var CLIENT = 1; //这个变量好像是没用到的就先放在这了
//创建服务器
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

//websocket建立连接
wsServer.on('request', function(request) {
    //遵从echo-protocol协议
    var connection = request.accept('echo-protocol', request.origin);
    //建立网络连接后会执行以下内容
    CommunicationState = WaitforData; //建立网络连接以后连接状态转变为等待消息
    connection.on('message', function(message) { //message是一个JSON对象
        console.log(message.utf8Data);
        var communicationFrame = {};
        try {
          communicationFrame = JSON.parse(message.utf8Data);
        } catch (e) {
          console.log(e);
        }
        //var communicationFrame = JSON.stringify(message);
        // console.log(communicationFrame);
        if (communicationFrame.cmd == Connect_Req) {
            lastConnectTimeMs = new Date();
            console.log("收到消息的时间是：" + lastConnectTimeMs);
            connection.sendUTF("接收到消息的时间是" + new Date()); //输出收到消息的时间,这句可能会出现问题
            deviceName = communicationFrame.data[0];
            deviceVersion = communicationFrame.data[1];
            deviceState = ONLINE;
            CommunicationState = SendResp; //接受完消息状态转变为发送请求
            //返回resp_OK
            connection.sendUTF(("传回消息的时间是：" + new Date())); //发送传回消息的时间，这句可能会出现问题
            //定义要发送回下位机的消息内容
            var BackToClient = { "role": SERVER, "cmd": Resp_OK, "data_size": 1, "data": ["server"] };
            connection.send(JSON.stringify(BackToClient));
        }


        //如果请求发送消息
        if (communicationFrame.cmd == Sensor_Data) {
            console.log((new Date())); //输出收到消息的时间
            deviceSensorspeed = communicationFrame.data[1];
            CommunicationState = SendResp; //接受完消息状态转变为发送请求
            //返回resp_OK
            connection.sendUTF((new Date())); //发送传回消息的时间，这句可能会出现问题
            //定义要发送回下位机的消息内容
            var BackToClient = { "role": SERVER, "cmd": Resp_OK, "data_size": 1, "data": ["Server"] };
            connection.send(JSON.stringify(BackToClient));
        }
        /* setInterval(function(){
            var communicationFrame2 = {"data":[communicationFrame.data[0],communicationFrame.data[1]]};
            connection.send("设备名称和速度分别是："+JSON.stringify(communicationFrame2.data));
        },1000); */ //这段没用暂且注释掉，也可以拿去后期调试用
        console.log((new Date()) + ' connected');
    });
    //监听当前连接发送message时候
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            //connection.sendUTF(message.utf8Data);
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            //connection.sendBytes(message.binaryData);
        }
    });
    //发送完成关闭连接close
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + 'close');
    });
});
