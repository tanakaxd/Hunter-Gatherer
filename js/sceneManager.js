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
        this.state;
        this.global_map_scene = true;
        this.local_map_scene = false;
        this.event_scene = false;
        this.info_scene = true;
        // this.popupEvent();
    }

    changeScene() {

    }

    displayInfo() {

    }


    run() {
        global_map.show();
        population.show();
        let row = 0;
        let col = 0;
        for (let i = 0; i < population.animals.length; i++) {
            if (i != 0 && i % pops_col == 0) {
                row++;
                col = 0;
            }
            population.animals[i].display(50 + col * 75, 50 + row * pops_cell);
            col++;
        }

        for (let i = 0; i < Object.keys(population.ethics).length; i++) {

        }
    }

}