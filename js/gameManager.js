// 内部的な値を包括する役割
//あるいは受け渡し？
//sketchがあるからいらない気がしてきた

//ゲーム全体を初期化、リスタートする役割
//ゲームの進行を管理する

//scenemangerは画面上に何を描画するのかを管理。
// このクラスはゲームの進行全般と、 どのクラスにフォーカスがあるかを管理する。
// 例えばイベントがポップした時、 プレイヤーにデータへのアクセスを与えるため背後で他のクラスを描画はするが、
// フォーカス自体はイベントに当たっていて、 選択肢を選ばない限りは先へ進めない。




class GameManager {

    constructor() {
        this.focus = "global_map"; //0:start 1:global_map 2:event どの要素とinteract可能か
        this.state = "event"; //0:hunt-time 1:event-time 2:night　ゲームの進行状況
        this.score;
        this.day = 1;
        // this.food = 0;

        //他のオブジェクトをpropertyとして持つべきかどうか

    }

    run() {
        if (this.state == "hunt") {

        }


        //イベント発生条件
        else if (this.state == "event") {
            game_manager.focus = "event";
            // console.log(this.focus === game_manager.focus);
            event_manager.popEvent();
        } else if (this.state == "night") {

        }
    }

    displayInfo() {

    }

}