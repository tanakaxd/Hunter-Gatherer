// 個々のイベントデータはjsonで定義
// その都度読み込まれた一つのイベントに対応する
// 現在の種のethics / geneによって選択肢が変わる

// どのイベントを発生させるかはevent_managerが決める
// このクラスは可能な選択肢とその結果をjsonから生成して、 DOMに反映。


class Event {
    constructor(event_data) {
        this.eventID = event_data.eventID;
        this.title = event_data.title;
        this.description = event_data.description;
        this.choices = event_data.choices;
        this.conditions = [];
        this.certified_choices = [];
        this.outcome = event_data.outcome;
    }

    occur() {
        this.fetch();
    }


    fetch() {

    }

    display() {
        // choices DIV要素を取得して、その中にhtmlを加えていく。
        let buttons = ""; //空文字列として宣言

        //条件合致判断用のfunctions
        let qualifiers = {
            "avg": function (phenotype, criterion) {
                // console.log("avg");
                console.log(phenotype);

                return true;
            },
            "max": function (phenotype, criterion) {
                // console.log("max");
                return false;
            }
        };
        //選択肢の結果を反映させるためのfunctions
        let modifiers = {
            "egalitarian": function (scale) {
                population.ethics.egalitarian += scale;
            }
        };

        //条件を満たした選択肢のみhtmlに追加したい
        for (let choice of this.choices) {
            let condition = choice.condition;
            let bool = qualifiers[condition.qualifier](condition.phenotype, condition.criterion);
            if (bool) {
                this.certified_choices.push(choice);
                console.log(this.certified_choices);

            }
        }


        for (let choice of this.certified_choices) {

            buttons += `<div class="btn" id="${choice.optionID}">${choice.optionTitle}</div>`;

        }
        $("#choices").html(buttons);

        var popup = document.getElementById('js-popup');
        if (!popup) return;
        popup.classList.toggle('is-show');

        //全ての選択肢ボタンに共通する処理
        $(".btn").click(function () {
            popup.classList.toggle('is-show');
            game_manager.focus = 1;
        });

        // それぞれのボタンに対してイベントハンドラーを設定。
        // 変数はjsonから受け取ってくる。

    }

    certifyCondition() {

    }


    popupEvent() {


        var blackBg = document.getElementById('js-black-bg');
        var closeBtn = document.getElementById('js-close-btn');
        var showBtn = document.getElementById('js-show-popup');



        function closeEvent(elem) {
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