import {Bullet, Mob} from "./Objects.js";
import {Util} from "../../Util.js";

export {BulletTemplates, MobTemplates}

class BulletTemplates {

    static littleFocusBullet = (start, end, speed) => {
        return new Bullet()
            .setColor("#b00")
            .setWidth(16)
            .setHeight(16)
            .setCenter(start)
            .setAngle(Util.calculateAngle(start, end))
            .setMovingFunction(() => speed);
    }

    static roundLittleFocusBulletsArray = (speed, count, start, end) => {
        return BulletTemplates.roundLittleBulletsArray(speed, count, start, Util.calculateAngle(start, end));
    }

    static roundLittleBulletsArray = (speed, count, start, da) => {
        if (da === undefined) da = 0;
        let arr = [];
        for (let i = 0; i < count; i++) {
            arr.push(
                new Bullet()
                    .setColor("#b00")
                    .setWidth(16)
                    .setHeight(16)
                    .setCenter(start)
                    .setAngle(Math.PI * 2 * i / count + da)
                    .setMovingFunction(() => speed)
            );
        }
        return arr;
    }

}

class MobTemplates {

    static harmlessMob = (start, angle, movingFunction) => {
        return new Mob()
            .setWidth(64)
            .setHeight(64)
            .setCenter(start)
            .setAngle(angle)
            .setMovingFunction(movingFunction)
    }

    static oneShootMob = (start, angle, movingFunction, target, bulletSpeed, attackDelay) => {
        let mob = MobTemplates.harmlessMob(start, angle, movingFunction);
        return mob
            .addTimeoutAttack(() => {
                if (mob.isAlive) {
                    BulletTemplates
                        .littleFocusBullet(mob.center, target, bulletSpeed)
                        .append();
                }
            }, attackDelay);
    }

}