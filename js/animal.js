// 遺伝子から顔の描写 dot絵に変換するシステム

// genotype→phenotype→abilityという変換が最終目標
// DNAの複合が視力というphenotypeを決定して、視力、聴覚、顎、瞬発力といったphenotypeを総合したものが最終的なhuntingという能力値を決定する
// 簡易的にまず実装するなら、genotype→abilityもありだし、
// そもそもgenotypeをphenotypeと一対一対応の同じものとみなすこともできる


class Animal {

	constructor(p, dna) {
		// if (dna) {
		// 	this.dna = dna;
		// } else {
		// 	this.dna = new DNA();
		// }
		this.dna = dna || new DNA();
		this.phenotype = this.calcPhenotype(this.dna);
		// this.weighted_phenotype;
		this.ability;
		this.fitness = 1;
		this.nutriture;
		this.health = 1;
		this.pos = p || createVector(0, 0);
		this.wh = 70;
		this.scale = 1.7;
	}

	//現時点ではdnaが持つ数値の配列をkeyをもつオブジェクトに変換する役割
	calcPhenotype(dna) {
		let genes = dna.genes;
		let phenotype = {
			"hunting": ~~(genes[10] * 10),
			"foraging": ~~(genes[11] * 10),
			"climbing": ~~(genes[12] * 10),
			"hiding": ~~(genes[13] * 10),
			"fighting": ~~(genes[14] * 10),
			"swimming": ~~(genes[15] * 10),
			"scouting": ~~(genes[16] * 10),

			"negotiation": ~~(genes[17] * 10),
			"anticipation": ~~(genes[18] * 10),
			"deception": ~~(genes[19] * 10),
			"leadership": ~~(genes[20] * 10),
			"abstraction": ~~(genes[21] * 10),

			"digestion": ~~(genes[22] * 10),
			"attraction": ~~(genes[23] * 10),
			"fertility": ~~(genes[24] * 10),
			"stamina": ~~(genes[25] * 10),
			"thermal-efficiency": ~~(genes[26] * 10),
			"resistance": ~~(genes[27] * 10),

			"innovativeness": ~~(genes[28] * 10),
			"equality": ~~(genes[29] * 10),
			"curiosity": ~~(genes[30] * 10),
			"aggressivity": ~~(genes[31] * 10),
			"open-minded": ~~(genes[32] * 10),
			"independency": ~~(genes[33] * 10),
			"risktaking": ~~(genes[34] * 10)
		};
		return phenotype;
	}

	weightPhenotype(coefficient) {
		let weighted_phenotype = this.phenotype;
		for (let key1 in this.phenotype) {
			for (let key2 in coefficient) {
				if (key1 == key2) {
					weighted_phenotype[key1] *= coefficient[key1];
				}
			}
		}
		return weighted_phenotype;
	}
	//
	calcFitness() {
		// population.ethics
		let fitness = 0; //undefinedにすると数を足せない。NaNになる
		let weighted_phenotype = this.weightPhenotype(population.fitness_coefficient);
		for (let key in weighted_phenotype) {
			fitness += weighted_phenotype[key];

		}
		fitness /= Object.keys(this.phenotype).length;
		this.fitness = ~~(fitness * this.health);
	}

	intercourse(partner) {
		let child_DNA = this.dna.crossover(partner.dna);
		let child = new Animal(null, child_DNA);
		return child; //Animal object
	}


	showPersonality() {
		let personality = {
			maxForce: this.DNA.maxForce.toFixed(3),
			maxSpeed: this.DNA.maxSpeed.toFixed(2),
			sight: this.DNA.sight.toFixed(1),
			aggressivity: this.DNA.aggressivity.toFixed(1),
			punctuality: this.DNA.punctuality.toFixed(3),
			softhearted: this.DNA.softhearted.toFixed(3),
			mass: this.DNA.mass.toFixed(3),
			fitness: this.fitness
		}
		return personality;
	}

	display(offsetX, offsetY) {


		// map(, 0, 1, 0, 255)

		let genes = this.dna.genes;
		let scale = this.scale;
		let r = map(genes[0], 0, 1, 40, 70) / scale;
		let c = color(map(genes[1], 0, 1, 0, 255), map(genes[3], 0, 1, 0, 255), map(genes[2], 0, 1, 0, 255));
		let eye_y = map(genes[4], 0, 1, 0, 5) / scale; //目の高さ
		let eye_x = map(genes[5], 0, 1, 0, 10) / scale; //目の間の幅（そのものではない）
		let eye_size = map(genes[5], 0, 1, 0, 10) / scale;
		let eyecolor = color(map(genes[4], 0, 1, 0, 255), map(genes[5], 0, 1, 0, 255), map(genes[6], 0, 1, 0, 255));
		let mouthColor = color(map(genes[7], 0, 1, 0, 255), map(genes[8], 0, 1, 0, 255), map(genes[9], 0, 1, 0, 255));
		let mouth_y = map(genes[5], 0, 1, 0, 25) / scale;
		// let mouth_x = map(genes[5], 0, 1, -25, 25);
		let mouthw = map(genes[6], 0, 1, 0, 50) / scale;
		let mouthh = map(genes[7], 0, 1, 0, 10) / scale;

		push();
		translate(cell_size * map_size + offsetX / scale, offsetY / scale);
		noStroke();

		// Draw the head
		fill(c);
		ellipseMode(CENTER);
		ellipse(0, 0, r, r);

		// Draw the eyes
		fill(eyecolor);
		rectMode(CENTER);
		rect(-eye_x, -eye_y, eye_size, eye_size);
		rect(eye_x, -eye_y, eye_size, eye_size);

		// Draw the mouth
		fill(mouthColor);
		rectMode(CENTER);
		rect(0, mouth_y, mouthw, mouthh);

		// Draw the bounding box
		stroke(0.25);
		noFill();
		rectMode(CENTER);
		rect(0, 0, this.wh / scale, this.wh / scale);
		pop();

		// Display fitness value
		textAlign(CENTER);
		fill(0.25);
		text('' + floor(this.fitness), cell_size * map_size + offsetX / scale, offsetY / scale + 55 / scale);
	}

}