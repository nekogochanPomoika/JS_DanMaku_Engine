import {GameObject} from "./GameObject.js";
import {PlayerBullet} from "./Bullet.js";
import {Util} from "../../../Util.js";
import {MovingObject} from "./MovingObject.js";

export {Player, AttackSphere}

class Player extends GameObject {

    color = "#0b0";

    baseVelocity = 15;
    movingX = 0;
    movingY = 0;
    diagonalMovement = false;
    diagonalMovementCoef = Math.sqrt(2);

    isImmunity = false;

    canShoot = true;
    isShooting = false;
    gunId;
    power = 0;
    extraGun = new ExtraGun();

    lives = 3;

    toStartPosition;

    setToStartPosition = (toStartPosition) => {this.toStartPosition = toStartPosition; return this;}

    setExtraGunMovingFunction = (foo) => {this.extraGun.movingFunction = foo; return this;}

    powerUp = (value) => {
        this.power += value;
        if (this.power > 500) this.power = 500;
        let spheresCount = Math.floor(this.power / 100);
        if (spheresCount !== this.extraGun.spheres.length) this.extraGun.remakeSpheres(spheresCount);
        return this;
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
        this.extraGun.shoot();
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

        this.extraGun.update();
    }
}

class ExtraGun extends MovingObject {

    spheres = [];
    distance = 150;

    remakeSpheres = (count) => {
        let angles = [];
        let PI = Math.PI
        switch (count) {
            case 1:
                angles = [0];
                break;
            case 2:
                angles = [PI/4, -PI/4];
                break;
            case 3:
                angles = [0, PI/3, -PI/3];
                break;
            case 4:
                angles = [PI/6, -PI/6, PI/2, -PI/2]
                break;
            case 5:
                angles = [0, PI/4, -PI/4, PI/2, -PI/2];
                break;
        }
        angles = angles.map((a) => a - PI/2);
        this.spheres = [];

        for (let i = 0; i < count; i++) {
            let dxy = Util.polarToRect(this.distance, angles[i]);
            this.spheres[i] = new AttackSphere().setDX(dxy.x).setDY(dxy.y);
        }
    }

    shoot = () => {
        this.spheres.forEach((s) => s.shoot());
    }

    asCirclesArray = () => {
        let res = [];
        this.spheres.forEach((s) => {
            res.push({
                x: this.x + s.dx,
                y: this.y + s.dy,
                radius: s.radius,
                color: "#0bb"
            });
        })
        return res;
    }

}

class AttackSphere extends GameObject {

    static defaultShoot;
    static setDefaultShoot = (foo) => {AttackSphere.defaultShoot = foo}

    color = "#4b0";
    radius = 25;

    dx;
    dy;

    setDX = (dx) => {this.dx = dx; return this;}
    setDY = (dy) => {this.dy = dy; return this;}

    shoot = () => {AttackSphere.defaultShoot(this); return this;}

}
