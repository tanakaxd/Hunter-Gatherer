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
            "avg": function (phenotype, criterion, operator) {
                if (operator == "more") {
                    return population.average[phenotype] >= criterion;
                } else {
                    return population.average[phenotype] <= criterion;
                }
            },
            "max": function (phenotype, criterion, operator) {
                if (operator == "more") {
                    return population.max[phenotype] >= criterion;
                } else {
                    return population.max[phenotype] <= criterion;
                }
            },
            "min": function (phenotype, criterion, operator) {
                if (operator == "more") {
                    return population.min[phenotype] >= criterion;
                } else {
                    return population.min[phenotype] <= criterion;
                }
            }
        };
        // 上記のfunctionsを機能させるためのライブラリ的オブジェクト
        // let phenotype = {
        //     "equality": population.a
        // };

        // let operators = {};




        //選択肢の結果を反映させるためのfunctions
        let modifiers = {
            "egalitarian": function (scale) {
                population.ethics.egalitarian += scale;
            },
            "polygamy": function (scale) {
                population.ethics.polygamy += scale;
            }
        };

        //条件を満たした選択肢のみの配列を作る
        for (let choice of this.choices) {
            let condition = choice.condition;
            let bool = qualifiers[condition.qualifier](condition.phenotype, condition.criterion, condition.operator);
            if (bool) {
                this.certified_choices.push(choice);
                console.log(this.certified_choices);

            }
        }
        //作った配列をDOMに反映
        for (let choice of this.certified_choices) {
            buttons += `<div class="btn" id="${choice.optionID}">${choice.optionTitle}</div>`;
        }
        $("#choices").html(buttons);


        //全ての選択肢ボタンに共通する処理を登録
        $(".btn").click(function () {
            $("#js-popup").toggleClass('is-show');
            game_manager.focus = 1;
        });

        // それぞれのボタンに対してイベントハンドラーを設定。
        // 変数はoutcomeから受け取ってくる。
        for (let choice of this.certified_choices) {
            $("#" + choice.optionID).click(function () {
                for (let func of choice.outcome) {
                    modifiers[func.modifier](func.scale);
                }
            })
        }
        //イベント要素全体をpopup
        $("#js-popup").toggleClass('is-show');


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