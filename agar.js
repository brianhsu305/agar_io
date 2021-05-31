let c = document.getElementById("maincanvas");
let ctx = c.getContext("2d");

let foods = [];
let blobs = [];
let foodCount = 100;
let keys = {
    32: false,
    37: false, 
    38: false, 
    39: false, 
    40: false
};
let score = 0;
let growth = 1;
let accel = 0.1;
let maxspeed = 2;
let ax = 0;
let ay = 0;
let mousex = 0;
let mousey = 0;

document.addEventListener("keydown", move);
document.addEventListener("keyup", liftKey);
document.addEventListener("mousemove", mousetrack);




class Blob {
    constructor(radius, x, y) {
        this.x = x || c.width/2 ;
        this.y = y || c.height/2;
        this.r = radius || 30;
        this.dx = 0;
        this.dy = 0;
    }
    draw = function() {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.stroke();
    }

    update = function() {
        if (this.x > c.width   || this.x  < 0) {
            this.dx = 0;
        }
        if (this.y > c.height  || this.y  < 0) {
            this.dy = 0;
        }
        if (Math.abs(this.dx) < maxspeed || this.dx * ax <= 0){
            this.dx += ax;
        }
        if (Math.abs(this.dy) < maxspeed || this.dy * ay <= 0){
            this.dy += ay;
        }
        this.x += this.dx;
        this.y += this.dy;
    }

    showName = function() {
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Blob", this.x, this.y); 
    }

    eat = function() {
        for (let i=0; i<foods.length; i++){
            let dist = (foods[i].x - this.x) * (foods[i].x - this.x) + (foods[i].y - this.y) * (foods[i].y - this.y);
            let tempR = this.r * this.r;
            if (dist < tempR){
                this.r += growth;
                score += 1;
                foods.splice(i, 1);
                foods.push(new Food());
            }
        }
    }

    split = function() {
        if (this.r / 2 > 30){
            this.r *= 0.5;
            let newBlob = new Blob(this.r, this.x, this.y);
            newBlob.dx = this.dx * 2;
            newBlob.dy = this.dy * 2;
            blobs.push(newBlob);
        }
    }
}

class Food {
    constructor() {
        this.x = Math.random() * c.width;
        this.y = Math.random() * c.height;
        this.r = 10;
        this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }
    draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.fill();
    }
}


init();
main();


function init() {
    blobs.push(new Blob());
    for (let i=0; i<foodCount; i++){
        foods.push(new Food());
        console.log(foods[i].color);
    }
}

function main() {
    setTimeout(function onTick() {
        setup();
        for (let i=0; i<foods.length; i++){
            foods[i].draw();
        }
        for (let i=0; i<blobs.length; i++){
            blobs[i].update();
            blobs[i].draw();
            blobs[i].showName();
            blobs[i].eat();
        }
        displayScore();
        main();
    }, 10);
}

function setup() {
    ctx.fillStyle = "rgb(51, 51, 51)";
    ctx.fillRect(0, 0, c.width, c.height);
}

function displayScore() {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial"
    ctx.textAlign = "right";
    ctx.fillText("Score: " + score, c.width - 10, 50); 
}

function liftKey(event) {
    if (event.keyCode in keys) {
        keys[event.keyCode] = false;
        ax = 0;
        ay = 0;
    }
}

function move(event) {
    if (event.keyCode in keys){
        keys[event.keyCode] = true;
        if (keys[37] && !keys[39]){
            ax = -accel;
        }
        if (keys[38] && !keys[40]){
            ay = -accel;
        }
        if (keys[39] && !keys[37]){
            ax = accel;
        }
        if (keys[40] && !keys[38]){
            ay = accel;
        }
        if (keys[32]){
            for (let i=blobs.length-1; i >= 0; i--){
                blobs[i].split();
            }
        }
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function mousetrack(e) {
    mousex = e.offsetX;
    mousey = e.offsetY;
}