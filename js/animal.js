// 遺伝子から顔の描写 dot絵に変換するシステム

// genotype→phenotype→abilityという変換が最終目標
// DNAの複合が視力というphenotypeを決定して、視力、聴覚、顎、瞬発力といったphenotypeを総合したものが最終的なhuntingという能力値を決定する
// 簡易的にまず実装するなら、genotype→abilityもありだし、
// そもそもgenotypeをphenotypeと一対一対応の同じものとみなすこともできる


class Animal {

	constructor(p, dna) {
		if (dna) {
			this.dna = dna;
		} else {
			this.dna = new DNA();
		}
		this.phenotype = this.calcPhenotype(this.dna);
		this.fitness = 1;
		this.nutriture;
		this.health;
		if (p) {
			this.pos = p;
		} else {
			this.pos = createVector(0, 0);
		}
		this.wh = 70;
	}

	//現時点ではdnaが持つ数値の配列をkeyをもつオブジェクトに変換する役割
	calcPhenotype(dna) {
		let genes = dna.genes;
		let phenotype = {
			"hunting": genes[10],
			"foraging": genes[11],
			"climbing": genes[12],
			"hiding": genes[13],
			"fighting": genes[14],
			"swimming": genes[15],
			"scouting": genes[16],

			"negotiation": genes[17],
			"anticipation": genes[18],
			"deception": genes[19],
			"leadership": genes[20],
			"abstraction": genes[21],

			"digestion": genes[22],
			"attraction": genes[23],
			"fertility": genes[24],
			"stamina": genes[25],
			"thermal-efficiency": genes[26],
			"resistance": genes[27],

			"innovativeness": genes[28],
			"equality": genes[29],
			"curiosity": genes[30],
			"aggressivity": genes[31],
			"open-minded": genes[32],
			"independency": genes[33],
			"risktaking": genes[34]
		};
		return phenotype;
	}

	calcFitness() {

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
		let r = map(genes[0], 0, 1, 40, 70);
		let c = color(map(genes[1], 0, 1, 0, 255), map(genes[3], 0, 1, 0, 255), map(genes[2], 0, 1, 0, 255));
		let eye_y = map(genes[4], 0, 1, 0, 5); //目の高さ
		let eye_x = map(genes[5], 0, 1, 0, 10); //目の間の幅（そのものではない）
		let eye_size = map(genes[5], 0, 1, 0, 10);
		let eyecolor = color(map(genes[4], 0, 1, 0, 255), map(genes[5], 0, 1, 0, 255), map(genes[6], 0, 1, 0, 255));
		let mouthColor = color(map(genes[7], 0, 1, 0, 255), map(genes[8], 0, 1, 0, 255), map(genes[9], 0, 1, 0, 255));
		let mouth_y = map(genes[5], 0, 1, 0, 25);
		// let mouth_x = map(genes[5], 0, 1, -25, 25);
		let mouthw = map(genes[6], 0, 1, 0, 50);
		let mouthh = map(genes[7], 0, 1, 0, 10);

		push();
		translate(cell_size * map_size + offsetX, offsetY);
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
		rect(0, 0, this.wh, this.wh);
		pop();

		// Display fitness value
		textAlign(CENTER);
		fill(0.25);
		text('' + floor(this.fitness), cell_size * map_size + offsetX, offsetY + 55);
	}

}