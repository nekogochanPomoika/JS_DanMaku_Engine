import {MovingObject} from "./MovingObject.js";

export {Loot, PowerUpLoot}

class Loot extends MovingObject {

    // loot from Mob

    static getLootArray;
    static setLootArray = (foo) => {Loot.getLootArray = foo}

    static defaultMovingFunction;
    /**
     * @param foo = f(Loot) => set loot moving function
     */
    static setDefaultMovingFunction = (foo) => {Loot.defaultMovingFunction = foo}

    radius = 8;

    onTake;
    type;

    constructor() {
        super();
        Loot.defaultMovingFunction(this);
    }

    append = () => {
        Loot.getLootArray().push(this);
    }

}

class PowerUpLoot extends Loot {

    static defaultPowerUpFunction;
    /**
     * @param foo = f(PUloot) => set loot.onTake
     */
    static setDefaultPowerUpFunction = (foo) => {PowerUpLoot.defaultPowerUpFunction = foo}

    color = "#f00";

    value = 5;

    constructor() {
        super();
        this.type = 0;
        this.onTake = PowerUpLoot.defaultPowerUpFunction;
    }

    setValue = (value) => {this.value = value; return this;}

}
