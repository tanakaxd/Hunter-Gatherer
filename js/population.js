class Population {


	constructor() {
		this.animals = [];
		this.size;
		this.leaders = [];
		this.matingpool = [];
		this.generation = 0;
		this.average;
		this.max;
		this.min;
		this.gps;
		//現在地のlocalmapオブジェクトを取得
		//localmapをpopulationが持っていて、populationがlocalmapを持っているのは変？
		//population.gpsはあるので、計算に必要な時にはその都度取得すべきか
		// this.on_what_terrain = global_map.getTerrain(this.gps);
		this.ethics;
		//例えばhuntingの高さを集団が重要視する。ethicsと同列の役割？
		this.fitness_coefficient;
	}


	rest() {
		this.rested++;
	}

	evaluate() {
		for (var i = 0; i < this.animals.length; i++) {
			this.animals[i].calcFitness(this.fitness_coefficient);
		}
	}

	sexualSelection() {
		for (let animal of this.animals) {
			for (let x = 0; x < this.ethics.polygamy; x++) {
				this.matingpool.push(animal);
			}
			for (let x = 0; x < animal.fitness * (10 - this.ethics.egalitarian); x++) {
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
	}



	showAnimalsPersonality() {
		// let average = {};
		let sum = {
			sight: null,
			maxForce: null,
			maxSpeed: null,
			aggressivity: null,
			punctuality: null,
			softheadted: null,
			mass: null,
			lifespan: null,
			flying: null
		};
		for (let animal of this.animals) {
			console.log(animal.showPersonality());
			for (let key in animal.gene.returnObjectLiteral()) {
				sum[key] += animal.gene.returnObjectLiteral()[key];
			}
		}
		for (let key in sum) {
			sum[key] /= this.animals.length;
		}
		this.average = sum;
		console.log(sum);
	}
	//内部的な値を0-100にmapする
}