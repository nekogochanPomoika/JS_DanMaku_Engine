import {MovingObject} from "./MovingObject.js";

export {Bullet, PlayerBullet}

class Bullet extends MovingObject {

    static getBulletArray;
    /**
     * @param getArray = f() => [Bullet]
     */
    static setBulletArray = (getArray) => {Bullet.getBulletArray = getArray}

    append() {
        Bullet.getBulletArray().push(this);
    }

    copy() {
        return new Bullet()
            .setCenter(this.getCenter())
            .setMovingFunction(this.movingFunction)
            .setOnDie(this.onDie)
            .setAngle(this.angle)
            .setInColliderFoo(this.inColliderOf)
        ;
    }

}

class PlayerBullet extends MovingObject {

    // this class almost the same as the previous one,
    // except that it uses a different array and refers to the bullets of the "player"

    static getPlayerBulletArray;
    static setPlayerBulletArray = (getArray) => {
        PlayerBullet.getPlayerBulletArray = getArray;
    }

    damage;

    setDamage = (damage) => {this.damage = damage; return this;}

    color = "#b0b";

    append = () => {
        PlayerBullet.getPlayerBulletArray().push(this);
    }
}
