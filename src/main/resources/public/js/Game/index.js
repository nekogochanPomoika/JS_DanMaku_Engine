import {Game} from "./Game.js";
import {Player} from "./World/Objects.js";
import {World} from "./World/World.js";

export {game};

const game = new Game();
const world = new World();
const player = new Player();

player.setHeight(64)
    .setWidth(64)
    .setCenter({x: world.width / 2, y: world.height / 2});

world.init(player);
game.init(world);

world.bulletRunTest();
