// 例えば10×10のタイル。
// タイルごとに気候条件を決める
// 雪原、 ツンドラ、 砂漠、 ジャングル、 草原
// perlinnoiseを利用してなだらかにしたい
// データは別に作る？ jsonとかで

// マップの内部データと、 描画
// 自動生成
// fog of war
// クリックした位置に移動するギミック。 現在地から左右上下のみ。


class GlobalMap {

    constructor() {

        this.cols = map_size;
        this.rows = map_size;
        this.increment = 0.15;
        //localmapの2d配列
        this.terrain = this.generateTerrain(this.cols, this.rows);
        this.night = false;

        // this.local_tiles = [];
        // this.potential_tiles = [];
    }


    make2Darray(cols, rows) {
        let array = new Array(cols);
        for (let i = 0; i < array.length; i++) {
            array[i] = new Array(rows);
        }
        return array;
    }

    generateTerrain(cols, rows) {
        let terrain = this.make2Darray(cols, rows);
        let yoff = 0;
        for (let y = 0; y < rows; y++) {
            let xoff = 0;
            for (let x = 0; x < cols; x++) {
                terrain[x][y] = new LocalMap(noise(xoff, yoff), noise(xoff + 1000000, yoff + 1000000), x, y);
                // terrain[x][y] = noise(xoff, yoff) * 255;
                xoff += this.increment;
            }
            yoff += this.increment;
        }
        return terrain;
    }

    show() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.terrain[x][y].display();
            }
        }
    }

    // クリックされた座標をマップ上のセル座標に変換
    convertToCellCordinate(p) {
        let cell_cordinate = createVector(floor(p.x / cell_size), floor(p.y / cell_size));
        return cell_cordinate;
    }

    //　セル座標が実在するかチェック
    verifyCell(p) {
        let a = (0 <= p.x && p.x < map_size);
        let b = (0 <= p.y && p.y < map_size);
        return a && b;
    }

    //現在地から移動可能なタイルであるか確認しフラグを処理
    examineAccessibility(p) {
        for (let y = 0; y < map_size; y++) {
            for (let x = 0; x < map_size; x++) {
                this.terrain[x][y].accessible = false;
            }
        }
        if (this.verifyCell(createVector(p.x - 1, p.y))) {
            this.terrain[p.x - 1][p.y].accessible = true;
        }
        if (this.verifyCell(createVector(p.x + 1, p.y))) {
            this.terrain[p.x + 1][p.y].accessible = true;
        }
        if (this.verifyCell(createVector(p.x, p.y + 1))) {
            this.terrain[p.x][p.y + 1].accessible = true;
        }
        if (this.verifyCell(createVector(p.x, p.y - 1))) {
            this.terrain[p.x][p.y - 1].accessible = true;
        }
    }

    getTerrain(p) {
        return this.terrain[p.x][p.y];
    }
    //javascriptではoverload不可
    // getTerrain(x, y) {
    //     return this.terrain[x][y];
    // }
}