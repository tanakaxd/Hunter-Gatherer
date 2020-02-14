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
                // addlog(`Scoreを${scale}ポイント獲得`);
            },

            //fog modifier
            "fog": (scale) => {
                for (let i = 0; i < scale; i++) {
                    let p = createVector(floor(random(0, map_size)), floor(random(0, map_size)));
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
            "gps": () => {
                let loop_count = 0;
                while (loop_count < map_size ** 2) {
                    let new_gps = createVector(floor(random(0, map_size)), floor(random(0, map_size)));
                    if (!(global_map.getTerrain(new_gps).visited)) {
                        population.move(new_gps);
                        break;
                    }
                    loop_count++;
                }
            },
            //genes modifier
            //phenotype modifier
            //inventory modifier
        };


        let outliners = {
            //ethics modifier
            "egalitarian": (scale, score) => {
                return scale > 0 ? `egalitarianが${scale}上昇` : `authoritarianが${-scale}上昇`;

            },
            "polygamy": (scale) => {
                return scale > 0 ? `polygamyが${scale}上昇` : `monogamyが${-scale}上昇`;

            },
            "pacifist": (scale) => {
                return scale > 0 ? `pacifistが${scale}上昇` : `militaristが${-scale}上昇`;

            },
            "xenophile": (scale) => {
                // let p = `xenophileが${scale}増減 `;
                return scale > 0 ? `xenophileが${scale}上昇` : `xenophobeが${-scale}上昇`;
            },
            "innovative": (scale) => {
                return scale > 0 ? `innovativeが${scale}上昇` : `traditionalが${-scale}上昇`;

            },
            "order": (scale) => {
                return scale > 0 ? `orderが${scale}上昇` : `chaosが${-scale}上昇`;

            },

            //coefficient modifier
            "hunting": (scale) => {
                return this.coefficientTip(scale, "hunting"); //arrow function内だからajax連鎖内でもthisがeventオブジェクトになる？
            },
            "foraging": (scale) => {
                return this.coefficientTip(scale, "foraging");
            },
            "swimming": (scale) => {
                return this.coefficientTip(scale, "swimming");
            },
            "hiding": (scale) => {
                return this.coefficientTip(scale, "hiding");
            },
            "fighting": (scale) => {
                return this.coefficientTip(scale, "fighting");
            },
            "fleeing": (scale) => {
                return this.coefficientTip(scale, "fleeing");
            },
            "negotiation": (scale) => {
                return this.coefficientTip(scale, "negotiation");
            },
            "deception": (scale) => {
                return this.coefficientTip(scale, "deception");
            },
            "attraction": (scale) => {
                return this.coefficientTip(scale, "attraction");
            },
            "equality": (scale) => {
                return this.coefficientTip(scale, "equality");
            },
            "lust": (scale) => {
                return this.coefficientTip(scale, "lust");
            },
            "aggressivity": (scale) => {
                return this.coefficientTip(scale, "aggressivity");
            },
            "openminded": (scale) => {
                return this.coefficientTip(scale, "openminded");
            },
            "curiosity": (scale) => {
                return this.coefficientTip(scale, "curiosity");
            },
            "independency": (scale) => {
                return this.coefficientTip(scale, "independency");
            },

            //pops modifier
            "acquire": (scale) => {
                return `${scale}人が群れに加入`;

            },
            "release": (scale) => {
                return `${scale}人が群れから去る`;
            },

            //score modifier
            "score": (scale) => {
                return `Scoreを${scale}ポイント獲得`;
            },

            //fog modifier
            "fog": (scale) => {
                return `${scale}タイルの霧を晴らす`;
            },

            //health modifier 怪我をする　息絶える
            "health": (scale, option) => {
                if (option == "death") {
                    return `${scale}人が死亡`;
                } else if (option == "injury") {
                    return `${scale}人が負傷`;
                } else {
                    return scale > 0 ? `皆のhealthが${scale}回復` : `皆のhealthが${-scale}減少`;
                }
            },

            // local map modifier
            "local": (scale, option) => {
                return scale > 0 ? `タイルの${option}が${scale}上昇` : `タイルの${option}が${-scale}減少`;
            },

            //rest modifier
            "rest": (scale) => {
                return `群れのrest値が${scale}上昇`;
            },

            //nest modifier
            "nest": () => {
                return `現在地/移動後のタイルで巣を獲得`;
            },

            //buff modifier
            "buff": () => {
                return `群れがbuffを獲得`;
            },

            //child modifier
            "child": (scale) => {
                return `次回の交配時、次世代が通常より${scale}人増加`
            },

            //gps modifier
            "gps": () => {
                return `マップ上のランダムなタイルにワープ`;
            },
        };

        //条件を満たした選択肢のみの配列を作る。条件を複数にすることも可能
        for (let choice of this.choices) {
            let condition = choice.condition;
            let bool = qualifiers[condition.qualifier](condition.phenotype, condition.criterion, condition.operator);
            if (bool) {
                this.certified_choices.push(choice);
            }
        }

        //作った配列をDOMに反映。該当する選択肢がない場合の処理。スコアに応じてクラスをつけて文字の色を変える
        if (this.certified_choices.length != 0) {
            for (let choice of this.certified_choices) {
                let choice_color = "";
                let score = 0;
                for (let func of choice.outcome) {
                    if (func.modifier == "score") score = func.scale;
                }
                if (score >= 50) {
                    choice_color = "legendary";
                } else if (score >= 25) {
                    choice_color = "good";
                } else if (score < 0) {
                    choice_color = "awful";
                }

                buttons += `<div class="btn tooltip ${choice_color}" id="${choice.choiceID}"><p>${choice.choiceTitle}</p></div>`;
            }
        } else {
            buttons += '<div class="btn">できることが何もない…</div>';
        }
        $("#choices").html(buttons);


        //全ての選択肢ボタンに共通する処理を登録
        $(".btn").click(() => {
            $("#js-popup").toggleClass('is-show');
            game_manager.focus = "global_map";
            mp3_btn.play();
            setTimeout(() => {
                game_manager.state = "night";
            }, 3000 / uber_speed);
        });

        // それぞれのボタンに対してイベントハンドラーを設定。
        // 変数はoutcomeから受け取ってくる。
        for (let choice of this.certified_choices) {

            let tips = '<ul class="tips">';

            //クリックしたときの処理
            $("#" + choice.choiceID).click(() => {
                for (let func of choice.outcome) {
                    if (modifiers[func.modifier] === undefined) {
                        console.error("invalid modifier name");
                    } else {
                        modifiers[func.modifier](func.scale, func.option);
                        addlog(outliners[func.modifier](func.scale, func.option));
                    }
                }
                population.adjustSlider();
                population.calcStats();
            })

            //hoverしたときの処理
            //一つ一つのmodifierに対応する、別のfunctionセットを用意する必要がある。仮にoutlinersとする
            for (let func of choice.outcome) {
                if (outliners[func.modifier] === undefined) {
                    console.error("invalid outliner name");
                } else {
                    tips += "<li>" + outliners[func.modifier](func.scale, func.option) + "</li>";
                }
            }
            tips += "</ul>";
            $("#" + choice.choiceID).append(tips);

            // $("#" + choice.choiceID).hover(() => {
            //     //choiceから要素を読み込んで、hover時のイベントを生成する

            //     $("#" + choice.choiceID + " .tips").css("visibility", "visible");
            //     // $("#t1o1 .tips").css("visibility", "visible");
            //     console.log("hover!");

            // }, () => {
            //     $("#t1o1 .tips").css("visibility", "hidden");

            // })
        }

        //title img descriptionをhtml要素に登録
        $("#event-title").html(this.title);
        // $("#event-img").html(this.img);
        $("#description").html(this.description);



        //イベント要素全体をpopup
        $("#js-popup").toggleClass('is-show');
        addlog("イベントが発生しました");
    }

    // certifyCondition() {

    // }

    coefficientTip(scale, phenotype) {
        return scale > 1 ? `${phenotype}への憧れが増加` : `${phenotype}への憧れが減少`;
    }
}