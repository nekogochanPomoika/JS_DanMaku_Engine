export {Game};

// some logic for show that engine works fine
class Game {

    color = "rgb(0,0,0)";
    colors = [0,0,0];
    multipliers = [3,4,5];

    update = () => {
        for (let i = 0; i < 3; i++) {
            this.colors[i] += Math.floor((Math.random() * this.multipliers[i]));
            this.colors[i] %= 512;
        }

        let r = Math.abs(256 - this.colors[0]);
        let g = Math.abs(256 - this.colors[1]);
        let b = Math.abs(256 - this.colors[2]);

        this.color = `rgb(${r},${g},${b})`;
    }
}