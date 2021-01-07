"use strict";

import {Engine} from "./Engine.js";
import {Game} from "./Game.js";
import {Controller} from "./Controller.js";
import {Display} from "./Display.js";

// MVC Components, game = model

let settings = {
    fps: 60,
}

let game = new Game();
let display = new Display(document.getElementById("gameScreen"));
let controller = new Controller();

let engine = new Engine(1000/settings.fps, update, render);

addEventListeners();

start();

function resize() {
    display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.width / game.height);
    display.render();
}

function render() {
    display.fillColor(game.backgroundColor);
    display.drawRect(game.player);
    display.render();
}

function update(time) {
    game.player.moveX(controller.left.active, controller.right.active);
    game.player.moveY(controller.up.active, controller.down.active);

    game.update(time);
}

function addEventListeners() {
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", controller.keyDownUp);
    window.addEventListener("keyup", controller.keyDownUp);
}

function start() {
    display.setBufferSides(game.width, game.height);
    resize();
    engine.start();
}