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
        this.go(exposed.speed);
    }
}

environment.add(new Sheep(environment.center, environment.randomOrientation()));
`;

export const herrErwin = `

exposed.foodDecreaseRate = 0.5;
exposed.waterDecreaseRate = 0.5;

exposed.activeFoodDecreaseRate = 2;
exposed.activeWaterDecreaseRate = 2;

exposed.eatingRate = 3;
exposed.drinkingRate = 3;

class Water extends Thing {
    constructor(position) {
        super(position);
        
        this.size = {x: 40, y: 40};
        this.color = "aqua";
    }
    
    interact(agent) {
        agent.drink();
    }
}

class Food extends Thing {
    constructor(position) {
        super(position);
        
        this.size = {x: 40, y: 40};
        this.color = "green";
    }
    
    interact(agent) {
        agent.eat();
    }
}

class HerrErwin extends Agent {
    food = 100;
    water = 100;
    
    constructor(position, orientation) {
        super(position, orientation);

        this.visual = "https://www.svgrepo.com/show/452885/donkey.svg";
        
        this.size = 50;
    }
    
    levels(n) {
        if (n <= 30)
            return "P";
        if (n >= 90)
            return "M";
        return "KP";
    }
    
    eat() {
        this.food += exposed.eatingRate;
        
        if (this.food > 100) {
            this.food = 100;
        }
    }
    
    drink() {
        this.water += exposed.drinkingRate;
        
        if (this.water > 100) {
            this.water = 100;
        }
    }

    tick() {
        this.right(10);
        this.go(20);
        
        this.food -= exposed.foodDecreaseRate;
        this.water -= exposed.waterDecreaseRate;
        
        if (this.food <= 0 || this.water <= 0) {
            this.die();
        }
    }
}

environment.add(new HerrErwin(environment.center));

environment.add(new Water({
    x: environment.center.x + 300,
    y: environment.center.y
}));

environment.add(new Food({
    x: environment.center.x - 300,
    y: environment.center.y
}));

`;
