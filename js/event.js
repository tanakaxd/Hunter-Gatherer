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
            //ethics modifier
            "egalitarian": (scale) => {
                population.ethics.egalitarian += scale;
            },
            "polygamy": (scale) => {
                population.ethics.polygamy += scale;
            },
            "pacifist": (scale) => {
                population.ethics.pacifist += scale;
            },
            "xenophile": (scale) => {
                population.ethics.xenophile += scale;
            },
            "innovative": (scale) => {
                population.ethics.innovative += scale;
            },
            "order": (scale) => {
                population.ethics.order += scale;
            },

            //coefficient modifier
            "hunting": (scale) => {
                population.fitness_coefficient.hunting += scale;
            },
            "foraging": (scale) => {
                population.fitness_coefficient.foraging += scale;
            },
            "swimming": (scale) => {
                population.fitness_coefficient.swimming += scale;
            },
            "hiding": (scale) => {
                population.fitness_coefficient.hiding += scale;
            },
            "fighting": (scale) => {
                population.fitness_coefficient.fighting += scale;
            },
            "fleeing": (scale) => {
                population.fitness_coefficient.fleeing += scale;
            },
            "negotiation": (scale) => {
                population.fitness_coefficient.negotiation += scale;
            },
            "deception": (scale) => {
                population.fitness_coefficient.deception += scale;
            },
            "attraction": (scale) => {
                population.fitness_coefficient.attraction += scale;
            },
            "equality": (scale) => {
                population.fitness_coefficient.equality += scale;
            },
            "lust": (scale) => {
                population.fitness_coefficient.lust += scale;
            },
            "aggressivity": (scale) => {
                population.fitness_coefficient.aggressivity += scale;
            },
            "openminded": (scale) => {
                population.fitness_coefficient.openminded += scale;
            },
            "curiosity": (scale) => {
                population.fitness_coefficient.curiosity += scale;
            },
            "independency": (scale) => {
                population.fitness_coefficient.independency += scale;
            },

            //pops modifier
            "acquire": (scale) => {
                let habitants = global_map.getTerrain(population.gps).habitant.animals;
                let animals = population.animals;

                for (let i = 0; i < scale; i++) {
                    let acquired = habitants.splice(random(0, habitants.length), 1); //spliceの返り値は配列
                    // console.log(acquired);
                    animals.push(acquired[0]);

                    // animals = animals.concat(habitants.splice(random(0, habitants.length), 1));
                    //concatは新しい配列をreturnする。pushは既存の配列を改変する
                    //この書き方自体は可能だが、新しくなったanimalsは別のオブジェクトになって、アドレスも書き換えられているっぽい

                }
                population.setPosition();
                // console.log(population.animals);
                // console.log(animals);


                // let indexes = [];
                // let magical_box = [];

                // //0-14の整数の入った箱
                // for (let i = 0; i < habitants.length; i++) {
                //     magical_box.push(i);
                // }
                // // 一回選んだ数値は削除。これにより重複回避
                // for (let i = 0; i < scale; i++) {
                //     let j = random(magical_box);
                //     indexes.push(j);
                //     magical_box.splice(j, 1);
                // }
                // for (let i = 0; i < indexes.length; i++) {
                //     population.animals.push(habitants[indexes[i]]);
                //     habitants.splice(indexes[i], 1);
                // }
            },
            "release": (scale) => {
                let habitants = global_map.getTerrain(population.gps).habitant.animals;
                let animals = population.animals;
                for (let i = 0; i < scale; i++) {
                    let released = animals.splice(random(0, animals.length), 1); //spliceの返り値は配列
                    habitants.push(released[0]);
                }
                global_map.getTerrain(population.gps).habitant.setPosition(555);
            },

            //score modifier
            "score": (scale) => {
                game_manager.score += scale;
                $("#score").html(`Score: ${game_manager.score}`);
            },

            //fog modifier
            "fog": (scale) => {
                for (let i = 0; i < scale; i++) {
                    let p = createVector(random(0, map_size), random(0, map_size));
                    population.clearFog(p);
                }
            },

            //health modifier 怪我をする　息絶える
            "health": (scale, option) => {
                if (option == "death") {
                    population.animals.splice(random(population.animals), scale);
                } else if (option == "injury") {
                    for (let i = 0; i < scale; i++) {
                        let injured = random(population.animals);
                        injured.health -= 1;
                        if (injured.health <= 0) {
                            population.animals.splice(population.animals.indexOf(injured), 1);
                        }
                    }
                } else {
                    population.animals.forEach((animal, index) => {
                        animal.health += scale;
                        if (animal.health <= 0) {
                            population.animals.splice(index, 1);
                        }
                    })
                }
            },

            // local map modifier
            "local": (scale, option) => {
                let local_map = global_map.getTerrain(population.gps);
                local_map[option] += scale;
                if (local_map[option] < 0) local_map[option] = 0;
            },

            //rest modifier
            "rest": (scale) => {
                population.rest(scale);
            },

            //nest modifier
            "nest": () => {
                let local_map = global_map.getTerrain(population.gps);
                local_map.nest = true;
            },

            //buff modifier
            "buff": () => {
                population.buffed = true;
            },

            //child modifier
            "child": (scale) => {
                population.next_children += scale;
            },

            //gps modifier
            "gps": (scale, option) => {
                population.gps = createVector(scale, option).copy(); //邪道？
            },
            //genes modifier
            //phenotype modifier
            //inventory modifier
        };


        //条件を満たした選択肢のみの配列を作る。条件を複数にすることも可能
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
                buttons += `<div class="btn" id="${choice.choiceID}">${choice.choiceTitle}</div>`;
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
            $("#" + choice.choiceID).click(() => {
                for (let func of choice.outcome) {
                    if (modifiers[func.modifier] === undefined) {
                        console.error("invalid modifier name");
                    }
                    modifiers[func.modifier](func.scale, func.option);
                }
                population.adjustSlider();
                population.calcStats();
            })
        }

        //イベント要素全体をpopup
        $("#js-popup").toggleClass('is-show');
        addlog("イベントが発生しました");
    }

    // certifyCondition() {

    // }
}