"use strict";

import {Engine} from "./Engine.js";
import {Game} from "./Game.js";
import {Controller} from "./Controller.js";
import {Display} from "./Display.js";

// MVC Components, game = model

let settings = {
    fps: 60,
}

let display = new Display(document.getElementById("gameScreen"));
let controller = new Controller();
let game = new Game();
let engine = new Engine(1000/settings.fps, update, render);

addEventListeners();

start();

function resize() {
    display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.width / game.world.height);
    display.render();
}

function render() {
    display.fillColor(game.world.backgroundColor);
    display.drawRect(game.world.player);

    game.world.bullets.forEach((b) => {display.drawRect(b)});

    display.render();
}

function update(time) {
    game.world.player.moveX(controller.left.active, controller.right.active);
    game.world.player.moveY(controller.up.active, controller.down.active);

    game.update(time);
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
