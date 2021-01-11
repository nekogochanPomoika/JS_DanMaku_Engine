import {Bullet} from "./Objects.js";
import {Util} from "../../Util.js";

export {World};

class World {
    time = 0;
    backgroundColor = "#3331";

    width = 2000;
    height = 2000;

    player;

    bullets = [];

    /**
     * @param player = Objects.Player.class
     */
    init = (player) => {
        this.player = player;

        /* i used this instead of setInterval because I want the
        countdown starts only when the function ends instead of it starts */
        let removeDeadBullets = () => {
            this.removeDeadBullets();
            setTimeout(removeDeadBullets, 100);
        };
        setTimeout(removeDeadBullets, 100);
    }

    removeDeadBullets = () => {
        this.bullets = this.bullets.filter((b) => b.isAlive);
    }
    
    bulletRunTest = () => {
        let startPosition = {x: this.width / 2, y: this.height / 2};

        for (let i = 0; i < 4000; i++) {
            setTimeout(() => {
                let createTime = this.time;
                this.bullets.push(
                    new Bullet()
                        .setWidth(16)
                        .setHeight(16)
                        .setCenter(startPosition)
                        .setColor("#b00")
                        .setMovingFunction(() => {
                            let dt = this.time - createTime;
                            if (dt > 4000) dt = i;
                            let dr = dt / 100;
                            let da = Math.pow(i + dt / 5000, 1.3);
                            return Util.polarToRect(dr, da);
                        })
                );
            }, Math.pow(i * 10, 0.7));
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

    update = (time) => {
        this.time = time;
        this.player.update();
        this.bullets.forEach((b) => {b.update()});
        this.collideObject(this.player);
    }
}
