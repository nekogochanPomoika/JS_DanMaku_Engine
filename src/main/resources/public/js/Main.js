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

function render() {
    display.renderColor(game.color);
    display.render();
}

function update(time) {
    game.update(time);
}

function addEventListeners() {
    window.addEventListener("resize", display.handleResize);
    window.addEventListener("keydown", controller.handleKeyDownUp);
    window.addEventListener("keyup", controller.handleKeyDownUp);
}

function start() {
    display.resize();
    engine.start();
}