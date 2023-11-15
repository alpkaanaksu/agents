exposed.turn = 10;
exposed.step = 5;

// Set seed for reproducibility
// Avoid when doing multiple runs!
utils.setSeed("agent based models")

class Food extends Thing {
    nutritionalValue = 1;
    size = { x: 10, y: 10 }
    color = "green"
}

class SuperFood extends Food {
    nutritionalValue = 10;
    color = "orangered"
}

class Sheep extends Agent {
    foodReservoir = utils.random(1, 100);
    waterReservoir = utils.random(1, 100);
    size = 40;
    visual = "https://www.svgrepo.com/show/24608/sheep.svg";

    tick() {
        this.right(exposed.turn);
        this.go(exposed.step);
        
        this.foodReservoir -= 0.5;
        this.waterReservoir -= 0.5;
        
        if (this.foodReservoir <= 0 || this.waterReservoir <= 0) {
            this.die();
        }
    }
}


env.add(10, Sheep);

env.onTick(() => {
    if(utils.p(5)) {
        environment.add(5, Food);
        environment.add(1, SuperFood);
    }
});