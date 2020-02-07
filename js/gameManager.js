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
        this.focus = "global_map"; //0:start 1:global_map 2:event どの要素とinteract可能か。プレイヤーの入力待ち
        this.states = ["map", "hunt", "event", "night"];
        this.state = "map"; //0:hunt 1:event 2:night 3:map　ゲームの進行状況
        this.score;
        this.day = 1;
        // this.food = 0;

        //他のオブジェクトをpropertyとして持つべきかどうか

    }

    run() {

        switch (this.state) {
            case "map":
                console.log("map");

                // noLoop();
                $("#dialog").addClass("is-show");
                this.state = "";
                break;
            case "hunt":
                console.log("hunt");

                population.naturalSelection();
                this.state = "event";
                break;
            case "event":
                console.log("event");

                this.focus = "event";
                // console.log(this.focus === game_manager.focus);
                event_manager.popEvent();
                // this.state = "night";
                // noLoop();
                this.state = "";
                break;
            case "night":
                console.log("night");

                population.evaluate();
                population.sexualSelection();
                this.state = "map";
                this.focus = "global_map";
                break;
            default:
        }
        // if (this.state == "hunt") {
        //     population.naturalSelection();
        // }


        // //イベント発生条件
        // else if (this.state == "event") {
        //     game_manager.focus = "event";
        //     // console.log(this.focus === game_manager.focus);
        //     event_manager.popEvent();
        //     game_manager.state = "night";
        //     // noLoop();

        // } else if (this.state == "night") {

        // }
    }

    //もしstatesが単にループするだけならフラグを書く場所にはすべてstates[0]と書いて、配列を回転させる関数を作ればよい
    stateChanger() {
        this.states.slice()
    }


}