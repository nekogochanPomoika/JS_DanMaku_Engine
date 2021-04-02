import {Util} from "../../Util.js";

export {World};

function nextInt() {
    return nextInt.i++;
}
nextInt.i = Number.MIN_SAFE_INTEGER;

class World {

    time = 0; // count of frames from start

    backgroundColor = "#000";

    width = 700;
    height = 1000;

    player;

    mobs = [];
    bullets = [];
    playerBullets = [];
    loots = [];

    promises = [];
    newPromises = [];

    loops = []; // infinity promises

    /**
     * @param player = Objects.Player.class
     */
    init(player) {
        this.player = player;
        this.addLoop(this.removeDead, 6);
        setInterval(this.log, 1000);
    }

    log = () => {
        console.log("ticks, time, time per tick:", this.count, this.sum, this.sum / this.count);
        console.log(this.mobs.length, this.bullets.length, this.playerBullets.length, this.loots.length);
        this.sum = 0;
        this.count = 0;
    };

    addPromise = (foo, delay) => {
        delay = Math.floor(delay);
        this.newPromises.push({
            time: delay + this.time,
            foo,
        });
    };

    addLoop = (foo, delay) => {

        let id = nextInt();

        this.loops.push({
            id,
            foo,
            delay,
            startTime: this.time,
        });

        return id;
    };

    removeLoop = id => {
        for (let i = 0; i < this.loops.length; i++) {
            if (this.loops[i].id === id) {
                this.loops.splice(i, 1);
                return;
            }
        }
    };

    removeDead = () => {
        this.mobs = this.mobs.filter((m) => {
            if (m.isAlive) return true;
            m.die();
            return false;
        });
        this.bullets = this.bullets.filter((b) => b.isAlive);
        this.playerBullets = this.playerBullets.filter((b) => b.isAlive);
        this.loots = this.loots.filter((l) => l.isAlive);
    };

    sum = 0;
    count = 0;

    update() {
        this.time++;
        this.checkPromises();
        this.checkLoops();

        let dt = window.performance.now();

        this.player.update();
        this.mobs.forEach((m) => m.update());
        this.bullets.forEach((b) => b.update());
        this.playerBullets.forEach((b) => b.update());
        this.loots.forEach((l) => l.update());

        this.collideObject(this.player);

        this.mobs.forEach((mob) => {
            if (mob.inColliderOf(this.player)) this.player.makeDamage();
        })
        this.checkBulletsIntersect();
        this.checkPlayerBulletsIntersect();
        this.triggerLoots();

        dt = window.performance.now() - dt;
        this.sum += dt;
        this.count++;
    }

    checkPromises() {
        this.promises.push(...this.newPromises);
        this.newPromises = [];
        this.promises = this.promises.filter((promise) => {
            if (this.time === promise.time) {
                promise.foo();
                return false;
            } else {
                return true;
            }
        });
    }

    checkLoops() {
        this.loops.forEach((l) => {
            if ((this.time - l.startTime) % l.delay === 0) l.foo();
        })
    }

    collideObject(obj) {
        if (obj.getLeft() < 0) {
            obj.setLeft(0);
        } else if (obj.getRight() > this.width) {
            obj.setRight(this.width);
        }
        if (obj.getTop() < 0) {
            obj.setTop(0);
        } else if (obj.getBottom() > this.height) {
            obj.setBottom(this.height);
        }
    }

    checkBulletsIntersect() {
        this.bullets = this.bullets.filter((b) => {
            if (b.inColliderOf(this.player)) {
                this.player.makeDamage();
                return false;
            } else {
                return true;
            }
        });
    }

    checkPlayerBulletsIntersect() {
        this.playerBullets = this.playerBullets.filter((b) => {
            let res = true;
            this.mobs = this.mobs.filter((m) => {
                if (b.inColliderOf(m)) {
                    res = false;
                    m.makeDamage(b.damage);
                }
                return m.isAlive;
            })
            return res;
        });
    }

    triggerLoots() {
        this.loots.forEach((l) => {
            if (Util.isNearby(this.player, l, 150)) {
                l.setAngle(Util.calculateAngle(l, this.player))
                    .setMovingFunction(() => 18);
            }
        });
        this.loots = this.loots.filter((l) => {
            if (Util.isNearby(this.player, l, 10)) {
                this.player.powerUp(l.value);
                console.log(this.player.power);
                return false;
            } else {
                return true;
            }
        });
    }
}
