class Player extends Population {


    constructor(gps) {
        super();
        this.size = 20;
        for (let x = 0; x < this.size; x++) {
            this.animals.push(new Animal());
        }

        //animalに依存する値だから親クラスで呼べない
        this.avg = this.calcAvg();
        this.max = this.calcMax();
        this.min = this.calcMin();

        this.gps = gps || createVector(floor(map_size / 2), floor(map_size / 2));
        this.clearFog(this.gps);
        this.adjustSlider();
        super.setPosition();
    }


    move(p) {
        this.gps = p;
        this.on_what_terrain = global_map.getTerrain(this.gps);
        this.clearFog(this.gps);

    }

    clearFog(p) {
        global_map.terrain[p.x][p.y].fog = false;
    }

    static clearAllFog() {
        for (let y = 0; y < map_size; y++) {
            for (let x = 0; x < map_size; x++) {
                global_map.terrain[x][y].fog = false;
            }
        }
    }


    show() {
        //translateを使った方がいいかもしれない
        fill(100, 255, 100);
        ellipseMode(CORNER)
        ellipse(this.gps.x * cell_size, this.gps.y * cell_size, cell_size, cell_size);
    }

    adjustSlider() {
        for (let key in this.ethics) {
            $("#" + key).val(this.ethics[key]);
        }
    }


}