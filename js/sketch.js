//main
let canvas, game_manager, scene_manager, global_map, population, event, info;
let geography_data, legendary_items;
let ethics_pool = {
	"egalitarian": "authoritarian",
	"polygamy": "monogamy",
	"militarist": "pacifist",
	"xenophile": "xenophobe",
	"innovative": "traditional",
	"chaos": "order"
};
let phenotype_pool = {
	"hunting": 0,
	"foraging": 0,
	"swimming": 0,

	"hiding": 0,
	"fighting": 0,
	"fleeing": 0,

	"negotiation": 0,
	"deception": 0,
	"attraction": 0,

	"equality": 0,
	"lust": 0,
	"aggressivity": 0,
	"openminded": 0,
	"curiosity": 0,
	"independency": 0
}

//DOM
let sliders = [];
let fr, fr_counter;
let frame_count = 0;

//canvas settings
let frame_rate = 60;
let pops_cell = 70; //セルのサイズ
let pops_col = 5;
let pops_scale = 1.7; //顔のパーツが絶対的な値で定義されているので縮尺によって調節する
let pops_width = pops_cell * pops_col;

//map setting
let cell_size = 30;
let map_size = 15; //横縦方向へのcellの数
let map_width = cell_size * map_size;

//game setting
let player_size = 10;
let player_size_max = 25;
let habitant_size = 15;
let base_mutation_rate = 0.03;
let infant_mortality = 0.1;
let rest_to_reproduce = 4;
let events_per_ethic = 1;
let hunt_scale = 5; //一回のサバイバルで環境資源をどれだけ使用するか
let habitant_evolve = true;
let how_many_evolves = 5;
let percent_to_survive = 0.3;

//sound
let mp3_btn, mp3_move, mp3_natural_selection, mp3_dialog, mp3_birth;

// img
let footprint, nest;

//utility
let debug = true;
let uber_mode = true;
let uber_speed = uber_mode ? 2 : 1;
let easy_envi = false;


// データを取り込む。マップ用。ajaxだとsetup drawが先行してしまいうまくいかない。
//p5関数を使えばうまくいくが、p5要素となってしまう。できたらjqueryの方でやりたい
function preload() {

	footprint = loadImage("img\\footprint.png");
	nest = loadImage("img\\nest.png");

	// $.ajax({
	// 	url: "./xml/geography.xml",
	// 	dataType: "xml"
	// }).done((data) => {
	// 	geography_data = data;
	// 	console.log(geography_data);

	// }).fail(() => {
	// 	console.error("ajax failed on preload");
	// })

	// geography_data = loadXML("./xml/geography.xml");
	// console.log(geography_data);

}

function setup() {
	initialize();

	frameRate(frame_rate);

	let button1 = select("#pause");
	let button2 = select("#resume");
	let button3 = select("#restart");
	let button4 = select("#popup-event")
	let button5 = select("#unfog");
	button1.mousePressed(pause);
	button2.mousePressed(resume);
	button3.mousePressed(restart);
	button4.mousePressed(popEvent);
	button5.mousePressed(Player.clearAllFog);
	sliders[0] = select("#egalitarian-authoritarian");
	sliders[1] = select("#polygamy-monogamy");
	sliders[2] = select("#militarist-pacifist");
	sliders[3] = select("#xenophile-xenophobe");
	sliders[4] = select("#innovativeness-traditional");
	sliders[5] = select("#chaos-order");

	mp3_btn = loadSound("sound\\zapsplat_multimedia_alert_notification_message_or_pop_up_001_45047.mp3");
	mp3_move = loadSound("sound\\zapsplat_multimedia_game_tone_short_fast_positive_plucked_003_44890.mp3");
	mp3_natural_selection = loadSound("sound\\zapsplat_multimedia_game_sound_menu_toggle_slide_select_001_45064.mp3");
	mp3_dialog = loadSound("sound\\zapsplat_multimedia_pop_up_chime_short_high_pitched_004_45770.mp3");
	mp3_birth = loadSound("sound\\zapsplat_multimedia_pop_up_chime_short_high_pitched_003_45769.mp3");


	if (debug) fr = createP();

}

function draw() {
	// アイドル状態の場合、描写自体をストップ(draw内部が空白)してもよい。入力があった場合フラグを立てる？
	background(global_map.getTerrain(population.gps).clr); //local_mapに合わせた色にする
	game_manager.run();
	scene_manager.run();

	fr.html(frame_count);
	frame_count++;

	mouseHovered();

}

