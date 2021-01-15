import {Util} from "../../Util.js";

export {World};

class World {

    time = 0; // count of frames from start

    backgroundColor = "#000";

    width = 1400;
    height = 2000;

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
    init = (player) => {
        this.player = player;

        this.addLoop(this.removeDead, 6);
    }

    addPromise = (foo, delay) => {
        delay = Math.floor(delay);
        this.newPromises.push({
            time: delay + this.time,
            foo,
        });
    }

    addLoop = (foo, delay) => {
        delay = Math.floor(delay);
        let id = Math.floor(Math.random() * 10000);
        while (!this.isUniqueId(id)) id++;

        this.loops.push({
            id,
            foo,
            delay,
            startTime: this.time,
        });

        return id;
    }

    isUniqueId = (id) => {
        for (let i = 0; i < this.loops.length; i++) {
            if (this.loops[i].id === id) return false;
        }
        return true;
    }

    removeLoop = (id) => {
        for (let i = 0; i < this.loops.length; i++) {
            if (this.loops[i].id === id) {
                this.loops.splice(i, 1);
                return;
            }
        }
    }

    removeDead = () => {
        this.mobs = this.mobs.filter((m) => {
            if (m.isAlive) return true;
            m.die();
            return false;
        });
        this.bullets = this.bullets.filter((b) => b.isAlive);
        this.playerBullets = this.playerBullets.filter((b) => b.isAlive);
        this.loots = this.loots.filter((l) => l.isAlive);

        // console.log(this.mobs.length, this.bullets.length, this.playerBullets.length, this.loots.length);
    }

    sum = 0;
    count = 0;

    update = () => {
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
            if (Util.isIntersect(mob, this.player)) this.player.makeDamage();
        })
        this.checkBulletsIntersect();
        this.checkPlayerBulletsIntersect();
        this.triggerLoots();

        dt = window.performance.now() - dt;
        this.sum += dt;
        this.count++;
        if (this.count % 100 === 0) {
            console.log("100 ticks time:", this.sum);
            this.sum = 0;
        }
    }

    checkPromises = () => {
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

    checkLoops = () => {
        this.loops.forEach((l) => {
            if ((this.time - l.startTime) % l.delay === 0) l.foo();
        })
    }

    collideObject = (obj) => {
        if (obj.left < 0) {
            obj.setLeft(0);
            obj.velocityX = 0;
        } else if (obj.right > this.width) {
            obj.setRight(this.width);
            obj.velocityX = 0;
        }
        if (obj.top < 0) {
            obj.setTop(0);
            obj.velocityY = 0;
        } else if (obj.bottom > this.height) {
            obj.setBottom(this.height);
            obj.velocityY = 0;
        }
    }

    checkBulletsIntersect = () => {
        this.bullets = this.bullets.filter((b) => {
            if (Util.isIntersect(b, this.player)) {
                this.player.makeDamage();
                return false;
            } else {
                return true;
            }
        });
    }

    checkPlayerBulletsIntersect = () => {
        this.playerBullets = this.playerBullets.filter((b) => {
            let res = true;
            this.mobs = this.mobs.filter((m) => {
                if (Util.isIntersect(m, b)) {
                    res = false;
                    m.makeDamage(b.damage);
                }
                return m.isAlive;
            })
            return res;
        });
    }

    triggerLoots = () => {
        this.loots.forEach((l) => {
            if (Util.isNearby(this.player, l, 150)) {
                l.setAngle(Util.calculateAngle(l, this.player))
                    .setMovingFunction(() => 18);
            }
        });
        this.loots = this.loots.filter((l) => {
            if (Util.isIntersect(this.player, l)) {
                this.player.powerUp(l.value);
                console.log(this.player.power);
                return false;
            } else {
                return true;
            }
        });
    }
}
