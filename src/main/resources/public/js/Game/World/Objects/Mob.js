import {MovingObject} from "./MovingObject.js";

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
    /**
     * @param type = [0 = interval, 1 = timeout]
     * @param foo = [f() => interval / timeout ids]
     */
    #addAttack = (type, foo) => {
        this.#attacks.push({type, foo});
        return this;
    }

    addIntervalAttack = (foo, delay) => {
        let _foo = () => setInterval(foo, delay)
        this.#addAttack(0, _foo);
        return this;
    }

    addTimeoutAttack = (foo, delay) => {
        let _foo = () => setTimeout(foo, delay);
        this.#addAttack(1, _foo);
        return this;
    }

    // starts attack functions, set in array attacks intervals ids
    startAttacks = () => {
        this.#attacks = this.#attacks.map((a) => {return {type: a.type, id: a.foo()}});
    }


    makeDamage = (value) => {
        this.#hitPoints -= value;
        if (this.#hitPoints <= 0) this.die();
        return this;
    }

    die = () => {
        console.log("mod die");
        this.setAlive(false);
        this.#attacks.forEach((a) => {
            if (a.type === 0) window.clearInterval(a.id);
            else if (a.type === 1) window.clearTimeout(a.id);
        })
        this.#onDie.forEach((f) => f());
    }

    append = () => {
        Mob.getMobsArray().push(this);
        this.startAttacks();
    }
}
