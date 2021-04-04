import {MovingObject} from "./MovingObject.js";
import {TextureTemplates} from "../Templates.js";

export {Loot, PowerUpLoot}

class Loot extends MovingObject {

    // loot from Mob

    z = 5;

    static getLootArray;
    static setLootArray = (foo) => {Loot.getLootArray = foo}

    static defaultMovingFunction;
    /**
     * @param foo = f(Loot) => set loot moving function
     */
    static setDefaultMovingFunction = (foo) => {Loot.defaultMovingFunction = foo}

    meshBoxSize = 45;

    onTake;
    type;

    constructor() {
        super();
        Loot.defaultMovingFunction(this);
    }

    append = () => {
        Loot.getLootArray().push(this);
        this.appendMesh();
    }

}

class PowerUpLoot extends Loot {

    static defaultPowerUpFunction;
    /**
     * @param foo = f(PUloot) => set loot.onTake
     */
    static setDefaultPowerUpFunction = (foo) => {PowerUpLoot.defaultPowerUpFunction = foo}

    color = "#f00";

    value = 15;

    constructor() {
        super();
        this.type = 0;
        this.onTake = () => {
            PowerUpLoot.defaultPowerUpFunction(this);
        }
        this.setMesh(TextureTemplates.powerUp);
    }

}
