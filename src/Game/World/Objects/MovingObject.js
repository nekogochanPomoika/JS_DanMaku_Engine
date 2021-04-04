import {Util} from "../../../Util.js";
import {GameObject} from "./GameObject.js";

export {MovingObject}

class MovingObject extends GameObject {

    static isOutOfBounds;
    /**
     * @param defaultShouldDieCondition f(MovingObject) => boolean
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

        this.setX(this.getX() + dxy.x);
        this.setY(this.getY() + dxy.y);

        if (MovingObject.isOutOfBounds(this) && this.isAlive()) {
            this.setAlive(false);
        }
    }
}