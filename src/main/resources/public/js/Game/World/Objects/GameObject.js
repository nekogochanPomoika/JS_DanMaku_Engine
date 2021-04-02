
export {GameObject}

class GameObject {
    x;
    y;
    alive = true;
    onDie;

    setAlive(alive) {this.alive = alive; return this;}

    isAlive() {
        return this.alive;
    }

    setOnDie(onDie) {
        this.onDie = onDie;
        return this;
    };

    setCenter(xy) {
        this.x = xy.x;
        this.y = xy.y;
        return this;
    }

    getCenter() {
        return {
            x: this.x,
            y: this.y
        }
    }
}
