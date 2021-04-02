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

    static isNearby = (c1, c2, v) => Math.hypot(c2.x - c1.x, c2.y - c1.y) < v;

    static xyDistance(p1, p2) {
        return {
            x: p1.x - p2.x,
            y: p1.y - p2.y
        };
    }

    static distance = (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y);

}
