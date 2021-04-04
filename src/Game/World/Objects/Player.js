import {GameObject} from "./GameObject.js";
import {PlayerBullet} from "./Bullet.js";
import {Util} from "../../../Util.js";
import {MovingObject} from "./MovingObject.js";
import {TextureTemplates} from "../Templates.js";
import * as THREE from "three";

export {Player, AttackSphere}

class Player extends GameObject {

    radius = 20;
    meshBoxSize = 100;
    z = 10;
    speed = 10;
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

    textures = TextureTemplates.hero;
    current = 0;
    textureIterTrigger = 8;
    currentIter = 0;

    constructor() {
        super();
        this.setMesh(this.textures[this.current]);
        this.appendMesh();
    }

    toStartPosition;

    setToStartPosition = (toStartPosition) => {this.toStartPosition = toStartPosition; return this;}

    setExtraGunMovingFunction = (foo) => {this.extraGun.movingFunction = foo; return this;}

    powerUp = (value) => {
        this.power += value;
        if (this.power > 500) this.power = 500;
        let spheresCount = Math.floor(this.power / 100);
        if (spheresCount !== this.extraGun.spheres.length) this.extraGun.remakeSpheres(spheresCount);

        console.log(this);

        return this;
    }

    startShooting = (delay) => {
        this.gunId = Util.addLoop(() => {
            if (this.isShooting && this.canShoot) this.shoot();
        }, delay);
        return this;
    }

    stopShooting = () => {
        Util.removeLoop(this.gunId);
    }

    shoot = () => {
        this.createBullet(-25);
        this.createBullet(25);
        this.extraGun.shoot();
    }

    createBullet = (dx) => {
        new PlayerBullet()
            .setRadius(25)
            .setMesh(TextureTemplates.redBall)
            .setAngle(Math.PI / 2)
            .setMovingFunction(() => 20)
            .setCenter({x: this.x + dx, y: this.y + 20})
            .setDamage(5)
            .append()
        ;
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
            this.movingY = up ? 1 : -1;
            this.diagonalMovement = this.movingX !== 0;
        }
    }

    setImmunity = (duration) => {
        this.isImmunity = true;
        Util.addPromise(() => {
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
        alert("проиграл, попробуй еще раз");
        location.reload();
    }

    update = () => {
        this.currentIter++;
        if (this.currentIter === this.textureIterTrigger) {
            this.current++;
            if (this.current === this.textures.length) this.current = 0;
            this.currentIter = 0;
            this.disposeMesh();
            this.setMesh(this.textures[this.current]);
            this.appendMesh();
        }
        let dx = this.speed * this.movingX;
        let dy = this.speed * this.movingY;

        if (this.diagonalMovement) {
            dx /= this.diagonalMovementCoef;
            dy /= this.diagonalMovementCoef;
        }

        this.setX(this.getX() + dx);
        this.setY(this.getY() + dy);

        this.extraGun.update(this.getCenter());
    }
}

class ExtraGun {

    spheres = [];
    distance = 150;
    x = 0;
    y = 0;

    remakeSpheres = (count) => {
        for (let s of this.spheres) s.disposeMesh();
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
            console.log(this.distance, angles[i], dxy);
            this.spheres[i] =
                new AttackSphere()
                    .setDX(dxy.x)
                    .setDY(dxy.y)
                    .setMesh(TextureTemplates.sphere)
                    .appendMesh()
            ;
        }
    }

    shoot = () => {
        this.spheres.forEach((s) => s.shoot());
    }

    update(target) {
        let dxy = Util.xyDistance(this, target);
        this.x -= dxy.x / 5;
        this.y -= dxy.y / 5;
        for (let s of this.spheres) s.update(this);
    }
}

class AttackSphere extends GameObject {

    z = 9;
    radius = 10;
    meshBoxSize = 25;

    static defaultShoot;
    static setDefaultShoot = (foo) => {AttackSphere.defaultShoot = foo}

    dx;
    dy;

    setDX = (dx) => {this.dx = dx; return this;}
    setDY = (dy) => {this.dy = dy; return this;}

    shoot = () => {
        new PlayerBullet()
            .setRadius(20)
            .setMesh(TextureTemplates.redBall)
            .setAngle(Math.PI / 2)
            .setMovingFunction(() => 15)
            .setCenter({x: this.x, y: this.y})
            .setDamage(1)
            .append()
    }

    update(target) {
        this.setX(target.x + this.dx);
        this.setY(target.y + this.dy);
    }

}
