// 個々のイベントデータはjsonで定義
// その都度読み込まれた一つのイベントに対応する
// 現在の種のethics / geneによって選択肢が変わる


class Event {
    constructor(data) {

        this.choices = [];
        this.outcome = [];
    }

    occur() {
        this.fetch();
    }


    fetch() {

    }

    display() {
        // choices要素を取得して、htmlを加えていく。
        $("#choices").html();
        // this.choices.inneHTML = data
    };
}