import {Game} from "./Game.js";
import {Mob, Player, Bullet, PlayerBullet} from "./World/Objects.js";
import {World} from "./World/World.js";
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
    Mob.setMobsArray(() => world.mobs);
    Bullet.setBulletArray(() => world.bullets);
    PlayerBullet.setPlayerBulletArray(() => world.playerBullets);
}

function init() {
    player
        .setRadius(32)
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
            player.setImmunity(4500);
            player.canShoot = false;

            setTimeout(() => {
                player.movingY = 0;
                player.moveX = _moveX;
                player.moveY = _moveY;
                player.baseVelocity = _baseVelocity;
                world.collideObject = _collideObject;
                player.canShoot = true;
            }, 1500);
        })
        .startShooting(50)
        .toStartPosition()

    world.init(player);
    game.init(world);
}

function testMob() {
    new Mob()
        .setRadius(128)
        .setX(750)
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
