import {MovingObject} from "./MovingObject.js";
import {Util} from "../../../Util.js";

export {Bullet, PlayerBullet}

class Bullet extends MovingObject {

    z = 4;
    radius = 0;

    static getBulletArray;
    /**
     * @param getArray = f() => [Bullet]
     */
    static setBulletArray = (getArray) => {Bullet.getBulletArray = getArray}

    append() {
        this.appendMesh();
        Bullet.getBulletArray().push(this);
    }

}

class PlayerBullet extends MovingObject {

    // this class almost the same as the previous one,
    // except that it uses a different array and refers to the bullets of the "player"

    z = 4;
    radius = 0;

    static getPlayerBulletArray;
    static setPlayerBulletArray = (getArray) => {
        PlayerBullet.getPlayerBulletArray = getArray;
    }

    damage;

    setDamage = (damage) => {this.damage = damage; return this;}

    inColliderOf(circle) {
        return Util.isNearby(this, circle, circle.radius + 40);
    }

    append = () => {
        this.appendMesh();
        PlayerBullet.getPlayerBulletArray().push(this);
    }
}
