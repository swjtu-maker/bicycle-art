let canvas = document.getElementById('mycanvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 创建绘制上下文
let ctx = canvas.getContext('2d');

let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('resize', function(event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

let maxRadius = 20;

let colorArray = [
    '#4CBF88',
    '#F2B134',
    '#6F4A70',
    '#FF6275',
    '#00B5C4'
]

function Ball(x, y, dx, dy, radius, color, spd) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.spd = spd;
    this.radius = radius;
    this.minRadius = radius;
    this.color = color;

    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    this.update = function() {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
        this.radius += 1;

        // 鼠标交互
       // if (mouse.x - this.x < 50 && mouse.x - this.x > -50 &&
         //   mouse.y - this.y < 50 && mouse.y - this.y > -50) {
           // if (this.radius < maxRadius) {
            //    this.radius += 1;
            //}
        //} else if (this.radius > this.minRadius) {
          //  this.radius -= 1;
        //}

        this.draw();
    }
}

let ballArray;

function init() {
    ballArray = [];
    for (let i = 0; i < 400; i++) {
        let radius = Math.random() * 4 + 1;
        let x = Math.random() * (canvas.width - 2 * radius) + radius;
        let y = Math.random() * (canvas.height - 2 * radius) + radius;
        let dx = (Math.random() - 0.5) * 2;
        let dy = (Math.random() - 0.5) * 2;
        let color = colorArray[Math.floor(Math.random() * 5)];

        ballArray.push(new Ball(x, y, dx, dy, radius, color));
    }
}

// 动画
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let b of ballArray) {
        b.update();
    }
}

init();
animate();
var ws = new WebSocket('ws://localhost:3333',"echo-protocol");
//这里的echo-protocol建立连接的方式与js文件中的建立连接的方式相同并且不可以省略不写
//对连接进行监听
ws.onopen = function(res) {
        console.log('success!');
        console.log(res);
    }
    //监听发送message
ws.onmessage = function(res) {
    if (this.radius < maxRadius) {
            this.radius += 1;
        }
    console.log('发送成功！');
    console.log(res);
}
