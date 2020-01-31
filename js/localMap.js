class LocalMap {
    constructor(noise, x, y) {
        this.geography = noise;
        this.color = noise * 255;
        this.xy = createVector(x, y); //セル座標
        this.herbifood;
        this.carnifood;
        this.ecologial_density;
        this.visited = false;
        this.fog = true;
        this.traversable;
        this.selectable = true;
        this.accessible = false;
    }

    converToGeography(noise) {

    }
}