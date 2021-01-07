export {Controller};

class Controller {

    down = new Controller.ButtonInput();
    left = new Controller.ButtonInput();
    right = new Controller.ButtonInput();
    up = new Controller.ButtonInput();

    keyDownUp = (event) => {
        let down = event.type === "keydown"; // or "keyup" (false)

        switch (event.keyCode) {
            case 37: this.left.getInput(down); break;
            case 38: this.up.getInput(down); break;
            case 39: this.right.getInput(down); break;
            case 40: this.down.getInput(down); break;
        }
    }
}

Controller.ButtonInput = class {

    down = false;
    active = false;

    getInput = (down) => {
        this.active = down;
    }
}