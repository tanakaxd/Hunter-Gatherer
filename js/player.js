class Player extends Population {


    constructor(gps) {
        super();
        this.animals = [];
        this.size = 4;
        for (let x = 0; x < this.size; x++) {
            this.animals.push(new Animal(createVector(50 + x * 75, 60), null));
        }
        this.leaders = [];
        this.matingpool = [];
        this.generation = 0;
        this.average = {
            "equality": 2,
            "hunting": 6,
            "negotiation": 3
        };
        this.max = {
            "equality": 7,
            "hunting": 9,
            "negotiation": 6
        };
        this.min = {
            "equality": 1,
            "hunting": 3,
            "negotiation": 2
        };
        this.gps = gps || createVector(floor(map_size / 2), floor(map_size / 2));
        //現在地のlocalmapオブジェクトを取得
        //localmapをpopulationが持っていて、populationがlocalmapを持っているのは変？
        //population.gpsはあるので、計算に必要な時にはその都度取得すべきか
        // this.on_what_terrain = global_map.getTerrain(this.gps);
        this.clearFog(this.gps);
        this.rested = 0;
        this.ethics = {
            //jsでは連想配列のkeyに""があってもなくても同じ。jsonは必須
            "egalitarian": random() * 10,
            polygamy: random() * 10,
            pacifist: random() * 10,
            xenophile: random() * 10,
            innovative: random() * 10,
            order: random() * 10
        };
        //例えばhuntingの高さを集団が重要視する。ethicsと同列の役割？
        this.fitness_coefficient = {
            "hunting": 1,
            "foraging": 1,
            "swimming": 1,

            "hiding": 1,
            "fighting": 1,
            "fleeing": 1,

            "negotiation": 1,
            "deception": 1,
            "attraction": 1,

            "equality": 1,
            "lust": 1,
            "aggressivity": 1,
            "open-minded": 1,
            "curiosity": 1,
            "independency": 1
        }
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

    naturalSelection() {
        for (var i = 0; i < this.animals.length; i++) {
            this.animals[i].calcHealth(global_map.getTerrain(this.gps));
        }
    }

}