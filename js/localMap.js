class LocalMap {
    constructor(noise, x, y) {
        this.geography = noise;
        this.color = noise * 255;
        this.xy = createVector(x, y); //セル座標

        this.berries = 20;
        this.meats = 20;
        this.fishes = 20;
        this.ecological_density = 1;
        this.enemy = 1;
        this.habitant = new Habitant(this.xy);

        this.visited = false;
        this.fog = true;
        this.traversable;
        this.selectable = true;
        this.accessible = false;

    }

    converToGeography(noise) {

    }
}