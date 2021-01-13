export class Util {

    static rectToPolar = (x, y) => {
        return {
            r: Math.hypot(x, y),
            a: Math.atan2(y, x),
        }
    }

    static polarToRect = (r, a) => {
        return {
            x: r * Math.cos(a),
            y: r * Math.sin(a),
        }
    }

    static calculateAngle = (xy1, xy2) => Math.atan2(xy2.y - xy1.y, xy2.x - xy1.x)

    static isIntersect = (r1, r2) => (
        r2.right > r1.left &&
        r1.right > r2.left &&
        r2.bottom > r1.top &&
        r1.bottom > r2.top
    )

}