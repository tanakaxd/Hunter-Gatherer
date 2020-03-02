class Habitant extends Population {

    constructor(gps) {
        super();
        this.size = habitant_size;
        for (let x = 0; x < this.size; x++) {
            this.animals.push(new Animal());
        }

        //animalに依存する値だから親クラスで呼べない
        this.avg = this.calcAvg();
        this.max = this.calcMax();
        this.min = this.calcMin();

        this.gps = gps;
        super.setPosition(555);
    }

    evolve() {
        super.naturalSelection();
        super.evaluate();
        super.sexualSelection();
    }
}