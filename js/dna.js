class DNA {
	constructor() {
		this.genes = [];
		this.size = 30;
		for (let i = 0; i < this.size; i++) {
			this.genes.push(random(0, 1));
		}
	}

	crossover(partner_gene) {
		// Gene object→Gene object
		let child_gene = [];
		for (let x = 0; x < this.length; x++) {
			if (random() < 0.5) {
				child_gene[x] = this.genotype[x];
			} else {
				child_gene[x] = partner_gene.genotype[x];
			}
			this.mutate(child_gene);
			return new this.constructor(child_gene);
		}
	}

	// mutation(){

	// }

	// returnObjectLiteral(){
	// 	let obl = {
	// 		sight : this.sight,
	// 		maxForce : this.maxForce,
	// 		maxSpeed : this.maxSpeed,
	// 		aggressivity : this.aggressivity,
	// 		punctuality : this.punctuality,
	// 		softheadted : this.softhearted,
	// 		mass : this.mass,
	// 		lifespan : this.lifespan,
	// 		flying : this.flying
	// 	}
	// 	return obl;
	// }
}