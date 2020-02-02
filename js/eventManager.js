// イベント時のマウスクリックはマップ移動とは違って、 イベントハンドラーで処理するべきか
// 前者はcanvas上の処理、 後者はDOM

// どのイベントを発生させるかを決める

class EventManager {
    constructor() {
        this.current_event;
    }

    popEvent() {
        let specific_event;
        //どのイベントを発生させるかを決める
        let eventID = this.chooseEvent();



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

    chooseEvent() {
        let eventID = "001";

        return eventID;
    }
}