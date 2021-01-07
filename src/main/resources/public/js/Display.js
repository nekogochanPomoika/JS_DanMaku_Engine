export {Display};

/* This Display class contains the screen resize event handler and also handles
drawing colors to the buffer and then to the display. */

class Display {

    #buffer = document.createElement("canvas").getContext("2d");
    #context;

    constructor(canvas) {
        this.#context = canvas.getContext("2d");
    }

    setBufferSides = (width, height) => {
        this.#buffer.canvas.width = width;
        this.#buffer.canvas.height = height;
    }

    fillColor = (color) => {
        this.#buffer.fillStyle = color;
        this.#buffer.fillRect(0, 0, this.#buffer.canvas.width, this.#buffer.canvas.height);
    }

    /**
     * @param rect = {
     *     x, y, width, height, color
     * }
     */
    drawRect = (rect) => {
        this.#buffer.fillStyle = rect.color;
        this.#buffer.fillRect(rect.x, rect.y, rect.width, rect.height);
    }

    render = () => {
        this.#context.drawImage(
            this.#buffer.canvas,
            0, 0, this.#buffer.canvas.width, this.#buffer.canvas.height,
            0, 0, this.#context.canvas.width, this.#context.canvas.height
        );
    }

    resize = (width, height, aspectRatio) => {
        if (width / height > aspectRatio) {
            this.#context.canvas.width = height * aspectRatio;
            this.#context.canvas.height = height;
        } else {
            this.#context.canvas.width = width;
            this.#context.canvas.height = width / aspectRatio;
        }
        this.#context.imageSmoothingEnabled = false;
    }
}