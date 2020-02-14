// 遺伝子から顔の描写 dot絵に変換するシステム

// genotype→phenotype→abilityという変換が最終目標
// DNAの複合が視力というphenotypeを決定して、視力、聴覚、顎、瞬発力といったphenotypeを総合したものが最終的なhuntingという能力値を決定する
// 簡易的にまず実装するなら、genotype→abilityもありだし、
// そもそもgenotypeをphenotypeと一対一対応の同じものとみなすこともできる

//phenotypeとabilityは現時点では区別しない

class Animal {

	constructor(dna) {
		this.dna = dna || new DNA();
		this.phenotype = this.calcPhenotype(this.dna);
		// this.ability; 
		this.fitness = 1;
		this.health = 1;
		this.pos; //画面上の位置。中心点をあらわす
		this.wh = pops_cell / pops_scale;
		this.scale = pops_scale;
		this.r;
	}

	//現時点ではdnaオブジェクトが持つ数値の配列をkeyをもつオブジェクト（連想配列）に変換する役割
	calcPhenotype(dna) {
		let genes = dna.genes;
		let phenotype = {
			"hunting": (genes[10] * 10).toFixed(2) - 0, //toFixedは文字列を返す。- 0 で数値に変換
			"foraging": (genes[11] * 10).toFixed(2) - 0,
			"swimming": (genes[15] * 10).toFixed(2) - 0,

			"hiding": (genes[13] * 10).toFixed(2) - 0,
			"fighting": (genes[14] * 10).toFixed(2) - 0,
			"fleeing": (genes[12] * 10).toFixed(2) - 0,

			"negotiation": (genes[17] * 10).toFixed(2) - 0,
			"deception": (genes[19] * 10).toFixed(2) - 0,
			"attraction": (genes[23] * 10).toFixed(2) - 0,

			"equality": (genes[29] * 10).toFixed(2) - 0,
			"lust": (genes[34] * 10).toFixed(2) - 0,
			"aggressivity": (genes[31] * 10).toFixed(2) - 0,
			"openminded": (genes[32] * 10).toFixed(2) - 0,
			"curiosity": (genes[30] * 10).toFixed(2) - 0,
			"independency": (genes[33] * 10).toFixed(2) - 0
		};
		return phenotype;
	}

	weightPhenotype(coefficient) {
		//weighted_phenotypeの計算のためにthis.phenotypeをコピーしたい。単純な=での代入はshallow copy
		//オブジェクトの浅いコピーは問題を起こすことを再確認。
		//二通りの方法ABで解決

		//A
		let weighted_phenotype = Object.assign({}, this.phenotype);

		//B
		// for (let key in this.phenotype) {
		// 	weighted_phenotype[key] = this.phenotype[key];
		// }

		for (let key1 in this.phenotype) {
			for (let key2 in coefficient) {
				if (key1 == key2) {
					weighted_phenotype[key1] *= coefficient[key1];
				}
			}
		}
		return weighted_phenotype;
	}

	calcFitness(coefficient) {
		// population.ethicsを計算に用いるかどうか
		let fitness = 0; //undefinedにすると数を足せない。NaNになる
		let weighted_phenotype = this.weightPhenotype(coefficient);
		for (let key in weighted_phenotype) {
			fitness += weighted_phenotype[key];
		}
		fitness /= Object.keys(this.phenotype).length;
		// this.fitness = ~~(fitness * this.health);
		this.fitness = fitness;
	}

	intercourse(partner, mutation_rate) {
		let child_DNA = this.dna.crossover(partner.dna, mutation_rate);
		let child = new Animal(child_DNA);
		return child; //Animal object
	}

	calcHealth(terrain) { //localMapオブジェクトを受け取る
		let phenotype = this.phenotype;
		//恣意的な計算式
		let a = max(phenotype.hunting * terrain.meats, phenotype.foraging * terrain.berries, phenotype.swimming * terrain.fishes); //100が基準値。大抵それ以上

		let b = (max(phenotype.hiding, phenotype.fighting, phenotype.fleeing) / 10 - 1) * (terrain.ecological_density ** 2); //負の値

		let avg = terrain.habitant.calcAvg();
		let c = random([phenotype.negotiation - avg.deception, phenotype.deception - avg.attraction, phenotype.attraction - avg.negotiation]) *
			(terrain.ecological_density ** 2) / 10; //-1~1

		this.health = this.health * (a / 100) + b + c;
		if (this.health > 1) this.health = 1;
	}

	show() {

		let genes = this.dna.genes;
		let scale = this.scale;
		let r = map(genes[0], 0, 1, 40, 70) / scale;
		let c = color(map(genes[1], 0, 1, 0, 255), map(genes[3], 0, 1, 0, 255), map(genes[2], 0, 1, 0, 255));
		let eye_y = map(genes[4], 0, 1, 0, 5) / scale; //目の高さ。顔の中心点が基準
		let eye_x = map(genes[5], 0, 1, 2, 16) / scale; //目の間の幅（そのものではない）
		let eye_size = map(genes[5], 0, 1, 4, 12) / scale;
		let eyecolor = color(map(genes[4], 0, 1, 0, 255), map(genes[5], 0, 1, 0, 255), map(genes[6], 0, 1, 0, 255));
		let mouthColor = color(map(genes[7], 0, 1, 0, 255), map(genes[8], 0, 1, 0, 255), map(genes[9], 0, 1, 0, 255));
		let mouth_y = map(genes[5], 0, 1, 0, 25) / scale;
		// let mouth_x = map(genes[5], 0, 1, -25, 25);
		let mouthw = map(genes[6], 0, 1, 0, 50) / scale;
		let mouthh = map(genes[7], 0, 1, 0, 10) / scale;

		push();
		//目や口はthis.posに紐づいていないので、translateでまとめてposの場所へ動かす
		translate(this.pos.x, this.pos.y);
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

		// fill(255);
		// ellipse(map_width + this.pos.x, this.pos.y, 10, 10);


		// Display fitness value
		// textAlign(CENTER);
		// fill(0.25);
		// text('' + floor(this.fitness), cell_size * map_size + offsetX / scale, offsetY / scale + 55 / scale);
	}

	valueToLegend(value) {
		if (value < 0.2) {
			return "catastrophic";
		} else if (value < 2) {
			return "awful";
		} else if (value < 4) {
			return "poor";
		} else if (value < 6) {
			return "average";
		} else if (value < 8) {
			return "good";
		} else if (value < 9.8) {
			return "excellent";
		} else {
			return "LEGENDARY";
		}
	}

	showHealth() {
		let health = this.health > 1 ? 1 : this.health;
		push();
		rectMode(CENTER);
		fill(255, 0, 0);
		translate((pops_cell / 2 / pops_scale) - (pops_cell / 10 / 2 / pops_scale), 0);
		rect(this.pos.x, this.pos.y, pops_cell / 10 / pops_scale, pops_cell / pops_scale);

		// noStroke();
		fill(0, 255, 0);
		let offset = (pops_cell * ((1 - health) / 2)) / pops_scale;
		translate(0, offset);
		rect(this.pos.x, this.pos.y, pops_cell / 10 / pops_scale, pops_cell * health / pops_scale);
		pop();
	}
}