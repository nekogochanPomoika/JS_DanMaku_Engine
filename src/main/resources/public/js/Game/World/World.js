export {World};

class World {
    time = 0;
    backgroundColor = "#0001";

    width = 2000;
    height = 2000;

    player;

    mobs = [];
    bullets = [];

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
        setTimeout(removeDead, 100);
    }

    removeDead = () => {
        this.bullets = this.bullets.filter((b) => b.isAlive);
        this.mobs = this.mobs.filter((b) => {
            if (b.isAlive) return true;
            b.die();
            return false;
        });
        console.log(this.bullets.length, this.mobs.length);
    }
    
    bulletRunTest = () => {

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

    update = (time) => {
        this.time = time;
        this.player.update();
        this.bullets.forEach((b) => {b.update()});
        this.mobs.forEach((m) => {m.update()});
        this.collideObject(this.player);
    }
}
