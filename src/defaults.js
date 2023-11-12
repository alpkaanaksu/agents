export const sheepCode = `
class Sheep extends Agent {
    constructor(position, orientation) {
        super(position, orientation);

        super.visual = "https://www.svgrepo.com/show/24608/sheep.svg";
    }

    tick() {
        this.right(0.3);
        this.forward(30);
    }
}

environment.add(new Sheep(environment.center, environment.randomOrientation()));
`;
