import {MovingObject} from "./MovingObject.js";
import {Util} from "../../../Util.js";

export {Mob}

class Mob extends MovingObject {

    static getMobsArray;
    /**
     * @param mobsArray = f() => [mobsArray]
     */
    static setMobsArray = (mobsArray) => {Mob.getMobsArray = mobsArray}

    color = "#bb0";

    #hitPoints = 1;

    #attacks = [];

    #onDie = [];

    setHP = (hp) => {this.#hitPoints = hp; return this;}
    addOnDie = (onDie) => {this.#onDie.push(onDie); return this;}

    addPromiseAttack = (foo, delay) => {
        this.#attacks.push({
            loop: false,
            foo: () => {
                Util.addPromiseAttack(() => {
                    if (this.isAlive) foo();
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

    die = () => {
        console.log("mod die");
        this.setAlive(false);
        this.#attacks.forEach((id) => Util.removeLoop(id));
        this.#onDie.forEach((f) => f());
    }

    append = () => {
        Mob.getMobsArray().push(this);
        this.startAttacks();
    }
}
