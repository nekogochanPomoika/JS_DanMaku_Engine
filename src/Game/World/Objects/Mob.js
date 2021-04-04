import {MovingObject} from "./MovingObject.js";
import {Util} from "../../../Util.js";

export {Mob}

class Mob extends MovingObject {

    z = 3;

    static getMobsArray;
    /**
     * @param mobsArray = f() => [mobsArray]
     */
    static setMobsArray = (mobsArray) => {
        Mob.getMobsArray = mobsArray
    }

    color = "#bb0";

    #hitPoints = 1;
    #attacks = [];

    radius = 0;

    setHP = (hp) => {
        this.#hitPoints = hp;
        return this;
    }

    getHP() {
        return this.#hitPoints;
    }

    addPromiseAttack = (foo, delay) => {
        this.#attacks.push({
            loop: false,
            foo: () => {
                Util.addPromise(() => {
                    if (this.isAlive()) foo();
                }, delay);
            }
        });
        return this;
    }

    addLoopAttack = (foo, delay) => {
        this.#attacks.push({
            loop: true,
            foo: () => (Util.addLoop(foo, delay))
        });
        return this;
    }

    // starts attack functions, set in array attacks intervals ids
    startAttacks = () => {
        let _attacks = [];
        this.#attacks.forEach((attack) => {
            if (attack.loop) {
                let id = attack.foo();
                _attacks.push(id);
            } else {
                attack.foo();
            }
        });
        this.#attacks = _attacks;
    }

    makeDamage = (value) => {
        this.#hitPoints -= value;
        if (this.#hitPoints <= 0) this.die();
        return this;
    }

    die() {
        super.die();
        this.#attacks.forEach((id) => Util.removeLoop(id));
    }

    stopAttacks() {
        this.#attacks.forEach((id) => Util.removeLoop(id));
        return this;
    }

    append = () => {
        this.appendMesh();
        Mob.getMobsArray().push(this);
        this.startAttacks();
    }
}
