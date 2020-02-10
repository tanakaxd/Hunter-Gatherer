// 内部的な進行状況を包括する役割

//ゲーム全体を初期化、リスタートする役割
//ゲームの進行を管理する

//scenemangerは画面上に何を描画するのかを管理。
// このクラスはゲームの進行全般と、 どのクラスにフォーカスがあるかを管理する。
// 例えばイベントがポップした時、 プレイヤーにデータへのアクセスを与えるため背後で他のクラスを描画はするが、
// フォーカス自体はイベントに当たっていて、 選択肢を選ばない限りは先へ進めない。

//もしstatesが単にループするだけならフラグを書く場所にはすべてstates[0]と書いて、配列を回転させる関数を作ればよい
// this.states = ["map", "hunt", "event", "night"];

class GameManager {

    constructor() {
        this.focus = "global_map"; //0:start 1:global_map 2:event 3:forbidden どの要素とinteract可能か。プレイヤーの入力待ち
        this.state = "map"; //0:hunt 1:event 2:night 3:map　ゲームの進行状況
        this.score = 0;
        this.day = 1;
    }

    run() {

        //ゲームのメインループ
        switch (this.state) {
            //dialog要素自体は常に表示させておく。都度内容を書きかえて、プレイヤーに確認を求める
            //その確認次第でstateを変化させる、つまり次のステップへ移動
            //mapの時は「タイルをクリックしたら」、eventの時は「選択肢を選んだら」state移行
            //現時点では、確認ではなく時間で推移
            case "map":
                global_map.night = false;
                console.log("map");
                $("#dialog").html(`${this.day}日目の朝だよ。移動先のタイルを選択してね`);
                this.state = "";
                break;
            case "hunt":
                console.log("hunt");
                let dots = "";
                let func = setInterval(() => {
                    $("#dialog").html("探索中" + dots);
                    dots += "・";
                    setTimeout(() => {
                        clearInterval(func);
                    }, 5500 / uber_speed);
                }, 500 / uber_speed);

                setTimeout(() => {
                    population.naturalSelection();
                }, 3000 / uber_speed);

                this.state = "";
                this.changeState("event", 6000 / uber_speed);
                break;
            case "event":
                console.log("event");
                this.focus = "event";
                event_manager.popEvent();
                this.state = "";
                break;
            case "night":
                console.log("night");
                global_map.night = true;
                $("#dialog").html("夜が来た！");

                let dots_b = "";
                setTimeout(() => {
                    let func = setInterval(() => {
                        $("#dialog").html("Wuv Wuv" + dots_b);
                        dots_b += "・";
                        setTimeout(() => {
                            clearInterval(func);
                        }, 5500 / uber_speed);
                    }, 500 / uber_speed);
                }, 2000 / uber_speed);

                population.evaluate();

                setTimeout(() => {
                    population.sexualSelection();
                    this.state = "map";
                    this.focus = "global_map";
                    this.day++;
                    $("#day").html(`Day: ${this.day}`);
                }, 8000 / uber_speed);

                this.state = "";
                break;
            default:
        }
    }

    changeState(state, miliseconds) {
        setTimeout(() => {
            this.state = state;
        }, miliseconds);
    }
}