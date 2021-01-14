
export {GameObject}

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
