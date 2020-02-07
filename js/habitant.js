class Habitant extends Population {


    constructor(gps) {
        super();
        this.animals = [];
        this.size = 4;
        for (let x = 0; x < this.size; x++) {
            this.animals.push(new Animal());
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
        this.gps = gps;
        //現在地のlocalmapオブジェクトを取得
        //localmapをpopulationが持っていて、populationがlocalmapを持っているのは変？
        //population.gpsはあるので、計算に必要な時にはその都度取得すべきか
        // this.on_what_terrain = global_map.getTerrain(this.gps);
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
        };
        for (let i = 0; i < 3; i++) {
            // console.table(this.animals[0].dna.genes);

            this.evaluate();
            this.sexualSelection();
        }
    }

    naturalSelection() {

    }
}