class Player extends Population {

    constructor(gps) {
        super();
        this.size = player_size;
        this.max_size = player_size_max;
        for (let x = 0; x < this.size; x++) {
            this.animals.push(new Animal());
        }

        //animalに依存する値だから親クラスで呼べない
        this.avg = super.calcAvg();
        this.max = super.calcMax();
        this.min = super.calcMin();

        this.ethics = {
            egalitarian: 1,
            polygamy: 1,
            militarist: 1,
            xenophile: 1,
            innovative: 1,
            chaos: 1
        };

        this.dignified_ethic = "";
        this.inventory = "";

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
        ellipseMode(CENTER)
        fill(201, 87, 115);
        ellipse(this.gps.x * cell_size, this.gps.y * cell_size, cell_size * 0.8, cell_size * 0.8);
        if (this.buffed) {
            fill(255, 255, 66);
            star(this.gps.x * cell_size, this.gps.y * cell_size, 30 / 6, 70 / 6, 5);
            // star(0, 0, 30, 70, 5);
        }
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

    setNextChildren(scale) {
        this.next_children = scale ? this.next_children + scale : 0;
        $("#next-children").html(`Children: +${this.next_children}`);
    }

    setEthics(ethic, scale) {

        if (this.dignified_ethic == ethic || this.dignified_ethic == ethics_pool[ethic]) {
            return false;
        } else {
            this.ethics[ethic] += scale;

            let number = this.ethics[ethic];
            // 上限突破
            if (number <= 0 || number >= 10) {

                // 初のmax到達。dignified_ethicの獲得とitemの獲得
                if (this.dignified_ethic == "") {
                    if (number >= 10) {
                        this.dignified_ethic = ethic;
                    } else {
                        this.dignified_ethic = ethics_pool[ethic];
                    }
                    this.getLegendaryItem();
                    this.modifyFitnesCoefficient();


                    // min maxを0,10に制限
                } else if (number < 0) {
                    this.ethics[ethic] = 0;
                } else if (number > 10) {
                    this.ethics[ethic] = 10;
                }
            }
        }
    }

    getLegendaryItem() {
        // inventoryにアイテムが入る
        $(legendary_items).find("item").each((index, element) => {
            $(element).find("related_ethics").find("ethic").each((ind, ele) => {
                if ($(ele).text() == this.dignified_ethic) {
                    this.inventory = $(element).find("name").text();
                    return false;
                }
            })
        })

        // ethicを固定化

    }

    modifyFitnesCoefficient() {

    }
}