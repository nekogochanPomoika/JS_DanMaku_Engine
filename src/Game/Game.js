// some logic for show that engine works fine
export {Game};

class Game {

    world;

    /**
     * @param world = World.class
     */
    init = (world) => {
        this.world = world;
    }


    update = (time) => {
        this.world.update(time);
    }
}
