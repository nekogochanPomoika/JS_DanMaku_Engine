"use strict";

import {TextureTemplates} from "./Game/World/Templates.js";

TextureTemplates.onReady.push(() => {
    const {engine} = require("./Engine");
    const {game} = require("./Game");
    const {controller} = require("./Controller");
    const {display} = require("./Display");

    // MVC Components, game = model

    let settings = {
        fps: 60,
    }

    init();
    addEventListeners();
    start();

    function init() {
        display.init(document.getElementById("gameScreen"), game.world.width, game.world.height);
        engine.init(1000 / settings.fps, update, render);
    }

    function addEventListeners() {
        window.addEventListener("resize", resize);
        window.addEventListener("keydown", controller.keyDownUp);
        window.addEventListener("keyup", controller.keyDownUp);
    }

    function start() {
        display.setThreeSize(game.world.width, game.world.height);
        resize();
        engine.start();
    }

    function resize() {
        display.resize(document.documentElement.clientWidth - 32,
            document.documentElement.clientHeight - 32,
            game.world.width / game.world.height);
    }

    function render() {
        display.render();
    }

    function update(time) {
        game.world.player.moveX(controller.left.active, controller.right.active);
        game.world.player.moveY(controller.up.active, controller.down.active);
        game.world.player.isShooting = controller.z.active;
        game.update(time);
    }
});