import {Game} from "./Game.js";
import {Mob, Player} from "./World/Objects.js";
import {World} from "./World/World.js";
import {Bullet} from "./World/Objects.js";
import {BulletTemplates, MobTemplates} from "./World/Templates.js";

export {game};

const settings = {
    extraBounds: 100,
}

const game = new Game();
const world = new World();
const player = new Player();

staticFieldsInit();
init();
testMob();

function staticFieldsInit() {
    Bullet.setIsOutOfBounds((b) =>
        b.right < 0 - settings.extraBounds ||
        b.bottom < 0 - settings.extraBounds ||
        b.left > world.width + settings.extraBounds ||
        b.top > world.height + settings.extraBounds
    )
    Bullet.setBulletsArray(() => world.bullets);
    Mob.setMobsArray(() => world.mobs);
}

function init() {
    player
        .setHeight(64)
        .setWidth(64)
        .setCenter({x: world.width / 2, y: world.height / 4});

    world.init(player);
    game.init(world);
}

function testMob() {
    MobTemplates
        .harmlessMob(
            {x: 100, y: 1800},
            Math.PI * 3 / 2,
            () => 12
        ).append();

    MobTemplates
        .oneShootMob(
            {x: world.width - 200, y: 1600},
            Math.PI * 3 / 2,
            () => 12,
            player.center,
            20,
            1500,
        ).append();
}

world.bulletRunTest();
