class Habitant extends Population {


    constructor(gps) {
        super();
        this.size = 15;
        for (let x = 0; x < this.size; x++) {
            this.animals.push(new Animal());
        }
        //animalに依存する値だから親クラスで呼べない
        this.avg = this.calcAvg();
        this.max = this.calcMax();
        this.min = this.calcMin();
        this.gps = gps;
        super.setPosition(); //overrideしたメソッド
    }

    //override。このメソッドはsexualSelection内でも呼び出されるので、その時にposの値がplayerとhabitantで同じになってしまう。
    //sexualselectionの内部で分岐させるか、そもそも別のメソッドとしてoverrideするか
    // setPosition() {
    //     //habitantの時はoffset分下にずらす？
    //     //animalのpos、判定用のrectangleのpos、クリックした場所のpos
    //     let row = 0;
    //     let col = 0;
    //     let yoffset = 555;
    //     for (let i = 0; i < this.animals.length; i++) {
    //         if (i != 0 && i % pops_col == 0) {
    //             row++;
    //             col = 0;
    //         }
    //         let map_width = cell_size * map_size;
    //         let offset = pops_cell / 2; //顔の中心点が角の上にくるのを補正する値。
    //         this.animals[i].pos = createVector(map_width + (offset + col * pops_cell) / pops_scale, (offset + row * pops_cell + yoffset) / pops_scale);

    //         let pos = this.animals[i].pos;
    //         let wh = this.animals[i].wh;
    //         this.animals[i].r = new Rectangle(pos.x, pos.y, wh, wh);
    //         col++;
    //     }
    // }


    evolve() {
        for (let i = 0; i < 3; i++) {
            // console.table(this.animals[0].dna.genes);
            // console.log(this);

            super.naturalSelection();
            super.evaluate();
            super.sexualSelection();
        }
    }
}