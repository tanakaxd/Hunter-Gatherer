// シーンの遷移を担当するクラス
// ゲーム状況に応じて、 canvas内に描写する要素をスイッチするギミック

class SceneManager {

    constructor() {
        // どの要素を描画するか
        //canvas
        this.global_map_scene = true;
        this.animals = true;
        this.habitant = true;
        this.local_map_scene = false;
        this.event_scene = false;

        //DOM
        // this.buttons = true;
        // this.sliders = true;
        // this.logs = true;
        // this.dialog = true;
        // this.info_scene = true;
    }

    changeScene() {

    }

    displayTooltips() {

    }

    run() {
        if (this.global_map_scene) {
            global_map.show();
            population.show();
        }
        if (this.animals) {
            for (let animal of population.animals) {
                animal.show();
                animal.r.show();
                animal.showHealth();
            }
        }
        if (this.habitant) {
            for (let animal of global_map.getTerrain(population.gps).habitant.animals) {
                animal.show();
                animal.r.show();
            }
        }
    }
}