// イベント時のマウスクリックはマップ移動とは違って、 イベントハンドラーで処理するべきか
// 前者はcanvas上の処理、 後者はDOM

// どのイベントを発生させるかを決める

class EventManager {
    constructor() {
        this.current_event;
    }

    popEvent() {
        let event_data;
        //どのイベントを発生させるかを決める


        //そのイベントのjsonを取得

        // $.getを使った簡易法
        // $.get("events.json", function (data) {
        //     event_data = data;
        // })
        // $.ajax
        $.ajax({
                url: "./json/events.json",
                data: {
                    eventID: "001"
                    // jsonデータの一部のみを注文する方法があるのか？多分サーバー側でphpとか動かせれば可能だが、
                    // この場合はファイルそのものを注文するしかないっぽい
                },
                dataType: "json"
            })
            .done(function (data) {
                event_data = data;
                console.log(event_data);

            })
            .fail(function () {
                console.log('$.ajax failed!');
            })

        //Eventに渡す。データに基づいてイベントを発生させる
        this.current_event = new Event(event_data);
    }
}