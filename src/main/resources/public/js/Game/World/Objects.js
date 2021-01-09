export {Bullet, Player};

class GameObject {
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

class MovingObject extends GameObject {
    movingFunction;

    setMovingFunction = (movingFunction) => {this.movingFunction = movingFunction; return this};

    update() {
        let dxy = this.movingFunction();

        this.x += dxy.x;
        this.y += dxy.y;
    }
}

class Bullet extends MovingObject {
    color;

    setColor = (color) => {this.color = color; return this}
}

class Player extends GameObject {
    color = "#0b0";

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
