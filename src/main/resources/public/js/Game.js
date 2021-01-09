// some logic for show that engine works fine
export {Game};

import {Util} from "./Util.js";

class Game {
    world = new Game.World();

    update = (time) => {
        this.world.update(time);
    }
}

Game.World = class {

    time = 0;
    backgroundColor = "#3331";

    height = 2000;
    width = 2000;

    player = new Game.Player();

    bullets = [];

    constructor() {
        let startPosition = {x: this.width / 2, y: this.height / 2};

        for (let i = 0; i < 1000; i++) {
            let startTime = this.time;
            setTimeout(() => {
                this.bullets.push(
                    new Game.Bullet()
                        .setX(startPosition.x)
                        .setY(startPosition.y)
                        .setWidth(16)
                        .setHeight(16)
                        .setColor("#b00")
                        .setMovingFunction(() => {
                            let dt = this.time - startTime;
                            if (dt > 4000) dt = i;
                            let dr = dt / 100;
                            let da = Math.pow(i + dt / 5000, 1.4);
                            return Util.polarToRect(dr, da);
                        })
                );
            }, Math.pow(i * 100, 0.7));
        }
    }

    collideObject = (obj) => {
        if (obj.left < 0) {
            obj.left = 0;
            obj.velocityX = 0;
        } else if (obj.right > this.width) {
            obj.right = this.width;
            obj.velocityX = 0;
        }

        if (obj.top < 0) {
            obj.top = 0;
            obj.velocityY = 0;
        } else if (obj.bottom > this.height) {
            obj.bottom = this.height;
            obj.velocityY = 0;
        }
    }

    update = (time) => {
        this.time = time;

        this.player.update();
        this.bullets.forEach((b) => {b.update()});
        this.collideObject(this.player);
    }
}

Game.Object = class {

    width;
    height;
    x;
    y;

    setWidth = (width) => {this.width = width; return this;}
    setHeight = (height) => {this.height = height; return this;}
    setX = (x) => {this.x = x; return this;}
    setY = (y) => {this.y = y; return this;}

    get left() {return this.x}
    get right() {return this.x + this.width}
    get top() {return this.y}
    get bottom() {return this.y + this.height}

    set left(a) {this.x = a}
    set right(a) {this.x = a - this.width}
    set top(a) {this.y = a}
    set bottom(a) {this.y = a - this.height}

}

Game.MovingObject = class extends Game.Object {

    movingFunction;

    setMovingFunction = (movingFunction) => {this.movingFunction = movingFunction; return this};

    update() {
        let dxy = this.movingFunction();

        this.x += dxy.x;
        this.y += dxy.y;
    }

}

Game.Bullet = class extends Game.MovingObject {

    color;

    setColor = (color) => {this.color = color; return this}

}

Game.Player = class extends Game.Object {

    color = "#0b0";

    constructor(x, y) {
        super();
        this.setWidth(64)
            .setHeight(64)
            .setX(x)
            .setY(y);
    }

    baseVelocity = 10;
    movingX = 0;
    movingY = 0;
    diagonalMovement = false;
    diagonalMovementCoef = Math.sqrt(2);

    moveX = (left, right) => {
        if (left === right) {
            this.movingX = 0;
            this.diagonalMovement = false;
        } else {
            this.movingX = left ? -1 : 1;
            this.diagonalMovement = this.movingY !== 0;
        }
    }

    moveY = (up, down) => {
        if (up === down) {
            this.movingY = 0;
            this.diagonalMovement = false;
        } else {
            this.movingY = up ? -1 : 1;
            this.diagonalMovement = this.movingX !== 0;
        }
    }

    update = () => {
        let dx = this.baseVelocity * this.movingX;
        let dy = this.baseVelocity * this.movingY;

        if (this.diagonalMovement) {
            dx /= this.diagonalMovementCoef;
            dy /= this.diagonalMovementCoef;
        }

        this.x += dx;
        this.y += dy;
    }

}
