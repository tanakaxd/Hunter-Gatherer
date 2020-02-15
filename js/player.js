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

        this.ethics = {
            egalitarian: 5,
            polygamy: 5,
            pacifist: 5,
            xenophile: 5,
            innovative: 5,
            order: 5
        };

        this.gps = gps || createVector(floor(map_size / 2), floor(map_size / 2));
        this.rested = 2;
        this.buffed = false; //次のイベントで全ての選択肢をとれる
        this.next_children = 0;
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                let offset = p5.Vector.add(this.gps, createVector(x, y));
                this.clearFog(offset);
            }
        }
        this.clearFog(this.gps);
        this.visit();
        this.adjustSlider();
        super.setPosition();
        global_map.getTerrain(this.gps).nest = true;
    }

    move(p) {
        this.gps = p;
        this.clearFog(this.gps);
        this.visit();
        global_map.examineAccessibility(this.gps);
        addlog(`(${this.gps.x + 1},${this.gps.y + 1})へ移動しました`);
        mp3_move.play();
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
        fill(201, 87, 115);
        ellipseMode(CENTER)
        ellipse(this.gps.x * cell_size, this.gps.y * cell_size, cell_size * 0.8, cell_size * 0.8);
        pop();
    }

    adjustSlider() {
        for (let key in this.ethics) {
            $("#" + key).val(this.ethics[key]);
        }
    }

    rest(scale) {
        this.rested += scale || 1;
        for (let animal of this.animals) {
            animal.health += global_map.getTerrain(this.gps).nest ? 0.5 : 0.25;
            if (animal.health > 1) animal.health = 1;
        }
        $("#rest").html(`Rest: ${this.rested}`);

    }

    visit() {
        global_map.getTerrain(this.gps).visited = true;
    }
}