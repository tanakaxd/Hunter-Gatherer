class Population {


	constructor() {
		this.animals = [];
		this.size = 30;
		for (let x = 0; x < this.size; x++) {
			this.animals.push(new Animal());
		}
		this.matingpool = [];
		this.generation = 0;
		this.average;
		this.gps = createVector(5, 5);
		this.on_what_terrain;
		this.clearFog(this.gps);
	}


	move(p) {
		this.gps = p;
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
		fill(100, 255, 100);
		ellipseMode(CORNER)
		ellipse(this.gps.x * cell_size, this.gps.y * cell_size, cell_size, cell_size);
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