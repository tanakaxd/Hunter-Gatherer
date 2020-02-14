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
        let eventID = this.chooseEvent();
        // let eventID = "test1";
        // let eventID = "order1";

        //そのイベントのjsonを取得

        // $.getを使った簡易法
        // $.get("events.json", function (data) {
        //     event_data = data;
        // })

        $.ajax({
                url: "./json/events.json",
                data: {
                    // eventID: "001"
                    // jsonデータの一部のみを注文する方法があるのか？多分サーバー側でphpとか動かせれば可能だが、
                    // この場合はファイルそのものを注文するしかないっぽい
                },
                dataType: "json"
            })
            .done((events_data) => {
                events_data.forEach((event, index) => {
                    if (event.eventID == eventID) {
                        specific_event = event;
                    }
                });
                //Eventに渡す。データに基づいてイベントを発生させる
                this.current_event = new Event(specific_event); //this.にすると通信オブジェクトになる？ arrow functionでevent_managerに固定できる
                this.current_event.display();
                // console.log("inside happening");

            })
            .fail(function () {
                console.error('$.ajax failed!');
            })
        // console.log("outside happening");



    }

    //idを返す
    chooseEvent() {

        //探索イベント。現在未実装。選択肢なしで成果だけを表示するタイプ。ローカルマップの情報の一部、他タイルの情報等を取得。
        if (game_manager.state == "exploration") { //tile event?
            let events_pool = [];
            let eventID = "militarist1";
            return eventID;

        } else if (game_manager.state == "event") { //ethicsイベント
            let events_pool = []; //idが発生確率に比例して大量に入れられた配列
            // 一つの対立軸に対して11個。小数点切り上げで割り振る。(1.5,8.5)→(2,9)
            for (let key in population.ethics) {

                for (let i = 0; i < population.ethics[key]; i++) {
                    for (let j = 1; j <= events_per_ethic; j++) {
                        events_pool.push(key + j);
                    }
                }
                // 対立項
                for (let i = 0; i < 10 - population.ethics[key]; i++) {
                    for (let j = 1; j <= events_per_ethic; j++) {
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
                            console.error("invalid ethics name");
                        }
                    }
                }
            }

            return random(events_pool);
        } else {
            console.error("invalid state");
        }
    }
}