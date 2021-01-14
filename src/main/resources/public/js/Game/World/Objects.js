import {Util} from "../../Util.js";

export {Bullet, Mob, Player, PlayerBullet};

class GameObject {
    radius;
    x;
    y;
    isAlive = true;

    setRadius = (radius) => {this.radius = radius; return this;}
    setX = (x) => {this.x = x; return this;}
    setY = (y) => {this.y = y; return this;}
    setAlive = (alive) => {this.isAlive = alive; return this;}

    setLeft = (a) => {this.x = a + this.radius; return this;}
    setRight = (a) => {this.x = a - this.radius; return this;}
    setTop = (a) => {this.y = a + this.radius; return this;}
    setBottom = (a) => {this.y = a - this.radius; return this;}
    setCenter = (xy) => {
        this.x = xy.x;
        this.y = xy.y;
        return this;
    }

    get left() {return this.x - this.radius}
    get right() {return this.x + this.radius}
    get top() {return this.y - this.radius}
    get bottom() {return this.y + this.radius}
    get center() {
        return {
            x: this.x,
            y: this.y
        }
    }
}

class MovingObject extends GameObject {

    static isOutOfBounds;
    /**
     * @param defaultShouldDieCondition f(Bullet.class obj) => boolean
     */
    static setIsOutOfBounds = (defaultShouldDieCondition) => {
        MovingObject.isOutOfBounds = defaultShouldDieCondition;
    }

    movingFunction;

    angle;

    setAngle = (angle) => {this.angle = angle; return this;}

    /**
     * @param movingFunction = f() => {dr}
     */
    setMovingFunction = (movingFunction) => {this.movingFunction = movingFunction; return this};

    update() {
        let dr = this.movingFunction();
        let dxy = Util.polarToRect(dr, this.angle);

        this.x += dxy.x;
        this.y += dxy.y;

        if (MovingObject.isOutOfBounds(this)) {
            this.isAlive = false;
        }
    }
}

class Bullet extends MovingObject {

    static getBulletArray;
    /**
     * @param getArray = f() => [Bullet]
     */
    static setBulletArray = (getArray) => {Bullet.getBulletArray = getArray}

    color = "#b00";

    append = () => {
        Bullet.getBulletArray().push(this);
    }
}

class PlayerBullet extends MovingObject {

    // this class almost the same as the previous one,
    // except that it uses a different array and refers to the bullets of the "player"

    static getPlayerBulletArray;
    static setPlayerBulletArray = (getArray) => {
        PlayerBullet.getPlayerBulletArray = getArray;
    }

    damage;

    setDamage = (damage) => {this.damage = damage; return this;}

    color = "#b0b";

    append = () => {
        PlayerBullet.getPlayerBulletArray().push(this);
    }
}

class Mob extends MovingObject {

    static getMobsArray;
    /**
     * @param mobsArray = f() => [mobsArray]
     */
    static setMobsArray = (mobsArray) => {Mob.getMobsArray = mobsArray}

    color = "#bb0";

    #hitPoints = 1;

    #attacks = [];

    #onDie = [];

    setHP = (hp) => {this.#hitPoints = hp; return this;}
    setOnDie = (onDie) => {this.#onDie = onDie; return this;}
    /**
     * @param type = [0 = interval, 1 = timeout]
     * @param foo = [f() => interval / timeout ids]
     */
    #addAttack = (type, foo) => {
        this.#attacks.push({type, foo});
        return this;
    }

    addIntervalAttack = (foo, delay) => {
        let _foo = () => setInterval(foo, delay)
        this.#addAttack(0, _foo);
        return this;
    }

    addTimeoutAttack = (foo, delay) => {
        let _foo = () => setTimeout(foo, delay);
        this.#addAttack(1, _foo);
        return this;
    }

    // starts attack functions, set in array attacks intervals ids
    startAttacks = () => {
        this.#attacks = this.#attacks.map((a) => {return {type: a.type, id: a.foo()}});
    }


    makeDamage = (value) => {
        this.#hitPoints -= value;
        if (this.#hitPoints <= 0) this.die();
        return this;
    }

    die = () => {
        console.log("mod die");
        this.setAlive(false);
        this.#attacks.forEach((a) => {
                 if (a.type === 0) window.clearInterval(a.id);
            else if (a.type === 1) window.clearTimeout(a.id);
        })
        this.#onDie.forEach((f) => f());
    }

    append = () => {
        Mob.getMobsArray().push(this);
        this.startAttacks();
    }
}

class Player extends GameObject {
    color = "#0b0";

    baseVelocity = 22;
    movingX = 0;
    movingY = 0;
    diagonalMovement = false;
    diagonalMovementCoef = Math.sqrt(2);

    isImmunity = false;

    canShoot = true;
    isShooting = false;
    gunId;

    lives = 3;

    toStartPosition;

    setToStartPosition = (toStartPosition) => {this.toStartPosition = toStartPosition; return this;}

    startShooting = (delay) => {
        this.gunId = setInterval(() => {
            if (this.isShooting && this.canShoot) this.shoot();
        }, delay);
        return this;
    }

    shoot = () => {
        let createBullet = (dx) => {
            new PlayerBullet()
                .setAngle(-Math.PI / 2)
                .setMovingFunction(() => 30)
                .setRadius(10)
                .setCenter({x: this.x + dx, y: this.y - 20})
                .setDamage(1)
                .append();
        }

        createBullet(-this.radius);
        createBullet(this.radius);
    }

    moveX = (left, right) => {
        if (left === right) {
            this.movingX = 0;
            this.diagonalMovement = false;
        } else {
            this.movingX = left ? -1 : 1;
            this.diagonalMovement = this.movingY !== 0;
        }
    }

    moveY = (up, down) => {
        if (up === down) {
            this.movingY = 0;
            this.diagonalMovement = false;
        } else {
            this.movingY = up ? -1 : 1;
            this.diagonalMovement = this.movingX !== 0;
        }
    }

    setImmunity = (duration) => {
        this.isImmunity = true;
        setTimeout(() => {
            this.isImmunity = false;
        }, duration);
    }

    makeDamage = () => {
        if (this.isImmunity) return;

        this.lives--;
        if (this.lives === 0) {
            this.die();
        } else {
            this.toStartPosition();
        }
    }

    die = () => {
        console.log("player die");
    }

    update = () => {
        let dx = this.baseVelocity * this.movingX;
        let dy = this.baseVelocity * this.movingY;

        if (this.diagonalMovement) {
            dx /= this.diagonalMovementCoef;
            dy /= this.diagonalMovementCoef;
        }

        this.x += dx;
        this.y += dy;
    }
}
