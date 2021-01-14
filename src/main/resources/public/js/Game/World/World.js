import {Util} from "../../Util.js";

export {World};

class World {
    time = 0;
    backgroundColor = "#000";

    width = 1000;
    height = 2000;

    player;

    mobs = [];
    bullets = [];
    playerBullets = [];
    loots = [];

    /**
     * @param player = Objects.Player.class
     */
    init = (player) => {
        this.player = player;

        /* i used this instead of setInterval because I want the
        countdown starts only when the function ends instead of it starts */
        let removeDead = () => {
            this.removeDead();
            setTimeout(removeDead, 100);
        };
        removeDead();
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

        //console.log(this.mobs.length, this.bullets.length, this.playerBullets.length, this.loots.length);
    }

    sum = 0;
    count = 0;

    update = (time) => {

        let dt = window.performance.now();

        this.time = time;

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

        dt -= window.performance.now();
        dt = -dt;
        this.sum += dt;
        this.count++;
        if (this.count % 100 === 0) {
            console.log("100 ticks time:", this.sum);
            this.sum = 0;
        }
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