function mousePressed() {
	// if (debug) console.log(mouseX, mouseY);

	//global_map上の移動
	let p = createVector(mouseX, mouseY);
	if (game_manager.focus == "global_map") {
		let cell_cordinate = global_map.convertToCellCordinate(p);
		if (global_map.verifyCell(cell_cordinate)) {
			if (global_map.terrain[cell_cordinate.x][cell_cordinate.y].accessible) {
				population.move(cell_cordinate);
				// global_map.examineAccessibility(cell_cordinate);
				$("#dialog").html("<div><p>探索を開始します</p><button>ok</button></div>");
				$("#dialog button").click(() => {
					game_manager.state = "explore";
					mp3_dialog.play();
				});
				game_manager.focus = "forbidden";
			}
		}
	}

	// animalsをクリックしたときの挙動
	if (true) {
		for (let animal of population.animals) {
			if (animal.r.contains(mouseX, mouseY)) {
				// console.table(animal.phenotype);

				//解除プロセス
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
				for (key in animal.phenotype) {
					$("#personality-" + key + " td:nth-child(2)").html(animal.valueToPlus(animal.phenotype[key]));
				}
			}
		}
	}

	//habitantをクリックしたとき。上のと共通部分があるので、もっと簡潔な書き方がある気がする。
	if (true) {
		let animals = global_map.getTerrain(population.gps).habitant.animals;
		for (let animal of animals) {
			if (animal.r.contains(mouseX, mouseY)) {

				//解除プロセス
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
				for (key in animal.phenotype) {
					$("#personality-" + key + " td:nth-child(2)").html(animal.valueToPlus(animal.phenotype[key]));
				}
			}
		}
	}
}

function mouseHovered() {
	let p = createVector(mouseX, mouseY);
	let tile_info = $("#tile-info");
	let cell_cordinate = global_map.convertToCellCordinate(p);
	if (global_map.verifyCell(cell_cordinate) && global_map.getTerrain(cell_cordinate).visited) {
		let tile = global_map.getTerrain(cell_cordinate);
		// console.log(tile.humidity, tile.temperature);

		tile_info.html(`<ul><li>${tile.geography}</li><li>${tile.temperature.toFixed()}℃</li>
		<li>${tile.humidity.toFixed()}%</li><li>meats: ${tile.meats.toFixed()}</li><li>berries: ${tile.berries.toFixed()}</li>
		<li>fishes: ${tile.fishes.toFixed()}</li><li>eco_density: ${tile.ecological_density.toFixed(2)}</li><li>nest: ${tile.nest?"あり":"なし"}</li></ul>`)
			.css("left", mouseX.toFixed()).css("top", mouseY.toFixed()).css("visibility", "visible");

	} else {
		tile_info.css("visibility", "hidden");
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
}

function initialize() {

	// p5, jquery, javascriptで取得できるDOM要素はそれぞれ別物

	noiseSeed(new Date().getTime());
	canvas = createCanvas(map_width + pops_width / pops_scale, map_width);
	let canvas_inner = select("#canvas-inner");
	canvas_inner.child(canvas);

	game_manager = new GameManager();
	scene_manager = new SceneManager();
	event_manager = new EventManager();
	global_map = new GlobalMap();
	population = new Player();
	global_map.examineAccessibility(population.gps);
	global_map.evolveHabitant();


	$("#day").html(`Day: ${game_manager.day}`);
	$("#score").html(`Score: ${game_manager.score}`);
	$("#rest").html(`Rest: ${population.rested}`);
	$("#next-children").html(`Children: +${population.next_children}`);
	$(".log").html("<p> -- -- -- --ここに起こったことが表示されていくよ-- -- -- -- </p>");
}

function addlog(text) {
	$(".log").prepend(`<P>Day ${game_manager.day}: [${game_manager.log_state}] ${text}<p>`);
}

let star_offset = 70;

function star(x, y, radius1, radius2, npoints) {
	let angle = TWO_PI / npoints;
	let halfAngle = angle / 2.0;
	beginShape();
	for (let a = star_offset; a < TWO_PI + star_offset; a += angle) {
		let sx = x + cos(a) * radius2;
		let sy = y + sin(a) * radius2;
		vertex(sx, sy);
		sx = x + cos(a + halfAngle) * radius1;
		sy = y + sin(a + halfAngle) * radius1;
		vertex(sx, sy);
	}
	endShape(CLOSE);
}

$("#uber_speed").change(() => {
	uber_speed = $("#uber_speed").val() - 0;
})