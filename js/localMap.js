class LocalMap {
    constructor(noise, x, y) {
        this.geography = noise;
        this.color = noise * 255;
        this.xy = createVector(x, y); //セル座標
        this.herbifood = 100;
        this.carnifood = 100;
        this.ecologial_density = 100;
        this.visited = false;
        this.fog = true;
        this.traversable;
        this.selectable = true;
        this.accessible = false;

    }

    converToGeography(noise) {

    }
}