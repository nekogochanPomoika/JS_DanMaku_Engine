import {Game} from "./Game.js";
import {Mob, Player} from "./World/Objects.js";
import {World} from "./World/World.js";
import {Bullet} from "./World/Objects.js";
import {BulletTemplates} from "./World/Templates.js";

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
    let mob =
        new Mob()
            .setWidth(64)
            .setHeight(64)
            .setCenter({x: world.width - 50, y: world.height * 7 / 8})
            .setAngle(-Math.PI)
            .setMovingFunction(() => 12);

    mob.addIntervalAttack(() => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                if (mob.isAlive)
                    BulletTemplates
                        .littleFocusBullet(mob.center, player.center, 15)
                        .append();
            }, i * 75);
        }
    }, 500);

    mob.addTimeoutAttack(() => {
        BulletTemplates
            .roundLittleFocusBulletsArray(
                8, 50, mob.center, player.center
            )
            .forEach((b) => b.append());
    }, 1500)

    mob.append();
}

world.bulletRunTest();
