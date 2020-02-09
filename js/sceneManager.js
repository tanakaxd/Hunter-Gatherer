// グローバルマップ
// ローカルマップ
// イベント
// 情報
// のシーンの遷移を担当するクラス
// dom操作も行う

// ユーザーからの入力に応じて、 draw() の内容をスイッチするギミック

class SceneManager {
    constructor() {
        // どの要素を描画するか
        this.global_map_scene = true;
        this.buttons = true;
        this.sliders = true;
        this.animals = true;
        this.habitant = true;
        this.local_map_scene = false;
        this.event_scene = false;
        this.info_scene = true;
        this.logs = true;
        this.dialog = true;
        // this.popupEvent();
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
            }
        }
        if (this.habitant) {
            for (let animal of global_map.getTerrain(population.gps).habitant.animals) {
                animal.show();
                animal.r.show();
            }
        }



        // for (let i = 0; i < Object.keys(population.ethics).length; i++) {

        // }

        // info.display();
    }

}