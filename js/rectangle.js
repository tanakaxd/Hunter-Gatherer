// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Re-implementing java.awt.Rectangle
// so JS mode works

// 内部的な値はtranslateする前のanimalの場所にあればよい。つまりtranslateしなくてよい
// しかし、画面上に出力するときは必要
//posそのものを絶対的なものに変更


class Rectangle {
    constructor(x, y, w, h) {
        //中心点が(x,y)
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.clr = color(255, 0);
    }

    contains(px, py) {
        return (this.x - this.width / 2 < px && px < this.x + this.width / 2 && this.y - this.height / 2 < py && py < this.y + this.height / 2);
    }

    show() {
        push();
        rectMode(CENTER)
        fill(this.clr);
        rect(this.x, this.y, this.width, this.height);
        pop();
    }

}