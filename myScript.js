var generations = [];

var Organism = function (allele1, allele2) {
    this.gene = [allele1, allele2];

    if (this.gene.indexOf("p") !== -1) {
        this.phenotype = "dominant";
        if (this.gene.indexOf("q") !== -1) {
            this.genotype = "heterozygous";
        } else {
            this.genotype = "homozygous";
        }
    } else {
        this.phenotype = "recessive";
        this.genotype = "homozygous";
    }

    if (this.phenotype === "dominant") {
        this.color = "gray";
    } else {
        this.color = "white";
    }
};

var Generation = function (parentGeneration, populationLimit) {
    this.organisms = [];

    for (var i = 0; i < populationLimit; i++) {
        // Choosing two parents
        var father = parentGeneration.organisms[Math.floor(Math.random() * parentGeneration.organisms.length)];
        var mother = parentGeneration.organisms[Math.floor(Math.random() * parentGeneration.organisms.length)];

        var fatherAllele = father.gene[Math.round(Math.random())];
        var motherAllele = father.gene[Math.round(Math.random())];
        
        this.organisms.push(new Organism(fatherAllele, motherAllele));
    };

    this.pFrequency = 0;
    this.qFrequency = 0;

    this.pp = 0;
    this.pq = 0;
    this.qq = 0;
    
    for (var i = 0; i < this.organisms.length; i++){
        if (this.organisms[i].phenotype === "dominant") {
            if (this.organisms[i].genotype === "homozygous"){
                this.pFrequency += 2;
                this.pp++;
            } else {
                this.pFrequency++;
                this.qFrequency++;
                this.pq++;
            }
        } else {
            this.qFrequency += 2;
            this.qq++;
        }
    }

    this.pFrequency = this.pFrequency / (2*this.organisms.length);
    this.qFrequency = this.qFrequency / (2*this.organisms.length);
}

function rounding(n, d) {
    return Math.round(Math.pow(10,d)*n) / Math.pow(10,d);
}

function init() {
    var homoGray = document.getElementById("initHomoGray");
    var heteroGray = document.getElementById("initHeteroGray");
    var homoWhite = document.getElementById("initHomoWhite");
    var childAmount = document.getElementById("initChildAmount");

    var Parents = function() {
        this.organisms = [];
    }

    // Really weird hack
    var parents = new Parents();

    for (var i = 0; i < homoGray.value; i++) {
        parents.organisms.push(new Organism("p","p"));
    }
    for (var i = 0; i < heteroGray.value; i++) {
        parents.organisms.push(new Organism("p","q"));
    }
    for (var i = 0; i < homoWhite.value; i++) {
        parents.organisms.push(new Organism("q","q"));
    }

    generations[0] = (new Generation(parents, childAmount.value));


    document.getElementById("f1").innerHTML = "First generation: <br> p: " + rounding(generations[0].pFrequency, 2) + "<br>" +
                                                "q: " + rounding(generations[0].qFrequency, 2) + "<br><br>" +
                                                "Homozygous dominant: " + generations[0].pp + "<br>" + 
                                                "Heterozygous dominant: " + generations[0].pq + "<br>" + 
                                                "Homozygous recessive: " + generations[0].qq + "<br>";
}