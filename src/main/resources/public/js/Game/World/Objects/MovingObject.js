import {Util} from "../../../Util.js";
import {GameObject} from "./GameObject.js";

export {MovingObject}

class MovingObject extends GameObject {

    static isOutOfBounds;
    /**
     * @param defaultShouldDieCondition f(Bullet.class obj) => boolean
     */
    static setIsOutOfBounds = (defaultShouldDieCondition) => {
        MovingObject.isOutOfBounds = defaultShouldDieCondition;
    }

    movingFunction;

    angle;

    setAngle = (angle) => {this.angle = angle; return this;}

    setMovingFunction = (movingFunction) => {this.movingFunction = movingFunction; return this};

    inColliderOf(circle) {
        return false;
    }

    setInColliderFoo(foo) {
        this.inColliderOf = foo;
        return this;
    }

    update() {
        let dr = this.movingFunction();
        let dxy = Util.polarToRect(dr, this.angle);

        this.x += dxy.x;
        this.y += dxy.y;

        if (MovingObject.isOutOfBounds(this)) {
            this.die();
        }
    }
}