// グローバルマップ
// ローカルマップ
// イベント
// 情報
// のシーンの遷移を担当するクラス
// dom操作も行う

// ユーザーからの入力に応じて、 draw() の内容をスイッチするギミック

class SceneManager {
    constructor() {
        this.state;
        this.global_map_scene = true;
        this.local_map_scene = false;
        this.event_scene = false;
        this.info_scene = true;
        // this.popupEvent();
    }

    changeScene() {

    }

}