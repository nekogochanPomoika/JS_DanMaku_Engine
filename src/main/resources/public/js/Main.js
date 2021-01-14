"use strict";

import {engine} from "./Engine";
import {game} from "./Game";
import {controller} from "./Controller";
import {display} from "./Display";

// MVC Components, game = model

let settings = {
    fps: 60,
}

init();
addEventListeners();
start();

function init() {
    display.init(document.getElementById("gameScreen"));
    engine.init(1000/settings.fps, update, render)
}

function addEventListeners() {
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", controller.keyDownUp);
    window.addEventListener("keyup", controller.keyDownUp);
}

function start() {
    display.setBufferSides(game.world.width, game.world.height);
    resize();
    engine.start();
}

function resize() {
    display.resize(document.documentElement.clientWidth - 32,
        document.documentElement.clientHeight - 32,
        game.world.width / game.world.height);
    display.render();
}

function render() {
    display.fillColor(game.world.backgroundColor);

    game.world.mobs.forEach((m) => {display.drawCircle(m)});
    game.world.bullets.forEach((b) => {display.drawCircle(b)});
    game.world.playerBullets.forEach((b) => {display.drawCircle(b)});
    display.drawCircle(game.world.player);

    display.render();
}

function update(time) {
    game.world.player.moveX(controller.left.active, controller.right.active);
    game.world.player.moveY(controller.up.active, controller.down.active);
    game.world.player.isShooting = controller.z.active;
    game.update(time);
}
