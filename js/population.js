//親となる個体の非同一性を保障すべきかどうか

class Population {

	constructor() {
		this.animals = [];
		this.size;
		// this.leaders = [];
		this.matingpool = [];
		this.generation = 1;
		this.gps;
		this.mutation_rate = base_mutation_rate;

		this.ethics = {
			//jsでは連想配列のkeyに""があってもなくても同じ。jsonは必須
			"egalitarian": random() * 10,
			polygamy: random() * 10,
			militarist: random() * 10,
			xenophile: random() * 10,
			innovative: random() * 10,
			chaos: random() * 10
		};
		//例えばhuntingの高さを集団が重要視する。ethicsと同列の役割？
		this.fitness_coefficient = {
			"hunting": 1,
			"foraging": 1,
			"swimming": 1,

			"hiding": 1,
			"fighting": 1,
			"fleeing": 1,

			"negotiation": 1,
			"deception": 1,
			"attraction": 1,

			"equality": 1,
			"lust": 1,
			"aggressivity": 1,
			"openminded": 1,
			"curiosity": 1,
			"independency": 1
		};
	}

	calcAvg() {
		let sum = {};
		let count = 0; //undefined に何かを足すことはできないので、一匹目は=で代入。0で初期化する方法もある
		this.animals.forEach((animal, index) => {
			for (let key in animal.phenotype) {
				if (count == 0) {
					sum[key] = animal.phenotype[key];
				} else {
					sum[key] += animal.phenotype[key];
				}
			}
			count++;
		})
		for (let key in sum) {
			sum[key] /= this.animals.length;
		}
		return sum;
	}

	calcMax() {
		let maxi = {};
		let pool = [];
		for (let key in this.animals[0].phenotype) {
			this.animals.forEach((animal, index) => {
				pool.push(animal.phenotype[key]);
			})
			maxi[key] = max(pool); //maxi.keyだとkeyという名前のkeyになってしまう。つまり、maxi["key"]に相当か
			pool = [];
		}
		return maxi;
	}

	calcMin() {
		let mini = {};
		let pool = [];
		for (let key in this.animals[0].phenotype) {
			this.animals.forEach((animal, index) => {
				pool.push(animal.phenotype[key]);
			})
			mini[key] = min(pool);
			pool = [];
		}
		return mini;
	}

	calcStats() {
		this.avg = this.calcAvg();
		this.max = this.calcMax();
		this.min = this.calcMin();
	}

	naturalSelection() {
		let casualities = 0;
		for (let i = this.animals.length - 1; i >= 0; i--) {
			this.animals[i].calcHealth(global_map.getTerrain(this.gps));
			if (this.animals[i].health <= 0) {
				this.animals.splice(i, 1);
				casualities++;
			}
		}
		if (debug && this instanceof Player) {
			let temp = [];
			for (let animal of this.animals) {
				temp.push(animal.health);
			}
			console.log(temp);
		}
		if (this instanceof Player && casualities > 0) {
			addlog(`仲間が${casualities}人、命を落としてしまった…`);
			mp3_natural_selection.play();
		}
		if (this instanceof Player) {
			global_map.getTerrain(this.gps).hunted();
		}
	}

	evaluate() {
		for (let i = 0; i < this.animals.length; i++) {
			this.animals[i].calcFitness(this.fitness_coefficient);
		}
	}

	sexualSelection() {
		//呼び出した継承先クラスがどっちなのかで処理を変えている部分がある。
		//オーバーライドでクラスごとに実装すべきなのか？

		for (let animal of this.animals) {
			for (let x = 0; x < (10 - this.ethics.polygamy) + 1; x++) {
				this.matingpool.push(animal);
			}
			for (let x = 0; x < animal.fitness * animal.health * ((10 - this.ethics.egalitarian) ** 2); x++) {
				this.matingpool.push(animal);
			}
		}
		let nextGeneration = [];

		//サイズは可変。fertilityというphenotypeを作って一定以上なければ出生時に死亡させる？
		let next_generation_size = this instanceof Player ? this.animals.length + this.next_children : this.size;
		let have_nest = this instanceof Player ? global_map.getTerrain(this.gps).nest : true;
		// let actual_size = next_generation_size;
		let mutation_rate_modifier = map(this.ethics.xenophile, 0, 10, 0.5, 2);
		let infant_casualities = 0;

		for (let i = 0; i < next_generation_size; i++) {
			let parentA = random(this.matingpool);
			let parentB = random(this.matingpool);

			//同一個体防止ブロック
			let preventer = 0;
			while (parentA === parentB && preventer < 1000) {
				parentB = random(this.matingpool);
				preventer++;
			}

			let child = parentA.intercourse(parentB, this.mutation_rate * mutation_rate_modifier);
			//nestがあればinfant_mortalityを無視して出産できる
			if (have_nest) {
				nextGeneration.push(child);
			} else {
				if (random() > infant_mortality) {
					nextGeneration.push(child);
				} else {
					// actual_size--;
					infant_casualities++;
				}
			}


			//healthはすでにselectionに使われている値なので、重複して計算することになる。その結果選択が激しくなりすぎて種が特化してしまう。
			// if (this instanceof Habitant) {
			// 	nextGeneration.push(child);
			// } else if (parentA.health + parentB.health > 1.5) {
			// 	nextGeneration.push(child);
			// } else {
			// 	actual_size--;
			// }
		}

		this.animals = nextGeneration;
		this.matingpool = [];
		this.generation++;
		this.calcStats();
		this instanceof Habitant ? this.setPosition(555) : this.setPosition();
		if (this instanceof Player) {
			if (infant_casualities > 0) {
				addlog(`出生時に${infant_casualities}人の赤子が命を落としてしまった…`);
			} else if (infant_casualities == 0) {
				addlog(`全員が無事に生まれました！`);
			}
			// addlog(`${actual_size}人の新世代が誕生しました!`);
			addlog(`${next_generation_size - infant_casualities}人の新世代が誕生しました`);
			mp3_birth.play();
			this.rest(-this.rested); // this.rested = 0;
			this.setNextChildren();
		}
	}

	consolePopulation(full) {
		if (debug) {
			console.table(this.avg);
			if (full == "full") {
				this.animals.forEach((animal) => {
					console.table(animal.phenotype);
				})
			}
		}
	}

	consoleEthics() {
		console.table(this.ethics);
	}



	setPosition(yoffset) {
		//habitantの時はyoffset分下にずらす。
		// このメソッドもsexualSelectionのように変数を取らずに、呼び出したクラスによって条件分岐させる方法もある
		let row = 0;
		let col = 0;
		for (let i = 0; i < this.animals.length; i++) {
			if (i != 0 && i % pops_col == 0) {
				row++;
				col = 0;
			}
			let offset = pops_cell / 2; //顔の中心点が角の上にくるのを補正する値。
			if (yoffset) {
				this.animals[i].pos = createVector(map_width + (offset + col * pops_cell) / pops_scale, (offset + row * pops_cell + yoffset) / pops_scale);
			} else {
				this.animals[i].pos = createVector(map_width + (offset + col * pops_cell) / pops_scale, (offset + row * pops_cell) / pops_scale);
			}
			let pos = this.animals[i].pos;
			let wh = this.animals[i].wh;
			this.animals[i].r = new Rectangle(pos.x, pos.y, wh, wh);
			col++;
		}
	}
}