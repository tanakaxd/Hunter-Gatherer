class Population {


	constructor() {
		this.animals = [];
		this.size = 4;
		for (let x = 0; x < this.size; x++) {
			this.animals.push(new Animal(createVector(50 + x * 75, 60), null));
		}
		this.leaders = [];
		this.matingpool = [];
		this.generation = 0;
		this.average = {
			"equality": 2,
			"hunting": 6,
			"negotiation": 3
		};
		this.max = {
			"equality": 7,
			"hunting": 9,
			"negotiation": 6
		};
		this.min = {
			"equality": 1,
			"hunting": 3,
			"negotiation": 2
		};
		this.gps = createVector(floor(map_size / 2), floor(map_size / 2));
		this.on_what_terrain = global_map.getTerrain(this.gps);
		this.clearFog(this.gps);
		this.rested = 0;
		this.ethics = {
			"egalitarian": 8, //jsでは連想配列のkeyに""があってもなくても同じ。jsonは必須
			polygamy: 8,
			pacifist: 7,
			xenophile: 4,
			innovative: 6,
			order: 2
		};
		//例えばhuntingの高さを集団が重要視する。ethicsと同列の役割？
		this.fitness_coefficient_modifier = {
			"hunting": 1.2
		}
	}


	move(p) {
		this.gps = p;
		this.on_what_terrain = global_map.getTerrain(this.gps);
		console.log(this.on_what_terrain);

		this.clearFog(this.gps);

	}

	clearFog(p) {
		global_map.terrain[p.x][p.y].fog = false;
	}

	static clearAllFog() {
		for (let y = 0; y < map_size; y++) {
			for (let x = 0; x < map_size; x++) {
				global_map.terrain[x][y].fog = false;
			}
		}
	}


	show() {
		//translateを使った方がいいかもしれない
		fill(100, 255, 100);
		ellipseMode(CORNER)
		ellipse(this.gps.x * cell_size, this.gps.y * cell_size, cell_size, cell_size);
	}

	rest() {
		this.rested++;
	}



	evaluate() {
		for (var i = 0; i < this.animals.length; i++) {
			this.animals[i].calcFitness();
		}
	}

	selection() {
		for (let animal of this.animals) {
			for (let x = 0; x < animal.fitness; x++) {
				this.matingpool.push(animal);
			}
		}
		let nextGeneration = [];
		for (var i = 0; i < this.size; i++) {
			let parentA = random(this.matingpool);
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