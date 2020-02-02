//main
let game_manager, scene_manager, global_map, population, event, info;

//settings
let cell_size = 30;
let map_size = 30;
let mutationRate = 0.03;

//utility
let debug = true;


//データを取り込む。イベント用、マップ用
// function preload() {
// 	loadJSON();
// }

function setup() {
	initialize();

}

function draw() {
	// scene_manager.stateの値によって、描写する内容をスイッチ
	// アイドル状態の場合、描写自体をストップ(draw内部が空白)してもよい。入力があった場合フラグを立てる？
	background(230);
	// game_manager.run();
	// scene_manager.run();
	// event_manager.run();
	global_map.show();
	population.show();
}

function mousePressed() {
	//global_map上の移動
	if (game_manager.focus == 1) {
		let p = createVector(mouseX, mouseY);
		let cell_cordinate = global_map.convertToCellCordinate(p);
		if (global_map.verifyCell(cell_cordinate)) {
			if (global_map.terrain[cell_cordinate.x][cell_cordinate.y].accessible) {
				population.move(cell_cordinate);
				global_map.examineAccessibility(cell_cordinate);
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
	game_manager.run();
}

function initialize() {

	// frameRate(1);
	noiseSeed(new Date().getTime());
	createCanvas(cell_size * map_size, cell_size * map_size);
	game_manager = new GameManager();
	scene_manager = new SceneManager();
	event_manager = new EventManager();
	global_map = new GlobalMap();
	population = new Population();
	// event = new Event();
	// info = new Info();
	global_map.examineAccessibility(population.gps);

	let button1 = select("#pause");
	let button2 = select("#resume");
	let button3 = select("#restart");
	let button4 = select("#popup-event")
	button1.mousePressed(pause);
	button2.mousePressed(resume);
	button3.mousePressed(restart);
	button4.mousePressed(popEvent);



}