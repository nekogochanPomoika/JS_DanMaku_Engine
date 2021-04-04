import {Game} from "./Game.js";
import {World} from "./World/World.js";
import {BulletTemplates, MobTemplates, TextureTemplates} from "./World/Templates.js";
import {Mob} from "./World/Objects/Mob.js";
import {Player} from "./World/Objects/Player.js";
import {Bullet, PlayerBullet} from "./World/Objects/Bullet.js";
import {Loot, PowerUpLoot} from "./World/Objects/Loot.js";
import {Util} from "../Util.js";
import {MovingObject} from "./World/Objects/MovingObject";

export {game};

const settings = {
    extraBounds: 100,
}

const game = new Game();
const world = new World();
const player = new Player();

staticFieldsInit();
init();
initLevel();

function staticFieldsInit() {

    MovingObject.setIsOutOfBounds((b) =>
        b.getRight() < 0 - settings.extraBounds ||
        b.getBottom() < 0 - settings.extraBounds ||
        b.getLeft() > world.width + settings.extraBounds ||
        b.getTop() > world.height + settings.extraBounds
    );

    Mob.setMobsArray(() => world.mobs);
    Bullet.setBulletArray(() => world.bullets);
    PlayerBullet.setPlayerBulletArray(() => world.playerBullets);
    Loot.setLootArray(() => world.loots);

    Loot.setDefaultMovingFunction((loot) => {
        let createTime = world.frames;
        loot.setMovingFunction(() => {
            let dt = 40 + createTime - world.frames;
            return dt / 25;
        }).setAngle(Math.PI / 2);
    });

    PowerUpLoot.setDefaultPowerUpFunction((powerUpLoot) => {
        player.powerUp(powerUpLoot.value);
        powerUpLoot.disposeMesh();
    });

    Util.addLoop = world.addLoop;
    Util.removeLoop = world.removeLoop;
    Util.addPromise = world.addPromise;
    Util.getCurrentTime = () => world.frames;
}

function init() {

    player
        .setToStartPosition(() => {

            let _speed = player.speed;
            let _moveX = player.moveX;
            let _moveY = player.moveY;
            let _collideObject = world.collideObject;

            player.speed = 3;
            player.moveX = () => {
            };
            player.moveY = () => {
            };
            world.collideObject = () => {
            };

            player.setCenter({
                x: world.width / 2,
                y: -100
            })
            player.extraGun.x = player.getX();
            player.extraGun.y = player.getY();
            player.movingX = 0;
            player.movingY = 1;
            player.setImmunity(240);
            player.canShoot = false;

            Util.addPromise(() => {
                player.movingY = 0;
                player.moveX = _moveX;
                player.moveY = _moveY;
                player.speed = _speed;
                world.collideObject = _collideObject;
                player.canShoot = true;
            }, 90);
        })
        .setExtraGunMovingFunction(() => {
            let ra = Util.rectToPolar(Util.xyDistance(player.extraGun, player));
            player.extraGun.angle = ra.a;
            return ra.r / 5;
        })
        .startShooting(3)
        .toStartPosition();

    world.init(player);
    game.init(world);
}

function initLevel() {
    step1();

    world.addPromise(step2, 300);

    world.addPromise(step3, 700);

    world.addPromise(step4, 1600);

    world.addPromise(() => {
        step2();
        step3();
    }, 2500);

    world.addPromise(step1, 2800);

    world.addPromise(step5, 3600);
}

function step1() {
    for (let i = -2; i <= 2; i++) {
        let mob = MobTemplates.fishWithLoot(0.7);

        world.addPromise(() => {
            let startPos = {
                x: 350 + i * 200,
                y: 1050
            };
            let endPos = {
                x: 350 + i * 100,
                y: 700
            }
            mob
                .setCenter(startPos)
                .setAngle(Util.calculateAngle(startPos, endPos))
                .setMovingFunction(() => {
                    return Util.distance(mob.getCenter(), endPos) / 20;
                })
                .addPromiseAttack(() => {
                    BulletTemplates.base(mob.getCenter(), player.getCenter(), () => 5)
                        .append();
                }, 120 - i * 15)
                .append()
            ;
        }, 120 + i * 30);

        world.addPromise(() => {
            let startTime = world.frames;
            mob.setAngle(Math.PI);
            mob.setMovingFunction(() => {
                let dt = world.frames - startTime;
                return dt / 10;
            });
        }, 360 + i * 30);
    }
}

