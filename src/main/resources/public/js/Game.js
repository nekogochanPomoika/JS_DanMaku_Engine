export {Game};

// some logic for show that engine works fine

class Game {
    world = new Game.World();

    update = () => {
        this.world.update();
    }
}

Game.World = class {
    backgroundColor = "#3333";

    height = 720;
    width = 360;

    player = new Game.Player();

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

    update = () => {
        this.player.update();
        this.collideObject(this.player);
    }
}

Game.Object = class {

    constructor(width, height, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

    get left() {return this.x}
    get right() {return this.x + this.width}
    get top() {return this.y}
    get bottom() {return this.y + this.height}

    set left(a) {this.x = a}
    set right(a) {this.x = a - this.width}
    set top(a) {this.y = a}
    set bottom(a) {this.y = a - this.height}

}

Game.Player = class extends Game.Object {

    color = "#0b0";

    constructor() {
        super(16, 16, 180, 600);
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

