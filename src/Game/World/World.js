import {Util} from "../../Util.js";
import {display} from "../../Display";
import {TextureTemplates} from "./Templates.js";
import * as THREE from "three";

export {World};


function nextInt() {
    return nextInt.i++;
}
nextInt.i = Number.MIN_SAFE_INTEGER;

class World {

    frames = 0; // count of frames from start

    width = 700;
    height = 1000;

    totalFramesCount = 60 * 60 * 2;

    background = {
        value: undefined,
        uniforms: {}
    };
    static fragShaderCode = `
uniform vec2 u_resolution;
uniform sampler2D u_texture;
uniform float u_ar;
uniform float u_dy;

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution.xy;
    coord.y += u_dy;
    coord.y *= u_ar;
    gl_FragColor = texture2D(u_texture, coord);
}`
    ;

    player;

    mobs = [];
    bullets = [];
    playerBullets = [];
    loots = [];

    promises = [];
    newPromises = [];

    loops = []; // infinity promises

    constructor() {
        let tex = TextureTemplates.background;
        let texAR = tex.image.width / tex.image.height;
        let resAR = this.width / this.height;

        this.background.uniforms.u_resolution = {value: new THREE.Vector2(this.width, this.height)};
        this.background.uniforms.u_texture = {value: tex};
        this.background.uniforms.u_ar = {value: texAR / resAR};
        this.background.uniforms.u_dy = {value: 0};

        this.updateDY = () => {
            this.background.uniforms.u_dy.value =
                this.frames > this.totalFramesCount ? 1.1 :
                (resAR / texAR - 1) * this.frames / this.totalFramesCount;
        }
        this.updateDY();

        let canvas = new THREE.Mesh(
            new THREE.PlaneGeometry(),
            new THREE.ShaderMaterial({
                uniforms: this.background.uniforms,
                fragmentShader: World.fragShaderCode
            })
        );
        canvas.scale.x = this.width;
        canvas.scale.y = this.height;

        canvas.position.z = 0;
        canvas.position.x = this.width / 2;
        canvas.position.y = this.height / 2;

        display.scene.add(canvas);
        this.background.value = canvas;

        this.addLoop(() => {
            console.log(this.bullets.length, this.playerBullets.length, this.mobs.length, this.promises.length, this.loops.length);
        }, 120);

    }

    /**
     * @param player = Objects.Player.class
     */
    init(player) {
        this.player = player;
        this.addLoop(this.removeDead, 6);
    }

    addPromise = (foo, delay) => {
        delay = Math.floor(delay);
        if (delay === 0) foo();
        else {
            this.newPromises.push({
                time: delay + this.frames,
                foo,
            });
        }
    };

    addLoop = (foo, delay) => {

        let id = nextInt();

        this.loops.push({
            id,
            foo,
            delay,
            startTime: this.frames,
        });

        return id;
    };

    removeLoop = id => {
        for (let i = 0; i < this.loops.length; i++) {
            if (this.loops[i].id === id) {
                this.loops.splice(i, 1);
                return;
            }
        }
    };

    removeDead = () => {
        this.mobs = this.mobs.filter((m) => {
            if (m.isAlive()) return true;
            m.die();
            return false;
        });
        this.bullets = this.bullets.filter((b) => b.isAlive());
        this.playerBullets = this.playerBullets.filter((b) => b.isAlive());
        this.loots = this.loots.filter((l) => l.isAlive());
    };

    update() {
        this.frames++;
        this.updateDY();

        this.checkPromises();
        this.checkLoops();

        this.player.update();
        this.collideObject(this.player);

        this.mobs.forEach((m) => m.update());
        this.bullets.forEach((b) => b.update());
        this.playerBullets.forEach((b) => b.update());
        this.loots.forEach((l) => l.update());

        this.mobs.forEach((mob) => {
            if (mob.inColliderOf(this.player)) this.player.makeDamage();
        })
        this.checkBulletsIntersect();
        this.checkPlayerBulletsIntersect();
        this.triggerLoots();
    }

    checkPromises() {
        this.promises.push(...this.newPromises);
        this.newPromises = [];
        this.promises = this.promises.filter((promise) => {
            if (this.frames === promise.time) {
                promise.foo();
                return false;
            } else {
                return true;
            }
        });
    }

    checkLoops() {
        this.loops.forEach((l) => {
            if ((this.frames - l.startTime) % l.delay === 0) l.foo();
        })
    }

    collideObject(obj) {
        if (obj.getLeft() < 0) {
            obj.setLeft(0);
        } else if (obj.getRight() > this.width) {
            obj.setRight(this.width);
        }
        if (obj.getTop() < 0) {
            obj.setTop(0);
        } else if (obj.getBottom() > this.height) {
            obj.setBottom(this.height);
        }
    }

    checkBulletsIntersect() {
        this.bullets = this.bullets.filter((b) => {
            if (b.inColliderOf(this.player)) {
                this.player.makeDamage();
                b.die();
                return false;
            } else {
                return true;
            }
        });
    }

    checkPlayerBulletsIntersect() {
        this.playerBullets = this.playerBullets.filter((b) => {
            let res = true;
            this.mobs = this.mobs.filter((m) => {
                if (b.inColliderOf(m)) {
                    res = false;
                    m.makeDamage(b.damage);
                    b.die();
                }
                return m.isAlive();
            });
            return res;
        });
    }

    triggerLoots() {
        this.loots = this.loots.filter((l) => {
            if (Util.isNearby(this.player, l, 10)) {
                l.onTake();
                return false;
            } else {
                return true;
            }
        });
        this.loots.forEach((l) => {
            if (Util.isNearby(this.player, l, 150)) {
                l.setAngle(Util.calculateAngle(l, this.player))
                    .setMovingFunction(() => 18);
            }
        });
    }
}
