class Sheep extends Agent {
    foodReservoir = utils.random(1, 100);
    waterReservoir = utils.random(1, 100);
    
    visual = "https://www.svgrepo.com/show/24608/sheep.svg";

    tick() {
        this.right(10);
        this.go(10);
    }
}


env.add(10, Sheep);
