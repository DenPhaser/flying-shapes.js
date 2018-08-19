var tau = Math.PI * 2;
var
    w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    colorCode = 'hsla(#hue, 80%, 50%, #alp)',

    opts = {
        count: 400,

        color: {
            hue: {
                min: 140,
                max: 220,
                disp: 40
            },

            saturation: {
                min: 80,
                max: 100,
            }
        },

        cycle: 15,

        minRadius: 5,
        maxRadius: 50,
    },

    timeStamp,
    shapes = [];



// =================================================================================================================
// Shape Class
// =================================================================================================================

function Shape() {
    this.verticlesCount = 3;

    this.reset();
}

Shape.prototype.reset = function() {
    this.x = - Math.random();
    this.y = Math.random();
    this.r = opts.minRadius + Math.random() * (opts.maxRadius - opts.minRadius);
    this.phase = Math.random() * tau;
    this.colorDisp = Math.random() * 2 - 1;
    // this.color = 'rgba(#red, #green, #blue, #alpha)'
    //     .replace('#red', 0)
    //     .replace('#green', 150 + Math.random() * 105)
    //     .replace('#blue', 200 + Math.random() * 55)
    //     .replace('#alpha', Math.random() / 2 + 0.5);
    this.speed = 1 + Math.random();
}

Shape.prototype.draw = function() {
    var x = this.x * w, y = this.y * h;
    var x1 = x + Math.cos(this.phase) * this.r,
        y1 = y + Math.sin(this.phase) * this.r,
        x2 = x + Math.cos(this.phase + 1 / 3 * tau) * this.r,
        y2 = y + Math.sin(this.phase + 1 / 3 * tau) * this.r,
        x3 = x + Math.cos(this.phase + 2 / 3 * tau) * this.r,
        y3 = y + Math.sin(this.phase + 2 / 3 * tau) * this.r;

    var path=new Path2D();
    path.moveTo(x1, y1);
    path.lineTo(x2, y2);
    path.lineTo(x3, y3);
    path.lineTo(x1, y1);

    var color = 'hsla(#hue, #saturation%, #lightness%, #alpha)'
        .replace('#hue', opts.color.hue.min + (opts.color.hue.max - opts.color.hue.min) * this.x + this.colorDisp * opts.color.hue.disp)
        .replace('#saturation', opts.color.saturation.max - (opts.color.saturation.max - opts.color.saturation.min) * this.r / opts.maxRadius)
        .replace('#lightness', 50)
        .replace('#alpha', 0.9);

    ctx.fillStyle = color;
    ctx.fill(path);
}

// =================================================================================================================
// Main methods
// =================================================================================================================

function initialize() {
    // create shapes
    for (var i = 0; i < opts.count; i++) {
        var shape = new Shape();

        shapes.push(shape);
    }
}

function draw() {
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        shape.draw();
    }
}

function update(rate) {
    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];

        shape.phase = (shape.phase + 0.1* rate * 1) % tau;
        shape.x += rate * shape.speed / opts.cycle;

        if (shape.x > 1.1) {
            shape.reset();
        }
    }
}

// =================================================================================================================
// Animation start
// =================================================================================================================

initialize();

timeStamp = Date.now();

var display = document.getElementById('c');
var ctx = display.getContext('2d');
ctx.globalCompositeOperation = 'overlay';
requestAnimationFrame(frame);


function frame() {
    requestAnimationFrame(frame);
    // setTimeout(function () {
    //     requestAnimationFrame(frame);
    // }, 1000 / 30);

    var newTimeStamp = Date.now();
    var rate = (newTimeStamp - timeStamp) / 1000;
    timeStamp = newTimeStamp;

    update(rate);
    draw();
}

window.addEventListener('resize', function () {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
    ctx.fillRect(0, 0, w, h);
});