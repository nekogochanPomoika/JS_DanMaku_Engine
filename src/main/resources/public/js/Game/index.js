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
        .setCenter({x: world.width / 2, y: world.height * 7/8})
        .setToStartPosition(() => {
            let _moveX = player.moveX;
            let _moveY = player.moveY;
            let _baseVelocity = player.baseVelocity;
            let _collideObject = world.collideObject;

            player.baseVelocity = 6;
            player.moveX = () => {};
            player.moveY = () => {};
            world.collideObject = () => {};

            player.setCenter({
                x: world.width / 2,
                y: world.height + 60 * player.baseVelocity - 100
            })
            player.movingX = 0;
            player.movingY = -1;
            player.setImmunity(5000);

            setTimeout(() => {
                player.movingY = 0;
                player.moveX = _moveX;
                player.moveY = _moveY;
                player.baseVelocity = _baseVelocity;
                world.collideObject = _collideObject;
            }, 1500);
        }).toStartPosition();

    world.init(player);
    game.init(world);
}

function testMob() {
    new Mob()
        .setWidth(128)
        .setHeight(128)
        .setX(1000)
        .setY(1000)
        .setAngle(0)
        .setMovingFunction(() => 0)
        .addIntervalAttack(() => {
            BulletTemplates
                .littleFocusBullet(
                    {x: 0, y: 0},
                    player.center,
                    12
                ).append();
        }, 450)
        .append();
}

world.bulletRunTest();
