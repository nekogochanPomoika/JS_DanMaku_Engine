export {Controller};

class Controller {

    down = new Controller.ButtonInput();
    left = new Controller.ButtonInput();
    right = new Controller.ButtonInput();
    up = new Controller.ButtonInput();

    keyDownUp = (event) => {
        let down = event.type === "keydown";

        switch (event.keyCode) {
            case 37: this.left.getInput(down); break;
            case 38: this.left.getInput(down); break;
            case 39: this.left.getInput(down); break;
            case 40: this.left.getInput(down); break;
        }

        console.log(`key ${event.keyCode} has been pressed`);
    }

    handleKeyDownUp = (event) => {
        this.keyDownUp(event);
    }

}

Controller.ButtonInput = class {

    down = false;
    active = false;

    getInput = (down) => {
        if (this.down !== down) this.active = down;
        this.down = this.active;
    }

}