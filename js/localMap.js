class LocalMap {
    constructor(noise, x, y) {
        this.geography = noise;
        this.color = noise * 255;
        this.xy = createVector(x, y); //セル座標

        this.berries = 20;
        this.meats = 20;
        this.fishes = 20;
        this.ecologial_density = 20;
        this.enemy = 20;
        this.inhabitant = new Habitant(this.xy);

        this.visited = false;
        this.fog = true;
        this.traversable;
        this.selectable = true;
        this.accessible = false;

    }

    converToGeography(noise) {

    }
}