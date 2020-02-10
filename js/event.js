// 個々のイベントデータはjsonで定義
// その都度読み込まれた一つのイベントに対応する
// 現在の種のethics / geneによって選択肢が変わる

// どのイベントを発生させるかはevent_managerが決める
// このクラスは可能な選択肢とその結果をjsonから生成して、 DOMに反映。

// その都度ajax通信しているけど、実際には最初に一回でいい


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

    display() {

        let buttons = ""; //空文字列として宣言

        //条件合致判断用のfunctions
        let qualifiers = {
            "avg": (phenotype, criterion, operator) => {
                if (operator == "more") {
                    return population.avg[phenotype] >= criterion;
                } else {
                    return population.avg[phenotype] <= criterion;
                }
            },
            "max": (phenotype, criterion, operator) => {
                if (operator == "more") {
                    return population.max[phenotype] >= criterion;
                } else {
                    return population.max[phenotype] <= criterion;
                }
            },
            "min": (phenotype, criterion, operator) => {
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
            "egalitarian": (scale) => {
                population.ethics.egalitarian += scale;
            },
            "polygamy": (scale) => {
                population.ethics.polygamy += scale;
            }
        };

        //条件を満たした選択肢のみの配列を作る
        for (let choice of this.choices) {
            let condition = choice.condition;
            let bool = qualifiers[condition.qualifier](condition.phenotype, condition.criterion, condition.operator);
            if (bool) {
                this.certified_choices.push(choice);
            }
        }

        //作った配列をDOMに反映。該当する選択肢がない場合の処理
        if (this.certified_choices.length != 0) {
            for (let choice of this.certified_choices) {
                buttons += `<div class="btn" id="${choice.optionID}">${choice.optionTitle}</div>`;
            }
        } else {
            buttons += '<div class="btn">できることが何もない…</div>';
        }
        $("#choices").html(buttons);


        //全ての選択肢ボタンに共通する処理を登録
        $(".btn").click(() => {
            $("#js-popup").toggleClass('is-show');
            game_manager.focus = "global_map";
            setTimeout(() => {
                game_manager.state = "night";
            }, 3000 / uber_speed);
        });

        // それぞれのボタンに対してイベントハンドラーを設定。
        // 変数はoutcomeから受け取ってくる。
        for (let choice of this.certified_choices) {
            $("#" + choice.optionID).click(() => {
                for (let func of choice.outcome) {
                    modifiers[func.modifier](func.scale);
                }
                population.adjustSlider();
            })
        }

        //イベント要素全体をpopup
        $("#js-popup").toggleClass('is-show');
        addlog("イベントが発生しました");
    }

    // certifyCondition() {

    // }
}