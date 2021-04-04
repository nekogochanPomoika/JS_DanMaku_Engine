
export {GameObject}

import {display} from "../../../Display";
import * as THREE from "three";

class GameObject {
    x;
    y;
    z;
    alive = true;
    onDie;
    meshBoxSize;
    mesh;
    radius;

    getX() {
        return this.x;
    }
    setX(x) {
        this.x = x;
        this.mesh.position.x = x;
        return this;
    }

    getY() {
        return this.y;
    }
    setY(y) {
        this.y = y;
        this.mesh.position.y = y;
        return this;
    }

    getMeshBoxSize() {
        return this.meshBoxSize;
    }
    setMeshBoxSize(size) {
        this.meshBoxSize = size;
        return this;
    }

    setAlive(alive) {this.alive = alive; return this;}

    isAlive() {
        return this.alive;
    }

    setOnDie(onDie) {
        this.onDie = onDie;
        return this;
    };

    setCenter(xy) {
        this.setX(xy.x);
        this.setY(xy.y);
        return this;
    }

    setMesh(material) {
        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(),
            material
        );
        this.mesh.scale.x = this.mesh.scale.y = this.meshBoxSize;
        this.mesh.position.z = this.z;
        return this;
    }

    getCenter() {
        return {
            x: this.x,
            y: this.y
        }
    }

    setRadius(radius) {
        this.meshBoxSize = radius;
        return this;
    }

    getRadius() {
        return this.meshBoxSize;
    }

    getMesh() {
        return this.mesh;
    }

    appendMesh() {
        display.scene.add(this.mesh);
        return this;
    }

    disposeMesh() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        display.scene.remove(this.mesh);
    }

    die() {
        if (this.onDie && this.isAlive()) this.onDie();
        this.setAlive(false);
        this.disposeMesh();
    }

    setLeft(a) {this.setX(a + this.radius); return this;}
    setRight(a) {this.setX(a - this.radius); return this;}
    setTop(a) {this.setY(a + this.radius); return this;}
    setBottom(a) {this.setY(a - this.radius); return this;}
    getLeft() {return this.x - this.radius}
    getRight() {return this.x + this.radius}
    getTop() {return this.y - this.radius}
    getBottom() {return this.y + this.radius}
}
