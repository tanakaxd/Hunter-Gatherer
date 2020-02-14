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
                $("#dialog").html(`<div><p>${this.day}日目の朝だよ。移動先のタイルを選択してね</p></div>`);
                this.state = "";
                break;

            case "explore":
                console.log("explore");
                let dots_a = "";
                let func = setInterval(() => {
                    $("#dialog").html("探索中" + dots_a);
                    dots_a += "・";
                    setTimeout(() => {
                        clearInterval(func);
                    }, 5500 / uber_speed);
                }, 500 / uber_speed);
                this.state = "";
                this.changeState("event", 6000 / uber_speed);
                break;

            case "event":
                console.log("event");
                this.focus = "event";
                event_manager.popEvent();
                this.state = "";
                break;

            case "hunt":
                console.log("hunt");
                let dots_b = "";
                let func_b = setInterval(() => {
                    $("#dialog").html("サバイバル中" + dots_b);
                    dots_b += "・";
                    setTimeout(() => {
                        clearInterval(func_b);
                    }, 5500 / uber_speed);
                }, 500 / uber_speed);

                setTimeout(() => {
                    population.naturalSelection();
                }, 3000 / uber_speed);

                // this.changeState("night", 6000 / uber_speed);
                setTimeout(() => {
                    $("#dialog").html("<div><p>夜の時間を開始します</p><button>ok</button></div>");
                    $("#dialog button").click(() => {
                        game_manager.state = "night";
                    });
                }, 6000 / uber_speed);
                this.state = "";
                break;

            case "night":
                console.log("night");
                global_map.night = true;
                $("#dialog").html("夜が来た！");
                population.rest();

                let dots_c = "";
                setTimeout(() => {
                    let func = setInterval(() => {
                        if (population.rested >= rest_to_reproduce) {
                            $("#dialog").html("Wuv Wuv" + dots_c);
                        } else {
                            $("#dialog").html("Zzz" + dots_c);
                        }
                        dots_c += "・";
                        setTimeout(() => {
                            clearInterval(func);
                        }, 5500 / uber_speed);
                    }, 500 / uber_speed);
                }, 1000 / uber_speed);

                console.log(population.rested);

                setTimeout(() => {
                    //もしrestが一定に達していたら
                    if (population.animals.length <= 1) {
                        game_manager.gameOver();
                    } else if (population.rested >= rest_to_reproduce) {
                        population.evaluate();
                        population.sexualSelection();
                    }
                    if (habitant_evolve) global_map.getTerrain(population.gps).habitant.evolve();
                    this.state = "map";
                    this.focus = "global_map";
                    this.day++;
                    $("#day").html(`Day: ${game_manager.day}`); //re-initializeしたときにこっちのイベントが残っていて、新しい方を上書きしてしまう。
                }, 7000 / uber_speed);

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

    gameOver() {
        alert("THIS GAME IS OVER");
        initialize();

    }
}