//main
let canvas, game_manager, scene_manager, global_map, population, event, info;

//DOM
let sliders = [];

//settings
let cell_size = 30;
let map_size = 15;
let mutationRate = 0.03;
let pops_cell = 70;
let pops_col = 5;
// let pops_width = pops_cell * pops_col;
let events_per_ethic = 3;

//utility
let debug = true;
let fr;
let frame_count = 0;


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
	// scene_manager.stateの値によって、描写する内容をスイッチ
	// アイドル状態の場合、描写自体をストップ(draw内部が空白)してもよい。入力があった場合フラグを立てる？
	background(250); //local_mapに合わせた色にする
	game_manager.run();
	scene_manager.run();
	// event_manager.run();
	// global_map.show();
	// population.show();
	// for (i = 0; i < population.animals.length; i++) {

	// 	population.animals[i].display(50 + i * 75, 50);
	// }

	fr.html(frame_count);
	frame_count++;

}

function mousePressed() {
	//global_map上の移動
	if (game_manager.focus == "global_map") {
		let p = createVector(mouseX, mouseY);
		let cell_cordinate = global_map.convertToCellCordinate(p);
		if (global_map.verifyCell(cell_cordinate)) {
			if (global_map.terrain[cell_cordinate.x][cell_cordinate.y].accessible) {
				population.move(cell_cordinate);
				global_map.examineAccessibility(cell_cordinate);
				$("#dialog").removeClass("is-show");
				game_manager.state = "hunt";
			}
		}

	}
}

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
	game_manager.run();

}

function initialize() {

	// p5, jquery, javascriptで取得できるDOM要素はそれぞれ別物

	// frameRate(1);
	noiseSeed(new Date().getTime());
	canvas = createCanvas(cell_size * map_size + 230, cell_size * map_size);
	let container = select(".container");
	container.child(canvas);
	// let p = createP("paragraph");
	// container.child(p);



	// $(".container").append(canvas);

	game_manager = new GameManager();
	scene_manager = new SceneManager();
	event_manager = new EventManager();
	global_map = new GlobalMap();
	population = new Player();
	// event = new Event();
	// info = new Info();
	global_map.examineAccessibility(population.gps);

	//仕様上constructorでは無理
	for (let y = 0; y < this.rows; y++) {
		for (let x = 0; x < this.cols; x++) {
			global_map.terrain[x][y].habitant.evolve();
		}
	}
}