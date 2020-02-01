// 遺伝子から顔の描写 dot絵に変換するシステム


class Animal {

	constructor() {
		this.genotype = new Gene();
		// this.phenotype = this.calcPhenotype(this.genotype);
		this.fitness = null;
		this.hungriness;
		this.health;
		// this.pos = createVector(0, 0);
	}

	calcPhenotype(genotype) {
		return phenotype;
	}

	calcFitness() {

	}

	intercourse(partner) {
		let child = new Animal();

		//もっと簡潔に書きたい。genotypeがただの配列なら簡単かもしれない
		if (mutationRate < random()) {
			if (random() < 0.5) {
				child.gene.sight = this.gene.sight;
			} else {
				child.gene.sight = partner.gene.sight;
			}
		}
		if (mutationRate < random()) {
			if (random() < 0.5) {
				child.gene.maxForce = this.gene.maxForce;
			} else {
				child.gene.maxForce = partner.gene.maxForce;
			}
		}
		if (mutationRate < random()) {
			if (random() < 0.5) {
				child.gene.maxSpeed = this.gene.maxSpeed;
			} else {
				child.gene.maxSpeed = partner.gene.maxSpeed;
			}
		}
		if (mutationRate < random()) {
			if (random() < 0.5) {
				child.gene.aggressivity = this.gene.aggressivity;
			} else {
				child.gene.aggressivity = partner.gene.aggressivity;
			}
		}
		if (mutationRate < random()) {
			if (random() < 0.5) {
				child.gene.trailWeight = this.gene.trailWeight;
			} else {
				child.gene.trailWeight = partner.gene.trailWeight;
			}
		}
		if (mutationRate < random()) {
			if (random() < 0.5) {
				child.gene.separateWeight = this.gene.separateWeight;
			} else {
				child.gene.separateWeight = partner.gene.separateWeight;
			}
		}
		if (mutationRate < random()) {
			if (random() < 0.5) {
				child.gene.mass = this.gene.mass;
			} else {
				child.gene.mass = partner.gene.mass;
			}
		}
		return child;
	}

	showPersonality() {
		let personality = {
			maxForce: this.gene.maxForce.toFixed(3),
			maxSpeed: this.gene.maxSpeed.toFixed(2),
			sight: this.gene.sight.toFixed(1),
			aggressivity: this.gene.aggressivity.toFixed(1),
			punctuality: this.gene.punctuality.toFixed(3),
			softhearted: this.gene.softhearted.toFixed(3),
			mass: this.gene.mass.toFixed(3),
			fitness: this.fitness
		}
		return personality;
	}


	show() {
		// fill(255);
		// ellipse(this.pos.x,this.pos.y,16,16);
		// imageMode(CENTER);
		// image(img, this.pos.x, this.pos.y, 18 * sqrt(this.gene.mass), 18 * sqrt(this.gene.mass));
		if (debug) {
			push();
			noFill();
			ellipse(this.pos.x, this.pos.y, this.gene.sight * 2);
			rectMode(CENTER);
			rect(this.pos.x, this.pos.y, this.gene.maxForce * 100, this.gene.maxSpeed * 20);
			pop();
		}
	}

}