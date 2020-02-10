// 湿度、気温、標高の三つのノイズで一つのタイルとカテゴライズする
// 例えばツンドラにカテゴライズされたら、ツンドラ基準の食料、生態系密度からガウス分布でランダム生成

class LocalMap {
    constructor(noise, x, y) {
        this.geography = noise;
        this.color = noise * 255;
        this.xy = createVector(x, y); //セル座標

        //
        this.berries = 10;
        this.meats = 10;
        this.fishes = 10;
        this.ecological_density = 1;
        // this.enemy = 1;
        this.habitant = new Habitant(this.xy);

        this.accessible = false;
        this.fog = true;

        // this.visited = false;
        // this.traversable = true;
        // this.selectable = true;
    }

    convertToGeography(noise) {

    }
}