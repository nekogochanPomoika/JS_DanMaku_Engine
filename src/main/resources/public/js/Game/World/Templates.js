import {Util} from "../../Util.js";
import {Bullet} from "./Objects/Bullet.js";
import {Mob} from "./Objects/Mob.js";
import {Loot, PowerUpLoot} from "./Objects/Loot.js";

export class BulletTemplates {

    static base(from, to, speed, radius) {
        return new Bullet()
            .setCenter(from)
            .setAngle(Util.calculateAngle(from, to))
            .setMovingFunction(() => speed)
            .setInColliderFoo(function (c) {
                return Util.isNearby(this.getCenter(), c.getCenter(), radius);
            });
    }

}

export class MobTemplates {

    /**
     * @returns {Mob}
     */
    static fish() {
        return new Mob()
            .setHP(10)
            .setOnDie(() => {})
        ;
    }

    /**
     * @param {number} probability
     * @returns {Mob}
     */
    static fishWithLoot(probability) {
        return MobTemplates.fish()
            .setOnDie(function () {
                if (probability > Math.random()) new PowerUpLoot().setCenter(this.getCenter());
            })
        ;
    }

}
