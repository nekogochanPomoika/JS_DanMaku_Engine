import {GameObject} from "./GameObject.js";
import {PlayerBullet} from "./Bullet.js";

export {Player, AttackSphere}

class Player extends GameObject {
    color = "#0b0";

    baseVelocity = 18;
    movingX = 0;
    movingY = 0;
    diagonalMovement = false;
    diagonalMovementCoef = Math.sqrt(2);

    isImmunity = false;

    canShoot = true;
    isShooting = false;
    gunId;
    power = 0;
    spheres = [];

    lives = 3;

    toStartPosition;

    setToStartPosition = (toStartPosition) => {this.toStartPosition = toStartPosition; return this;}

    powerUp = (value) => {
        this.power += value;
        if (this.power > 500) this.power = 500;
        let spheresCount = Math.floor(this.power / 100);
        if (spheresCount !== this.spheres.length) this.changeSpheresCount(spheresCount);
        return this;
    }

    changeSpheresCount = (count) => {
        switch (count) {
            case 1:
                this.spheres = [
                    new AttackSphere().setDY(-150)
                ];
                break;
            case 2:
                this.spheres = [
                    new AttackSphere().setDY(-100).setDX(-100),
                    new AttackSphere().setDY(-100).setDX(100)
                ];
                break;
            case 3:
                this.spheres = [
                    new AttackSphere().setDY(-150),
                    new AttackSphere().setDY(-100).setDX(-120),
                    new AttackSphere().setDY(-100).setDX(120)
                ];
                break;
            case 4:
                this.spheres = [
                    new AttackSphere().setDY(-100).setDX(-100),
                    new AttackSphere().setDY(-100).setDX(100),
                    new AttackSphere().setDX(-200),
                    new AttackSphere().setDX(200)
                ];
                break;
            case 5:
                this.spheres = [
                    new AttackSphere().setDY(-150),
                    new AttackSphere().setDY(-100).setDX(-120),
                    new AttackSphere().setDY(-100).setDX(120),
                    new AttackSphere().setDX(-220),
                    new AttackSphere().setDX(220)
                ];
                break;
        }
    }

    startShooting = (delay) => {
        this.gunId = setInterval(() => {
            if (this.isShooting && this.canShoot) this.shoot();
        }, delay);
        return this;
    }

    stopShooting = () => {
        clearInterval(this.gunId);
    }

    shoot = () => {
        this.createBullet(-25);
        this.createBullet(25);
        this.spheres.forEach((s) => s.shoot());
    }

    createBullet = (dx) => {
        new PlayerBullet()
            .setAngle(-Math.PI / 2)
            .setMovingFunction(() => 40)
            .setRadius(15)
            .setCenter({x: this.x + dx, y: this.y - 20})
            .setDamage(1)
            .append();
    }

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

    setImmunity = (duration) => {
        this.isImmunity = true;
        setTimeout(() => {
            this.isImmunity = false;
        }, duration);
    }

    makeDamage = () => {
        if (this.isImmunity) return;

        this.lives--;
        if (this.lives === 0) {
            this.die();
        } else {
            this.toStartPosition();
        }
    }

    die = () => {
        console.log("player die");
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

class AttackSphere extends GameObject {

    static defaultShoot;
    static setDefaultShoot = (foo) => {AttackSphere.defaultShoot = foo}

    static fromDXYArr = (dxyArr) => {
        let res = [];
        dxyArr.forEach((dxy) => {
            res.push(new AttackSphere().setDX(dxy.dx).setDY(dxy.dy));
        })
        return res;
    }

    color = "#4b0";

    radius = 25;

    dx = 0;
    dy = 0;

    setDX = (dx) => {this.dx = dx; return this;}
    setDY = (dy) => {this.dy = dy; return this;}

    shoot = () => {AttackSphere.defaultShoot(this); return this;}

}
