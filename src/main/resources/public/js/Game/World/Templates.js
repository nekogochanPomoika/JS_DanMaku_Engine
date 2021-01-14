import {Util} from "../../Util.js";
import {Bullet} from "./Objects/Bullet.js";
import {Mob} from "./Objects/Mob.js";

export {BulletTemplates, MobTemplates}

class BulletTemplates {

    static littleFocusBullet = (start, end, speed) => {
        return new Bullet()
            .setRadius(16)
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
                    .setRadius(16)
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
            .setRadius(64)
            .setCenter(start)
            .setAngle(angle)
            .setMovingFunction(movingFunction)
    }

}