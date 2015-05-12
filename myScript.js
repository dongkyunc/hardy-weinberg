var generations = [];

var Organism = function (allele1, allele2) {
    this.gene = [allele1, allele2];

    if (this.gene[0] === "p" && this.gene[1] === "p") {
        this.phenotype = "dominant";
        this.genotype = "homozygous";
    } else if (this.gene[0] === "p" && this.gene[1] === "q" || this.gene[0] === "q" && this.gene[1] === "p") {
        this.phenotype = "dominant";
        this.genotype = "heterozygous";
    } else if (this.gene[0] === "q" && this.gene[1] === "q") {
        this.phenotype = "recessive";
        this.genotype = "homozygous";
    }
}

var Generation = function (_organisms) {
    this.organisms = _organisms;
    this.populationSize = this.organisms.length;

    this.pp = 0;
    this.pq = 0;
    this.qq = 0;

    for (i = 0; i < this.populationSize; i++) {
        if (this.organisms[i].phenotype === "dominant") {
            if (this.organisms[i].genotype === "homozygous") {
                this.pp++;
            } else {  // organisms[i].genotype === "heterozygous"
                this.pq++;
            }
        } else { // organisms[i].phenotype === "recessive"
            this.qq++;
        }
    }

    this.p  = (2*this.pp + this.pq) / (2 * this.populationSize);
    this.q  = (2*this.qq + this.pq) / (2 * this.populationSize);
    this.ppPercent = this.pp / this.populationSize;
    this.pqPercent = this.pq / this.populationSize;
    this.qqPercent = this.qq / this.populationSize;

    this.mate = function (childrenAmount) {
        var childArray = [];
        for (var i = 0; i < childrenAmount; i++) {
            var father = this.organisms[Math.floor(Math.random() * this.populationSize)];
            var mother = this.organisms[Math.floor(Math.random() * this.populationSize)];

            var fatherAllele = father.gene[Math.round(Math.random())];
            var motherAllele = mother.gene[Math.round(Math.random())];

            childArray.push(new Organism(fatherAllele, motherAllele));
        }

        return new Generation(childArray);
    }
}

function round(n, d) {
    return Math.round(Math.pow(10, d) * n) / Math.pow(10, d);
}

function init() {
    var initPP = parseInt(document.getElementById("initPP").value);
    var initPQ = parseInt(document.getElementById("initPQ").value);
    var initQQ = parseInt(document.getElementById("initQQ").value);
    var childAmount = parseInt(document.getElementById("childAmount").value);

    var parents = [];

    for (var i = 0; i < initPP; i++) {
        parents.push(new Organism("p", "p"));
    }
    for (var i = 0; i < initPQ; i++) {
        parents.push(new Organism("p", "q"));
    }
    for (var i = 0; i < initQQ; i++) {
        parents.push(new Organism("q", "q"));
    }

    generations[0] = new Generation(parents);

    //document.getElementById("generations").innerHTML = dataToString(0);
    myLineChart.addData([initPP / childAmount, initPQ / childAmount, initQQ / childAmount], "");//
    generations.push(generations[0].mate(childAmount));

    //document.getElementById("generations").innerHTML += dataToString(1);
    myLineChart.addData([generations[1].ppPercent, generations[1].pqPercent, generations[1].qqPercent], "");//, "1");
}

function dataToString(n) {
    var formatString = "Generation " + n + ": <br>" +
        "p: " + round(generations[n].p, 2) + "<br>" +
        "q: " + round(generations[n].q, 2) + "<br><br>" +
        "Homozygous dominant: " + round(generations[n].pp, 2) + "<br>" +
        "Heterozygous dominant: " + round(generations[n].pq, 2) + "<br>" +
        "Homozygous recessive: " + round(generations[n].qq, 2) + "<br><br>";
    return formatString;
}

function mateClick() {
    var parent = generations[generations.length-1];
    var childAmount = parseInt(document.getElementById('childAmount').value);
    generations.push(parent.mate(childAmount));
    //document.getElementById("generations").innerHTML += dataToString(generations.length - 1);

    var children = generations[generations.length-1];
    myLineChart.addData([children.ppPercent, children.pqPercent, children.qqPercent], "");//generations.length - 1);
}