import {Game} from "./Game.js";
import {World} from "./World/World.js";
import {BulletTemplates, MobTemplates} from "./World/Templates.js";
import {Mob} from "./World/Objects/Mob.js";
import {Player, AttackSphere} from "./World/Objects/Player.js";
import {Bullet, PlayerBullet} from "./World/Objects/Bullet.js";
import {Loot, PowerUpLoot} from "./World/Objects/Loot.js";
import {Util} from "../Util.js";

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
    Loot.setLootArray(() => world.loots);

    Loot.setDefaultMovingFunction((loot) => {
        let createTime = world.time;
        loot.setMovingFunction(() => {
            let dt = 1500 + createTime - world.time;
            return dt / 333;
        }).setAngle(-Math.PI / 2);
    });

    PowerUpLoot.setDefaultPowerUpFunction((powerUpLoot) => {
        player.powerUp(powerUpLoot.value);
    })

    AttackSphere.setDefaultShoot((sphere) => {
        new PlayerBullet()
            .setAngle(-Math.PI / 2)
            .setCenter({
                x: player.extraGun.x + sphere.dx,
                y: player.extraGun.y + sphere.dy
            })
            .setMovingFunction(() => 40)
            .setRadius(15)
            .setDamage(1)
            .append();
    })

}

function init() {
    player
        .setRadius(10)
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
            player.extraGun.setCenter(player.center);
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
        .setExtraGunMovingFunction(() => {
            let ra = Util.rectToPolar(Util.getXYDistance(player.extraGun, player));
            player.extraGun.angle = ra.a;
            return ra.r / 5;
        })
        .startShooting(50)
        .toStartPosition()

    world.init(player);
    game.init(world);
}

function testMob() {

    let xy = {x: world.width / 2, y: world.height / 5}

    let addMob = (dx) => {
        let _xy = {x: xy.x + dx, y: xy.y};
        new Mob()
            .setRadius(50)
            .setCenter(_xy)
            .setHP(5)
            .setAngle(0)
            .setMovingFunction(() => 0)
            .addIntervalAttack(() => {
                BulletTemplates
                    .littleFocusBullet(
                        _xy,
                        player.center,
                        12
                    ).append();
            }, 450)
            .addOnDie(() => {
                new PowerUpLoot()
                    .setCenter(_xy)
                    .setValue(100)
                    .append();
            }).append();
    }

    for (let i = -400; i <= 400; i+=100) {
        setTimeout(addMob, i, i);
    }
}
