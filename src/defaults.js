export const sheepCode = `
exposed.orientation = 0;
exposed.speed = 0;

class Sheep extends Agent {
    constructor(position, orientation) {
        super(position, orientation);

        super.visual = "https://www.svgrepo.com/show/24608/sheep.svg";
    }

    tick() {
        this.orientation = exposed.orientation;
        this.forward(exposed.speed);
    }
}

environment.add(new Sheep(environment.center, environment.randomOrientation()));
`;
