class Population {


	constructor() {
		this.animals = [];
		this.size;
		this.leaders = [];
		this.matingpool = [];
		this.generation = 0;
		this.gps;

		// 以下三つはその都度計算して取得する？　そうすれば必要な時に必ず最新の値が手に入る。
		//ただ計算量が増える恐れあり
		// this.avg = this.calcAvg();
		// this.max = this.calcMax();
		// this.min = this.calcMin();

		//現在地のlocalmapオブジェクトを取得
		//localmapをpopulationが持っていて、populationがlocalmapを持っているのは変？
		//population.gpsはあるので、計算に必要な時にはその都度取得すべきか
		// this.on_what_terrain = global_map.getTerrain(this.gps);

		this.ethics = {
			//jsでは連想配列のkeyに""があってもなくても同じ。jsonは必須
			"egalitarian": random() * 10,
			polygamy: random() * 10,
			pacifist: random() * 10,
			xenophile: random() * 10,
			innovative: random() * 10,
			order: random() * 10
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
			"open-minded": 1,
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


	rest() {
		this.rested++;
	}

	naturalSelection() {
		for (var i = 0; i < this.animals.length; i++) {
			this.animals[i].calcHealth(global_map.getTerrain(this.gps));
		}
	}

	evaluate() {
		for (var i = 0; i < this.animals.length; i++) {
			this.animals[i].calcFitness(this.fitness_coefficient);
		}
	}

	sexualSelection() {
		for (let animal of this.animals) {
			for (let x = 0; x < (10 - this.ethics.polygamy) + 1; x++) {
				this.matingpool.push(animal);
			}
			for (let x = 0; x < animal.fitness * animal.health * ((10 - this.ethics.egalitarian) ** 2); x++) {
				this.matingpool.push(animal);
			}
		}
		let nextGeneration = [];
		for (var i = 0; i < this.size; i++) {
			let parentA = random(this.matingpool);
			//親となる個体の非同一性を保障すべきか
			//例えばpolygamy-authoritarianの時
			let parentB = random(this.matingpool);
			let child = parentA.intercourse(parentB);
			nextGeneration.push(child);
		}
		this.animals = nextGeneration;
		this.matingpool = [];
		this.generation++;
		this.calcStats();
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

		// return this.ethics;
	}
}