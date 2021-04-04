export {Display};

import * as THREE from "three";
/* This Display class contains the screen resize event handler and also handles
drawing colors to the buffer and then to the display. */

class Display {

    canvas;

    #camera;
    scene = new THREE.Scene();
    #renderer;

    init(canvas, width, height) {
        this.canvas = canvas;
        this.#renderer = new THREE.WebGLRenderer({canvas});
        this.#camera = new THREE.OrthographicCamera(0, width, -height, 0, 0.1, 200);
        this.#camera.scale.y = -1;
        this.#camera.position.z = 100;
    }

    setThreeSize(width, height) {
        this.#camera.right = width;
        this.#camera.bottom = height;
        this.#renderer.setSize(width, height);
    }

    render = () => {
        this.#renderer.render(
            this.scene,
            this.#camera
        );
    }

    resize = (width, height, aspectRatio) => {
        if (width / height > aspectRatio) {
            this.canvas.style.height = `${height}px`;
            this.canvas.style.width = `${height * aspectRatio}px`;
        } else {
            this.canvas.style.width = `${width}px`
            this.canvas.style.height = `${width / aspectRatio}px`
        }
    }

    showAxis() {
        for (let s of ["x", "y", "z"]) {
            let m = new THREE.Mesh(
                new THREE.BoxGeometry(1, 1, 1),
                new THREE.MeshBasicMaterial({
                    color: (() => {
                        switch(s) {
                            case "x": return 0xff0000;
                            case "y": return 0x00ff00;
                            case "z": return 0x0000ff;
                        }
                    })()
                })
            );

            for (let _s of ["x", "y", "z"]) {
                m.scale[_s] = _s === s ? 2000 : 10;
                m.position[_s] = _s === s ? 1000 : 0;
            }

            this.scene.add(m);
        }
    }
}
