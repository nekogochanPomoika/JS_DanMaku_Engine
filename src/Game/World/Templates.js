import {Util} from "../../Util.js";
import {Bullet} from "./Objects/Bullet.js";
import {Mob} from "./Objects/Mob.js";
import {PowerUpLoot} from "./Objects/Loot.js";

import * as THREE from "three";

let texLoader = new THREE.TextureLoader();

export class BulletTemplates {

    static base(from, to, mf, size = 20) {
        return new Bullet()
            .setMeshBoxSize(size + 3)
            .setMesh(TextureTemplates.blueBall)
            .setCenter(from)
            .setAngle(Util.calculateAngle(from, to))
            .setMovingFunction(mf)
            .setInColliderFoo(function (c) {
                return Util.isNearby(this.getCenter(), c.getCenter(), size);
            });
    }

    static roundLittleBulletsArray = (mf, count, start, da = 0, size) => {
        let arr = [];
        for (let i = 0; i < count; i++) {
            arr.push(
                new Bullet()
                    .setMeshBoxSize(size + 3)
                    .setMesh(TextureTemplates.blueBall)
                    .setCenter(start)
                    .setAngle(Math.PI * 2 * i / count + da)
                    .setMovingFunction(mf)
                    .setInColliderFoo(function (c) {
                        return Util.isNearby(this.getCenter(), c.getCenter(), size)
                    })
            );
        }
        return arr;
    }

}

export class MobTemplates {
    /**
     * @returns {Mob}
     */
    static fish() {
        return new Mob()
            .setRadius(50)
            .setMesh(TextureTemplates.test)
            .setHP(15)
        ;
    }

    /**
     * @param {number} probability
     * @returns {Mob}
     */
    static fishWithLoot(probability) {
        let mob = MobTemplates.fish()
        return mob.setOnDie(() => {
                if (probability > Math.random()) {
                    new PowerUpLoot()
                        .setCenter(mob.getCenter())
                        .append()
                    ;
                }
            })
        ;
    }

}

export class TextureTemplates {

    static onReady = [];

    static test = load("test.jpg");

    static background = texLoader.load("textures/background.png", flag);

    static blueBall = load("blue_ball.png", true);

    static redBall = load("red_ball.png", true);

    static hero = [
        load("hero/0.png", true),
        load("hero/1.png", true),
        load("hero/2.png", true)
    ];

    static sphere = load("sphere.png", true);

    static powerUp = load("power_up.png", true);

}

let i = 9;

function load(url, rgba = false) {
    url = "textures/" + url;
    return rgba ? rgbaTexMaterial(url) : rgbaTexMaterial(url);
}

function rgbaTexMaterial(url) {
    return new THREE.MeshBasicMaterial({
        map: texLoader.load(url, flag),
        transparent: true
    })
}

function rgbTexMaterial(url) {
    return new THREE.MeshBasicMaterial({
        map: texLoader.load(url, flag)
    });
}

function flag() {
    i--;
    if (i === 0) {
        for (let foo of TextureTemplates.onReady) {
            foo();
        }
    }
}