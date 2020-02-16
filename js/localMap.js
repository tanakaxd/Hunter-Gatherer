// 湿度、気温、標高の三つのノイズで一つのタイルとカテゴライズする
// 例えばツンドラにカテゴライズされたら、ツンドラ基準の食料、生態系密度からガウス分布でランダム生成

class LocalMap {

    constructor(humidity, temperature, x, y) {

        this.cellHeight = cell_size;
        this.cellWidth = cell_size;
        this.clr = 255;
        this.xy = createVector(x, y); //セル座標
        // this.altitude;
        this.humidity = humidity * 100;
        this.temperature = map(temperature, 0, 1, -10, 50);
        this.geography = this.convertToGeography(this.humidity, this.temperature);

        // = easy_envi ? 50 : 15;
        this.meats;
        this.berries;
        this.fishes;
        this.habitant = new Habitant(this.xy);

        this.accessible = false;
        this.fog = true;
        this.nest = false;
        this.visited = false;
        this.hunted = 0;

        // this.traversable = true;
        // this.selectable = true;
        this.setFoods();
        this.ecological_density = this.calcEcoDensity(); //habitantの人口によって動的に変化させる？
    }

    convertToGeography(humidity, temperature) {
        let geography = "";

        if (temperature > 30) {
            if (humidity > 60) {
                geography = "jungle";
                this.clr = color(39, 80, 48);
            } else if (60 > humidity && humidity > 30) {
                geography = "savanna";
                this.clr = color(200, 222, 73);
            } else {
                geography = "desert";
                this.clr = color(245, 225, 144);
            }
        } else if (30 > temperature && temperature > 10) {
            if (humidity > 60) {
                geography = "forest";
                this.clr = color(95, 156, 26);
            } else if (60 > humidity && humidity > 30) {
                geography = "grassland";
                this.clr = color(149, 230, 62);
            } else {
                geography = "plain";
                this.clr = color(219, 186, 88);
            }
        } else {
            if (humidity > 60) {
                geography = "taiga";
                this.clr = color(47, 214, 122);
            } else if (60 > humidity && humidity > 30) {
                geography = "tundra";
                this.clr = color(145, 207, 191);
            } else {
                geography = "ice";
                this.clr = color(225, 245, 244);
            }
        }
        return geography; //e.g. "tundra" "jungle"
    }

    setFoods() {
        let $data = this.retreiveFoodsData(this.geography);
        let plus = easy_envi ? 30 : 0;
        this.berries = randomGaussian($data.find("berries").text() - plus, 4); //text()は文字列を返す
        this.meats = randomGaussian($data.find("meats").text() - plus, 4);
        this.fishes = randomGaussian($data.find("fishes").text() - plus, 4);
    }

    retreiveFoodsData(climate) {
        let data_set;
        $(geography_data).find("item").each((index, element) => {
            if ($(element).find("name").text() == climate) {
                data_set = $(element);
            }
        })
        return data_set;
    }

    calcEcoDensity() {
        let density = 0;
        density = (this.berries + this.meats + this.fishes) / 3;
        density = map(density, 0, 30, 0, 2);
        return density;
    }

    renew() {

    }

    display() {
        if (global_map.night) {
            fill(30);
        } else if (this.fog) {
            fill(235);
        } else {
            fill(this.clr);
        }
        rect(this.xy.x * this.cellWidth, this.xy.y * this.cellWidth, this.cellHeight, this.cellWidth);
        if (this.nest) {
            fill(0);
            rect(this.xy.x * this.cellWidth, this.xy.y * this.cellWidth, this.cellHeight / 2, this.cellWidth / 2)
        }
        if (this.visited) {
            push();
            translate(this.cellHeight / 2, this.cellWidth / 2);
            image(footprint, this.xy.x * this.cellWidth, this.xy.y * this.cellWidth, this.cellHeight / 2, this.cellWidth / 2)
            pop();
        }
    }
}