// some logic for show that engine works fine
export {Game};

import {Util} from "../Util.js";

class Game {
    world = new Game.World();

    update = (time) => {
        this.world.update(time);
    }
}

Game.World = class {

    time = 0;
    backgroundColor = "#3331";

    width = 2000;
    height = 2000;

    player = new Game.Player();

    bullets = [];

    constructor() {

        this.player.setCenter({
            x: this.width / 2,
            y: this.height / 2,
        });

        let startPosition = {x: this.width / 2, y: this.height / 2};

        for (let i = 0; i < 1000; i++) {
            let startTime = this.time;
            this.bullets.push(
                new Game.Bullet()
                    .setWidth(16)
                    .setHeight(16)
                    .setCenter(startPosition)
                    .setColor("#b00")
                    .setMovingFunction(() => {
                        let dt = this.time - startTime;
                        if (dt > 4000) dt = i;
                        let dr = dt / 100;
                        let da = Math.pow(i + dt / 5000, 1.4);
                        return Util.polarToRect(dr, da);
                    })
            );
            setTimeout(() => {
            }, Math.pow(i * 100, 0.7));
        }
    }

    collideObject = (obj) => {
        if (obj.left < 0) {
            obj.setLeft(0);
            obj.velocityX = 0;
        } else if (obj.right > this.width) {
            obj.setRight(this.width);
            obj.velocityX = 0;
        }

        if (obj.top < 0) {
            obj.setTop(0);
            obj.velocityY = 0;
        } else if (obj.bottom > this.height) {
            obj.setBottom(this.height);
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

    setLeft(a) {this.x = a; return this;}
    setRight(a) {this.x = a - this.width; return this;}
    setTop(a) {this.y = a; return this;}
    setBottom(a) {this.y = a - this.height; return this;}
    setCenter(xy) {
        console.log(xy);
        this.x = xy.x - this.width / 2;
        this.y = xy.y - this.height / 2;
        return this;
    }

    get left() {return this.x}
    get right() {return this.x + this.width}
    get top() {return this.y}
    get bottom() {return this.y + this.height}
    get center() {return {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
    }}
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

    constructor() {
        super();
        this.setWidth(64)
            .setHeight(64)
    }

    baseVelocity = 30;
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
