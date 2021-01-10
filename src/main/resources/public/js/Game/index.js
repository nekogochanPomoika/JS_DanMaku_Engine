import {Game} from "./Game.js";
import {Player} from "./World/Objects.js";
import {World} from "./World/World.js";
import {Bullet} from "./World/Objects.js";

export {game};

const settings = {
    extraBounds: 100,
}

const game = new Game();
const world = new World();
const player = new Player();

staticFieldsInit();
init();

function staticFieldsInit() {
    Bullet.setIsOutOfBounds((b) =>
        b.right < 0 - settings.extraBounds ||
        b.bottom < 0 - settings.extraBounds ||
        b.left > world.width + settings.extraBounds ||
        b.top > world.height + settings.extraBounds
    )
}

function init() {
    player.setHeight(0)
        .setWidth(0)
        .setCenter({x: world.width / 2, y: world.height / 2});
    world.init(player);
    game.init(world);
}

world.bulletRunTest();
