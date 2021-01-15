export class Util {

    static rectToPolar = (xy) => {
        return {
            r: Math.hypot(xy.x, xy.y),
            a: Math.atan2(xy.y, xy.x),
        }
    }

    static polarToRect = (r, a) => {
        return {
            x: r * Math.cos(a),
            y: r * Math.sin(a),
        }
    }

    static calculateAngle = (xy1, xy2) => Math.atan2(xy2.y - xy1.y, xy2.x - xy1.x)

    static isIntersect = (c1, c2) => Math.hypot(c2.x - c1.x, c2.y - c1.y) < c1.radius + c2.radius;

    static isNearby = (c1, c2, v) => Math.hypot(c2.x - c1.x, c2.y - c1.y) < c1.radius + c2.radius + v;

    static getXYDistance = (c1, c2) => {return {x: c2.x - c1.x, y: c2.y - c1.y}};

}
