import {Util} from "../../Util.js";

export {World};

class World {
    time = 0;
    backgroundColor = "#0004";

    width = 1000;
    height = 2000;

    player;

    mobs = [];
    bullets = [];
    playerBullets = [];

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

        console.log(this.mobs.length, this.bullets.length, this.playerBullets.length);
    }

    update = (time) => {
        this.time = time;

        this.player.update();
        this.mobs.forEach((m) => m.update());
        this.bullets.forEach((b) => b.update());
        this.playerBullets.forEach((b) => b.update());

        this.collideObject(this.player);

        this.mobs.forEach((mob) => {
            if (Util.isIntersect(mob, this.player)) this.player.getDamage();
        })
        this.checkBulletsIntersect();
        this.checkPlayerBulletsIntersect();
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
            for (let i = this.mobs.length - 1; i >= 0; i--) {
                let m = this.mobs[i];
                if (Util.isIntersect(m, b)) {
                    m.makeDamage(b.damage);
                    if (m.isAlive) this.mobs.splice(i, 1);
                    res = false;
                }
            }
            return res;
        });
    }
}
