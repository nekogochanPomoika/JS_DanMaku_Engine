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
}