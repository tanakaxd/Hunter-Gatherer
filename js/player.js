class Player extends Population {

    constructor(gps) {
        super();
        this.size = player_size;
        for (let x = 0; x < this.size; x++) {
            this.animals.push(new Animal());
        }

        //animalに依存する値だから親クラスで呼べない
        this.avg = super.calcAvg();
        this.max = super.calcMax();
        this.min = super.calcMin();

        this.gps = gps || createVector(floor(map_size / 2), floor(map_size / 2));
        this.rested = 0;
        this.buffed = false;
        this.clearFog(this.gps);
        this.adjustSlider();
        super.setPosition();
    }

    move(p) {
        this.gps = p;
        this.clearFog(this.gps);
        addlog(`(${this.gps.x+1},${this.gps.y+1})へ移動しました`);
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
        push();
        translate(cell_size / 2, cell_size / 2);
        fill(100, 255, 100);
        ellipseMode(CENTER)
        ellipse(this.gps.x * cell_size, this.gps.y * cell_size, cell_size, cell_size);
        pop();
    }

    adjustSlider() {
        for (let key in this.ethics) {
            $("#" + key).val(this.ethics[key]);
        }
    }

    rest(scale) {
        this.rested += scale | 1;
        console.log("rested");
        $("#rest").html(`Rest: ${this.rested}`)

    }
}