function step2() {

    for (let i = 0; i < 5; i++) {
        let mob = MobTemplates.fishWithLoot(0.3);

        world.addPromise(() => {
            let dxy = Util.polarToRect(Math.random() * 30, Math.random() * Math.PI * 2);
            let start = {
                x: 300,
                y: 1050
            };
            let end = {
                x: 300 + i * dxy.x,
                y: 750 + i * dxy.y
            };
            mob
                .setCenter(start)
                .setAngle(Util.calculateAngle(start, end))
                .setMovingFunction(() => {
                    return Util.distance(mob.getCenter(), end) / 20;
                })
                .addLoopAttack(() => {
                    let dxy = Util.polarToRect(Math.random() * 100, Math.random() * Math.PI * 2);
                    BulletTemplates.base({
                            x: mob.getCenter().x + dxy.x,
                            y: mob.getCenter().y + dxy.y
                        },
                        player.getCenter(),
                        () => 4 + Math.random() * 3)
                        .append();
                }, 4)
                .append()
            ;
            world.addPromise(() => {
                mob.stopAttacks();
                world.addPromise(() => {
                    let timeStart = world.frames;
                    mob.setMovingFunction(() => {
                        let dt = world.frames - timeStart;
                        let speed = dt / 25;
                        if (speed > 10) speed = 10;
                        mob.setAngle(-Math.PI - speed / 3);
                        return speed;
                    })
                }, 30);
            }, 60);
        }, i * 15);
    }

}

function step3() {
    for (let i = 0; i < 6; i++) {
        world.addPromise(() => {
            let xRnd = 100 + Math.random() * (world.width - 200);
            faggots(xRnd);
        }, 1 + i * (300 - i * 30))
    }
}

function step4() {
    ebalai(10, 150, false, 120, 50);
    world.addPromise(() => {
        ebalai(10, 550, true, 120, 50);
    }, 60);

    let zaloopId = world.addLoop(() => {
        let xRnd = 100 + Math.random() * 500;
        nigger(xRnd);
    }, 30);

    world.addPromise(() => {
        world.removeLoop(zaloopId);
    }, 300);
}

function step5() {

    world.addPromise(() => {
        bogdanPidor();
    }, 0);
}

function faggots(x) {
    for (let i = 1; i <= 7; i++) {
        world.addPromise(() => {
            let mob = MobTemplates.fishWithLoot(0.3);
            let start = {
                x,
                y: 1050
            };
            mob.setCenter(start)
                .setAngle(-Math.PI / 2)
                .setMovingFunction(() => 3)
                .addLoopAttack(() => {
                    BulletTemplates.base(
                        mob.getCenter(),
                        player.getCenter(),
                        () => 5
                    ).append();
                }, 60)
                .append()
            ;
        }, i * 30)
    }
}

function nigger(x) {
    let mob = MobTemplates.fishWithLoot(1);
    let start = {
        x,
        y: 1050
    };
    let end = {
        x,
        y: 800 + Math.random() * 150
    };
    mob
        .setCenter(start)
        .setAngle(-Math.PI / 2)
        .setMovingFunction(() => {
            if (Util.distance(mob.getCenter(), end) / 12 < 1) {
                mob.setMovingFunction(() => 0);
                world.addPromise(() => {
                    let startTime = world.frames;
                    mob.setAngle(Math.random() > 0.5 ? 0 : Math.PI);
                    mob.setMovingFunction(() => {
                        let dt = world.frames - startTime;
                        let speed = dt / 25 ** 0.5;
                        return speed;
                    })
                }, 120);
            }
            return Util.distance(mob.getCenter(), end) / 12;
        })
        .addPromiseAttack(() => {
            let attackTime = world.frames;
            BulletTemplates.roundLittleBulletsArray(() => {
                    let dt = world.frames - attackTime;
                    let speed = 10 - (dt / 60) ** 2;
                    return speed < 4 ? 4 : speed;
                },
                8,
                mob.getCenter(),
                Util.calculateAngle(mob.getCenter(), player.getCenter()),
                60
            ).forEach((b) => b.append());
        }, 120)
        .append();
}

function ebalai(count, x, left, forwardTime, diveTime) {
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < count; j++) {
            world.addPromise(() => {
                let start = {
                    x: x - 30 + 60 * i,
                    y: 1050
                };
                let mob = MobTemplates.fish();
                mob.setCenter(start)
                    .setAngle(-Math.PI / 2)
                    .setMovingFunction(() => {
                        return 5;
                    }).append()
                ;

                world.addPromise(() => {
                    mob.setMovingFunction(left ? () => {
                        mob.angle -= 0.05;
                        return 5;
                    } : () => {
                        mob.angle += 0.05;
                        return 5;
                    });
                    world.addPromise(() => {
                        mob.setMovingFunction(() => 5);
                    }, diveTime);
                }, forwardTime);

            }, j * 15);
        }
    }
}

