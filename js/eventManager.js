// イベント時のマウスクリックはマップ移動とは違って、 イベントハンドラーで処理するべきか
// 前者はcanvas上の処理、 後者はDOM

// 現在地のタイルとethicsによって、どのイベントを発生させるかを決める

class EventManager {
    constructor() {
        this.current_event;
        this.loaded_events;
    }

    popEvent() {
        let specific_event;
        //どのイベントを発生させるかを決める
        //例えばxmlファイルを読み込んで、タイル種別のイベント比率に基づいてランダムに発生させる
        // let eventID = this.chooseEvent(global_map.getTerrain(population.gps), population.ethics);
        let eventID = "militarist1";




        //そのイベントのjsonを取得

        // $.getを使った簡易法
        // $.get("events.json", function (data) {
        //     event_data = data;
        // })

        $.ajax({
                url: "./json/events.json",
                data: {
                    eventID: "001"
                    // jsonデータの一部のみを注文する方法があるのか？多分サーバー側でphpとか動かせれば可能だが、
                    // この場合はファイルそのものを注文するしかないっぽい
                },
                dataType: "json"
            })
            .done(function (events_data) {
                events_data.forEach(function (event, index) {
                    if (event.eventID == eventID) {
                        specific_event = event;
                    }
                });
                //Eventに渡す。データに基づいてイベントを発生させる
                event_manager.current_event = new Event(specific_event); //this.にすると通信オブジェクトになる？
                // console.log(this.current_event);

                event_manager.current_event.display();
            })
            .fail(function () {
                console.log('$.ajax failed!');
            })


    }

    //idを返す
    chooseEvent(tile, ethics) {
        if (game_manager.state == "hunt") { //狩りイベント
            let events_pool = [];



            let eventID = "001";

            return eventID;

        } else if (game_manager.state == "event") { //ethicsイベント
            let events_pool = []; //idが発生確率に比例して大量に入れられた配列
            for (let key in population.ethics) {
                for (let i = 0; i < population.ethics[key]; i++) {
                    for (let j = 0; j < 3; j++) {
                        events_pool.push(key + j);
                    }
                }
                for (let i = 0; i < 10 - population.ethics[key]; i++) {
                    for (let j = 0; j < events_per_ethic; j++) {
                        if (key == "egalitarian") {
                            events_pool.push("authoritarian" + j);
                        } else if (key == "polygamy") {
                            events_pool.push("monogamy" + j);
                        } else if (key == "pacifist") {
                            events_pool.push("militarist" + j);
                        } else if (key == "xenophile") {
                            events_pool.push("xenophobe" + j);
                        } else if (key == "innovative") {
                            events_pool.push("traditional" + j);
                        } else if (key == "order") {
                            events_pool.push("chaos" + j);
                        } else {
                            console.log("invalid ethics name");

                        }
                    }
                }
            }
            console.log(events_pool);

            return random(events_pool);
        } else {
            console.log("invalid state");

        }
    }
}