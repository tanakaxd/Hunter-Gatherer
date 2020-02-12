class DNA {

	constructor(genes) {
		this.size = 40;
		if (genes) {
			this.genes = genes;
		} else {
			this.genes = [];
			for (let i = 0; i < this.size; i++) {
				this.genes.push(random(0, 1));
			}
		}
	}

	crossover(partner_dna, mutation_rate) {
		let child_genes = [];
		for (let x = 0; x < this.size; x++) {
			if (random() < 0.5) {
				child_genes[x] = this.genes[x];
			} else {
				child_genes[x] = partner_dna.genes[x];
			}
			this.mutate(child_genes[x], mutation_rate);
		}
		return new DNA(child_genes);
	}

	mutate(gene, mutation_rate) {
		if (random() <= mutation_rate) {
			gene = random();
		}
	}
}