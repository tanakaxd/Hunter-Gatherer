//main
let canvas, game_manager, scene_manager, global_map, population, event, info;

//DOM
let sliders = [];

//settings
let cell_size = 30;
let map_size = 15; //横縦方向へのcellの数
let map_width = cell_size * map_size;
let mutationRate = 0.03;
let pops_cell = 70; //セルのサイズ
let pops_col = 5;
let pops_scale = 1.7; //顔のパーツが絶対的な値で定義されているので縮尺によって調節する
let pops_width = pops_cell * pops_col;
let events_per_ethic = 3;

//utility
let debug = true;
let fr;
let frame_count = 0;
let uber_mode = true;
let uber_speed = uber_mode ? 1000 : 1;


//データを取り込む。イベント用、マップ用
// function preload() {
// 	loadJSON();
// }

function setup() {
	initialize();

	frameRate(10);

	let button1 = select("#pause");
	let button2 = select("#resume");
	let button3 = select("#restart");
	let button4 = select("#popup-event")
	button1.mousePressed(pause);
	button2.mousePressed(resume);
	button3.mousePressed(restart);
	button4.mousePressed(popEvent);
	sliders[0] = select("#egalitarian");
	sliders[1] = select("#polygamy");
	sliders[2] = select("#pacifist");
	sliders[3] = select("#xenophile");
	sliders[4] = select("#innovativeness");
	sliders[5] = select("#chaos");

	if (debug) fr = createP();


}

function draw() {
	// アイドル状態の場合、描写自体をストップ(draw内部が空白)してもよい。入力があった場合フラグを立てる？
	background(global_map.getTerrain(population.gps).color); //local_mapに合わせた色にする
	game_manager.run();
	scene_manager.run();

	fr.html(frame_count);
	frame_count++;

	// mouseHovered();

}

function mousePressed() {
	if (debug) console.log(mouseX, mouseY);

	//global_map上の移動
	let p = createVector(mouseX, mouseY);
	if (game_manager.focus == "global_map") {
		let cell_cordinate = global_map.convertToCellCordinate(p);
		if (global_map.verifyCell(cell_cordinate)) {
			if (global_map.terrain[cell_cordinate.x][cell_cordinate.y].accessible) {
				population.move(cell_cordinate);
				global_map.examineAccessibility(cell_cordinate);
				$("#dialog").html("");
				game_manager.state = "hunt";
				game_manager.focus = "forbidden";
				// noLoop();
			}
		}
	}

	// animalsをクリックしたときの挙動
	if (true) {
		for (let animal of population.animals) {
			if (animal.r.contains(mouseX, mouseY)) {
				// console.table(animal.phenotype);
				for (let anim of global_map.getTerrain(population.gps).habitant.animals) {
					anim.r.clr = color(255, 0);
				}
				for (let anim of population.animals) {
					anim.r.clr = color(255, 0);
				}
				animal.r.clr = color(255, 180);

				for (key in animal.phenotype) {
					let legend = animal.valueToLegend(animal.phenotype[key]);
					$("#" + key + " td:nth-child(2)").html(legend).removeClass().addClass(legend);
				}
			}
		}
	}

	//habitantをクリックしたとき。上のと共通部分があるので、もっと簡潔な書き方がある気がする。
	if (true) {
		let animals = global_map.getTerrain(population.gps).habitant.animals;
		for (let animal of animals) {
			if (animal.r.contains(mouseX, mouseY)) {
				for (let anim of animals) {
					anim.r.clr = color(255, 0);
				}
				for (let anim of population.animals) {
					anim.r.clr = color(255, 0);
				}
				animal.r.clr = color(255, 180);

				for (key in animal.phenotype) {
					let legend = animal.valueToLegend(animal.phenotype[key]);
					$("#" + key + " td:nth-child(2)").html(legend).removeClass().addClass(legend);
				}
			}
		}
	}
}

// function mouseHovered() {
// 	for (let animal of population.animals) {
// 		if (animal.r.contains(mouseX, mouseY)) {
// 			animal.r.clr = color(10);
// 		}
// 	}
// }

function pause() {
	noLoop();
}

function resume() {
	loop();
}

function restart() {
	initialize();
}

function popEvent() {
	game_manager.state = "event";
}

function initialize() {

	// p5, jquery, javascriptで取得できるDOM要素はそれぞれ別物

	noiseSeed(new Date().getTime());
	canvas = createCanvas(map_width + pops_width / pops_scale, map_width);
	let canvas_inner = select(".canvas-inner");
	canvas_inner.child(canvas);

	game_manager = new GameManager();
	scene_manager = new SceneManager();
	event_manager = new EventManager();
	global_map = new GlobalMap();
	population = new Player();
	global_map.examineAccessibility(population.gps);

	// 仕様上constructorでは無理。local_mapを生み出すのとhabitantを生み出すのは共にglobal_mapの生成時、その連鎖内にある。
	for (let y = 0; y < map_size; y++) {
		for (let x = 0; x < map_size; x++) {
			for (let i = 0; i < 3; i++) {
				global_map.terrain[x][y].habitant.evolve();
			}
		}
	}
}

function addlog(text) {
	$(".log").prepend(`<P>${text}<p>`);
}