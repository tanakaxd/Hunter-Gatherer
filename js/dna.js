class DNA {
	constructor(genes) {
		this.size = 40;
		// this.genes = genes || 
		if (genes) {
			this.genes = genes;
		} else {
			this.genes = [];
			for (let i = 0; i < this.size; i++) {
				this.genes.push(random(0, 1));
			}

		}
	}

	crossover(partner_dna) {
		let child_genes = [];
		for (let x = 0; x < this.size; x++) {
			if (random() < 0.5) {
				child_genes[x] = this.genes[x];
			} else {
				child_genes[x] = partner_dna.genes[x];
			}
			// this.mutate(child_genes);
		}
		// console.log(child_genes.length);

		return new DNA(child_genes);
	}

	// mutation(){

	// }

}