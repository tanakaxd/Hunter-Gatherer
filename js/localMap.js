// 湿度、気温、標高の三つのノイズで一つのタイルとカテゴライズする
// 例えばツンドラにカテゴライズされたら、ツンドラ基準の食料、生態系密度からガウス分布でランダム生成

class LocalMap {
    constructor(noise, x, y) {
        this.geography = noise;
        this.color = noise * 255;
        this.xy = createVector(x, y); //セル座標

        //
        this.berries = easy_envi ? 30 : 10;
        this.meats = easy_envi ? 30 : 10;
        this.fishes = easy_envi ? 30 : 10;
        this.ecological_density = 1; //habitantの人口によって動的に変化させる？
        // this.enemy = 1;
        this.habitant = new Habitant(this.xy);

        this.accessible = false;
        this.fog = true;
        this.nest = false;

        // this.visited = false;
        // this.traversable = true;
        // this.selectable = true;
    }

    convertToGeography(noise) {

    }
}