function bogdanPidor() {

    let hp = 300;

    let stagesHP = [];

    for (let i = 0; i < 3; i++) {
        stagesHP.push(hp - hp * i / 3);
    }

    let boss = new Mob();
    let stage;

    let start = {
        x: 350,
        y: 1050
    };
    let keyPos = {
        x: 350,
        y: 700
    };

    let loopId;

    boss
        .setRadius(15)
        .setMeshBoxSize(50)
        .setMesh(TextureTemplates.test)
        .setCenter(start)
        .setHP(hp)
        .setAngle(Util.calculateAngle(start, keyPos))
        .setMovingFunction(() => {
            let d = Util.distance(boss.getCenter(), keyPos) / 12;
            if (d <= 1) {
                boss.setMovingFunction(() => 0);
            }
            return d;
        })
        .appendMesh()
        .append()
    ;

    formashlep();

    let boss_makeDamage = boss.makeDamage;
    boss.makeDamage = (value) => {
        let returnValue = boss_makeDamage(value);
        checkStage(boss.getHP());
        return returnValue;
    };

    function checkStage() {
        console.log("1:" + boss.getHP())
        if (boss.getHP() < stagesHP[1]) {
            putin();
            checkStage = function () {
                console.log("2: " + boss.getHP());
                if (boss.getHP() < stagesHP[2]) {
                    hitler();
                    checkStage = function () {};
                }
            }
        }
    }

    function formashlep() {
        console.log("богдан теперь формашлеп");

        stage = 0;
        boss.stopAttacks();

        boss.addLoopAttack(() => {
            for (let i = 0; i < 8; i++) {
                world.addPromise(() => {
                    let target = player.getCenter();
                    for (let j = 0; j < 10; j++) {
                        if (stage === 0) {
                            BulletTemplates.base(
                                boss.getCenter(),
                                target,
                                () => 10 - j / 3,
                                25
                            ).append();
                        }
                    }
                }, i * 10);
            }

            world.addPromise(() => {
                if (stage === 0) {
                    for (let i = 0; i < 9; i++) {
                        world.addPromise(() => {
                            circle(i * 0.05);
                        }, i * 6);
                    }
                }
            }, 120);
        }, 300);

        let circle = (da) => {
            BulletTemplates.roundLittleBulletsArray(
                () => 5,
                20,
                boss.getCenter(),
                Util.calculateAngle(boss.getCenter(), player.getCenter()) + da,
                15
            ).forEach((b) => b.append());
        }

        boss.startAttacks();
    }

    function putin() {
        console.log("Богдан теперь корупционер");

        stage = 1;

        let circle = (angle, mf) => {
            BulletTemplates.roundLittleBulletsArray(
                mf,
                20,
                boss.getCenter(),
                angle,
                15
            ).forEach((b) => b.append());
        }

        loopId = world.addLoop(() => {
            let target = player.getCenter();
            let angle = Util.calculateAngle(boss.getCenter(), target);
            for (let i = 0; i < 20; i++) {
                if (stage === 1) {
                    world.addPromise(() => {
                        let createTime = world.frames;
                        circle(
                            angle + i / 40,
                            () => (world.frames - createTime) / 25
                        );
                    }, i * 2);
                }
            }
            for (let i = 0; i < 20; i++) {
                if (stage === 1) {
                    world.addPromise(() => {
                        let createTime = world.frames;
                        circle(
                            angle + 0.5 - i / 40,
                            () => (world.frames - createTime / 25)
                        );
                    }, 40 + i * 2);
                }
            }
            nigger(100 + Math.random() * 500);
        }, 180);
    }

    function hitler() {

        world.removeLoop(loopId);

        console.log("Богдан теперь убивает нациста");

        stage = 2;

        loopId = world.addLoop(() => {
            let a = Math.random() * Math.PI * 2
            let createTime = world.frames;
            let b = new Bullet();
            b
                .setMeshBoxSize(15)
                .setMesh(TextureTemplates.blueBall)
                .setCenter(boss.getCenter())
                .setAngle(a)
                .setMovingFunction(() => {
                    b.angle -= 0.01;
                    let dt = world.frames - createTime;
                    return dt / 25;
                })
                .appendMesh()
                .append();
        }, 1);

        boss.setOnDie(() => {
            world.removeLoop(loopId);
            alert("победа ура");
        });
    }
}