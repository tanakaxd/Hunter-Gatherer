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
        this.popupImage();
    }

    changeScene() {

    }



    popupImage() {
        var popup = document.getElementById('js-popup');
        if (!popup) return;
        console.log((popup));

        var blackBg = document.getElementById('js-black-bg');

        var blackBg = document.getElementById('js-black-bg');
        var closeBtn = document.getElementById('js-close-btn');
        var showBtn = document.getElementById('js-show-popup');

        closePopUp(blackBg);
        closePopUp(closeBtn);
        closePopUp(showBtn);

        function closePopUp(elem) {
            if (!elem) return;
            // elem.addEventListener('click', function () {
            //     popup.classList.toggle('is-show');
            //     console.log(elem);
            //     //initializeしたとき、イベントが二重に登録されてしまう
            // });
            // console.log(elem.onclick);

            elem.onclick = function () {
                popup.classList.toggle('is-show');
            }
        }
    }
}