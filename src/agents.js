import { alea } from "seedrandom";

class Utils {
    prng = new alea(Math.random().toString());

    seed(s) {
        this.prng = new alea(s);
    }

    randomNumber(max) {
        return Math.floor(this.prng() * max);
    }

    random(lower, upper) {
        return lower + this.randomNumber(upper - lower + 1);
    }

    p(probability) {
        return this.random(0, 100) <= probability;
    }
}

export class Environment {
    utils = new Utils();
    dimensions;
    agents = [];
    things = [];
    state = {};
    center;
    ticks = 0;
    tickEvents = [];
    track = [];
    tracked = [];

    constructor(dimensions) {
        this.dimensions = dimensions;
        this.center = {
            x: dimensions.x / 2,
            y: dimensions.y / 2
        }
    }

    addOne(obj) {
        if (typeof (obj) === "function") {
            try {
                this.addOne(new obj(this.randomPosition(), this.randomOrientation()));
            } catch (err) {
                // verify err is the expected error and then
                if (err.message.indexOf('is not a constructor') >= 0) {
                    this.addOne(obj());
                }
            }
        }

        else if (obj instanceof Agent) {
            this.agents.push(obj);
        }

        else if (obj instanceof Thing) {
            this.things.push(obj);
        }
    }

    randomPosition() {
        return {
            x: this.utils.random(0, this.dimensions.x),
            y: this.utils.random(0, this.dimensions.y),
        };
    }

    randomOrientation() {
        return this.utils.randomNumber(360);
    }

    add(n, creator) {
        for (let i = 0; i < n; i++) {
            this.addOne(creator);
        }
    }

    tick() {
        this.agents.forEach((agent) => {
            if (agent.alive) {
                agent.tick();
            }
        });

        this.tickEvents.forEach(event => event());

        for (let key in this.track) {
            if (this.tracked[key] === undefined) {
                this.tracked[key] = [];
            }
            
            this.tracked[key].push(this.track[key]());
        }
    }

    onTick(event) {
        this.tickEvents.push(event);
    }

    all(constructor) {
        const agents = this.agents.filter((agent) => agent instanceof constructor);
        const things = this.things.filter((thing) => thing instanceof constructor);

        return agents.concat(things);
    }
}

export class Agent {
    position;
    visual;
    color;
    size = 30;
    orientation = 0;
    alive = true;

    /**
     * 
     * @param {{x: number, y: number}} position position of the agent
     * @param {number} position.x x coordinate of the agent
     * @param {number} position.y y coordinate of the agent
     */
    constructor(position, orientation) {
        this.position = position;
        this.orientation = orientation ?? 0;
    }

    right(degrees) {
        this.orientation += degrees;

        if (this.orientation > 360) {
            this.orientation -= 360;
        }
    }

    left(degrees) {
        this.orientation -= degrees;

        if (this.orientation < 0) {
            this.orientation = 360 - this.orientation;
        }
    }

    go(units) {
        const unit = this.unit();

        this.position.x += units * unit.x;
        this.position.y += units * unit.y;
    }

    unit() {
        const radian = this.orientation * (Math.PI / 180);
        return {
            x: Math.cos(radian),
            y: Math.sin(radian)
        };
    }

    die() {
        this.alive = false;
    }
}

export class Thing {
    position;
    visual;
    color;
    size;

    constructor(position) {
        this.position = position;
    }

}