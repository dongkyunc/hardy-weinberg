// Standard canvas code
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

// Translate half a pixel to reduce blurriness
// Explained here: http://diveintohtml5.info/canvas.html
ctx.translate(0.5, 0.5);



var generations = [];

var Gene = function (_allele1, _allele2) {
    this.alleles = [_allele1, _allele2]

    if (this.alleles.indexOf("p") != -1) {
        this.phenotype = "dominant";
        if (this.alleles.indexOf("q") != -1) {
            this.genotype = "heterozygous";
        } else {
            this.genotype = "homozygous";
        }
    } else {
        this.phenotype = "recessive";
        this.genotype = "homozygous";
    }
}

var Organism = function (_allele1, _allele2, _sex) {
    this.gene = new Gene(_allele1, _allele2);
    this.sex = _sex;

    if (this.gene.phenotype === "dominant") {
        this.color = "gray";
    } else {
        this.color = "white";
    }
}

var Generation = function (parentGeneration, populationLimit) {
    this.organisms = [];

    for (var i = 0; i < populationLimit; i++) {
        // Choosing two parents
        var father = new Organism("x", "x", "female");
        var mother = new Organism("x", "x", "male");
        while (father.sex != "male") {
            father = parentGeneration.organisms[Math.floor(Math.random() * parentGeneration.organisms.length)];
        }
        while (mother.sex != "female") {
            mother = parentGeneration.organisms[Math.floor(Math.random() * parentGeneration.organisms.length)];
        }

        var offspringSex = Math.random() > .5 ? "male" : "female";
        var fatherAllele = father.gene.alleles[Math.round(Math.random())];
        var motherAllele = father.gene.alleles[Math.round(Math.random())];
        
        this.organisms.push(new Organism(fatherAllele, motherAllele, offspringSex));
    };

    this.pFrequency = 0;
    this.qFrequency = 0;
    for (var i = 0; i < this.organisms.length; i++){
        if (this.organisms[i].gene.phenotype === "dominant") {
            if (this.organisms[i].gene.genotype === "homozygous"){
                this.pFrequency += 2;
            } else {
                this.pFrequency++;
                this.qFrequency++;
            }
        } else {
            this.qFrequency += 2;
        }
    }

    this.pFrequency = this.pFrequency / (2*this.organisms.length);
    this.qFrequency = this.qFrequency / (2*this.organisms.length);
}

var StartingGeneration = function() {
    this.organisms = [];
};

var startingGeneration = new StartingGeneration();

for (var i = 0; i < 50; i++) {
    startingGeneration.organisms.push(new Organism("p", "p", "male"));
}
for (var i = 0; i < 100; i++) {
    startingGeneration.organisms.push(new Organism("p", "q", "male"));
}
for (var i = 0; i < 50; i++) {
    startingGeneration.organisms.push(new Organism("q", "q", "male"));
}
for (var i = 0; i < 50; i++) {
    startingGeneration.organisms.push(new Organism("p", "p", "female"));
}
for (var i = 0; i < 100; i++) {
    startingGeneration.organisms.push(new Organism("p", "q", "female"));
}
for (var i = 0; i < 50; i++) {
    startingGeneration.organisms.push(new Organism("q", "q", "female"));
}

var test = new Generation(startingGeneration, 100)