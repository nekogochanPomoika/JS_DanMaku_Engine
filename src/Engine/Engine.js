
/* This is a fixed time step game loop. It can be used for any game and will ensure
that game state is updated at the same rate across different devices which is important
for uniform gameplay. Imagine playing your favorite game on a new phone and suddenly
it's running at a different speed. That would be a bad user experience, so we fix
it with a fixed step game loop. In addition, you can do things like frame dropping
and interpolation with a fixed step loop, which allow your game to play and look
smooth on slower devices rather than freezing or lagging to the point of unplayability. */

export {Engine};

class Engine {

    #accumulatedTime = 0;
    #animationFrameReq;
    #time;
    #timeStep;

    #updated = false;

    #update;
    #render;

    init = (timeStep, update, render) => {
        this.#timeStep = timeStep;
        this.#update = update;
        this.#render = render;
    }

    #run = (timeStamp) => {
        this.#accumulatedTime += timeStamp - this.#time;
        this.#time = timeStamp;

        if (this.#accumulatedTime >= this.#timeStep * 3) this.#accumulatedTime = this.#timeStep;

        while (this.#accumulatedTime >= this.#timeStep) {
            this.#accumulatedTime -= this.#timeStep;
            this.#update(timeStamp);
            this.#updated = true;
        }

        if (this.#updated) {
            this.#updated = false;
            this.#render(timeStamp);
        }

        this.#animationFrameReq = window.requestAnimationFrame(this.#run);
    }

    start = () => {
        this.#accumulatedTime = this.#timeStep;
        this.#time = window.performance.now();
        this.#animationFrameReq = window.requestAnimationFrame(this.#run);
    }

    stop = () => {
        cancelAnimationFrame(this.#animationFrameReq);
    }


}