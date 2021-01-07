export {Game};

// some logic for show that engine works fine
class Game {
    backgroundColor = "#3331";

    height = 720;
    width = 360;

    player = new Game.Player();

    collideObject = (obj) => {
        if (obj.x < 0) {
            obj.x = 0;
            obj.velocityX = 0;
        } else if (obj.x + obj.width > this.width) {
            obj.x = this.width - obj.width;
            obj.velocityX = 0;
        }

        if (obj.y < 0) {
            obj.y = 0;
            obj.velocityY = 0;
        } else if (obj.y + obj.height > this.height) {
            obj.y = this.height - obj.height;
            obj.velocityY = 0;
        }
    }

    update = () => {
        this.player.update();
        this.collideObject(this.player);
    }
}

Game.Player = class {

    color = "#0b0";

    height = 16;
    width = 16;

    x = 180;
    y = 600;

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

