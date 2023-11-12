const randomNumber = (max) => Math.floor(Math.random() * max);

export class Environment {
    dimensions;
    agents = [];
    state = {};
    center;
    ticks = 0;

    constructor(dimensions) {
        this.dimensions = dimensions;
        this.center = {
            x: dimensions.x / 2,
            y: dimensions.y / 2
        }
    }

    add(agent) {
        this.agents.push(agent);
    }

    randomPosition() {
        return {
            x: randomNumber(this.dimensions.x),
            y: randomNumber(this.dimensions.y),
        };
    }

    randomOrientation() {
        return randomNumber(360);
    }

    addMultiple(n, creator) {
        for(let i = 0; i < n; i++) {
            this.add(creator());
        }
    }
}

export class Agent {
    position;
    visual;
    orientation = 0;

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

    forward(units) {
        const unit = this.unit();
        
        this.position.x += units * unit.x;
        this.position.y += units * unit.y; 
    }

    unit() {
        return {
            x: Math.cos(this.orientation),
            y: Math.sin(this.orientation)
        };
    }
}

/**
 * 
 * @param {string} url 
 * @returns {string} svg
 */
export const svgFromUrl = async (url) => {
    const request = fetch(url);
    const svg = (await request).text();

    return svg;
}