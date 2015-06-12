"use strict";

var generations = [];
var mateTimer;
var timerBoolean = false;

var addedGeneration = [];
var removedGeneration = [0,0,0];

function autoMate() {
    if (!timerBoolean) {
        mateTimer = setInterval(mateClick, 300);
        timerBoolean = true;
        document.getElementById("autorun").firstChild.data = "Turn off autorun";
    } else {
        clearInterval(mateTimer);
        timerBoolean = false;
        document.getElementById("autorun").firstChild.data = "Turn on autorun"
    }
}

var Organism = function (allele1, allele2) {
    this.gene = [allele1, allele2];

    if (this.gene[0] === "p" && this.gene[1] === "p") {
        this.phenotype = "dominant";
        this.genotype = "homozygous";
    } else if ((this.gene[0] === "p" && this.gene[1] === "q") || (this.gene[0] === "q" && this.gene[1] === "p")) {
        this.phenotype = "dominant";
        this.genotype = "heterozygous";
    } else { // if (this.gene[0] === "q" && this.gene[1] === "q") {
        this.phenotype = "recessive";
        this.genotype = "homozygous";
    }
};

Organism.prototype.returnGenotype = function () {
    if (this.phenotype === "dominant") {
        if (this.genotype === "homozygous") {
            return "pp";
        } else { // genotype === "heterozygous"
            return "pq";
        }
    } else { //if (this.phenotype === "recessive") {
        return "qq";
    }
};

var Generation = function (_organisms) {
    this.organisms = _organisms;
    this.populationSize = this.organisms.length;

    this.pp = 0;
    this.pq = 0;
    this.qq = 0;

    for (var i = 0; i < this.populationSize; i++) {
        switch (this.organisms[i].returnGenotype()) {
        case "pp":
            this.pp++;
            break;
        case "pq":
            this.pq++;
            break;
        case "qq":
            this.qq++;
            break;
        default:
            console.log("There's literally no way you got here. How the hell.");
            break;
        }
    }

    this.p = (2 * this.pp + this.pq) / (2 * this.populationSize);
    this.q = (2 * this.qq + this.pq) / (2 * this.populationSize);
    this.ppPercent = this.pp / this.populationSize;
    this.pqPercent = this.pq / this.populationSize;
    this.qqPercent = this.qq / this.populationSize;
};

Generation.prototype.mate = function (childrenAmount) {
    migrate();
    var childArray = addedGeneration;
    var x = 0;
    for (var i = 0; i < childrenAmount; i++) {
        var father = this.organisms[Math.floor(Math.random() * this.populationSize)];
        var mother = this.organisms[Math.floor(Math.random() * this.populationSize)];

        var fatherAllele = father.gene[Math.round(Math.random())];
        var motherAllele = mother.gene[Math.round(Math.random())];

        var pqMutateRate = parseFloat(document.getElementById("p-q-mutate").value);
        var qpMutateRate = parseFloat(document.getElementById("q-p-mutate").value);

        var pqChance = Math.random();
        var qpChance = Math.random();

        if (fatherAllele === "p" && pqChance < pqMutateRate) {
            fatherAllele = "q";
        } else if (qpChance < qpMutateRate) { // fatherAllele === "q"
            fatherAllele = "p";
        }

        if (motherAllele === "p" && pqChance < pqMutateRate) {
            motherAllele = "q";
        } else if (qpChance < qpMutateRate) { // fatherAllele === "q"
            motherAllele = "p";
        }

        var child = new Organism(fatherAllele, motherAllele);
        var killRate;
        var survivalRate = Math.random();
        var emigrationQueueID;
        

        switch (child.returnGenotype()) {
        case "pp":
            killRate = parseFloat(document.getElementById("pp-survival").value);
            emigrationQueueID = 0;
            break;
        case "pq":
            killRate = parseFloat(document.getElementById("pq-survival").value);
            emigrationQueueID = 1;
            break;
        case "qq":
            killRate = parseFloat(document.getElementById("qq-survival").value);
            emigrationQueueID = 2;
            break;
        default:
            console.log("There's literally no way you got here. How the hell.");
            killRate = -1;
            break;
        }
        
        if (survivalRate < killRate) {
            // It lives!
            //childArray.push(child);
            if (removedGeneration[emigrationQueueID] < 1) {
                childArray.push(child);
            } else {
                removedGeneration[emigrationQueueID]--;
                i--;   
            }
        } else {
            i--;
            x++;
            
            if (x > this.organisms.length*200) {
                alert("Hm... It looks like natural selection was too hard on this species. Everyone died. Exiting program.");
                document.getElementById("mate").disabled = true;
                document.getElementById("autorun").disabled = true;
                
                if (timerBoolean) {
                    autoMate();
                }
                
                return this.organisms;
            }
        }


    }
    addedGeneration = [];
    removedGeneration = [0,0,0];
    return new Generation(childArray);
};

function init() {
    var initPP = parseInt(document.getElementById("initPP").value);
    var initPQ = parseInt(document.getElementById("initPQ").value);
    var initQQ = parseInt(document.getElementById("initQQ").value);
    var childAmount = initPP + initPQ + initQQ;

    var parents = [];

    for (var i = 0; i < initPP; i++) {
        parents.push(new Organism("p", "p"));
    }
    for (i = 0; i < initPQ; i++) {
        parents.push(new Organism("p", "q"));
    }
    for (i = 0; i < initQQ; i++) {
        parents.push(new Organism("q", "q"));
    }

    generations[0] = new Generation(parents);
    myLineChart.addData([initPP / childAmount, initPQ / childAmount, initQQ / childAmount], "");
}

function mateClick() {
    var childAmount = parseInt(document.getElementById('childAmount').value) +
                      parseInt(document.getElementById("pp-gen-drift").value) +
                      parseInt(document.getElementById("pq-gen-drift").value) +
                      parseInt(document.getElementById("qq-gen-drift").value);
    document.getElementById('childAmount').value = childAmount;
    
    if (childAmount <= 0) {
        alert("Everyone died! End of simulation.");
        document.getElementById("mate").disabled = true;
        document.getElementById("autorun").disabled = true;
        if (timerBoolean) {
            autoMate();
        }
        return;
    }
    
    if (generations.length === 0) {
        init();
        document.getElementById("initial").style.display = "none";
        document.getElementById("pop").style.display = "block";
        document.getElementById("initPP").disabled = true;
        document.getElementById("initPQ").disabled = true;
        document.getElementById("initQQ").disabled = true;
        
        document.getElementById('childAmount').value = parseInt(document.getElementById("initPP").value) + 
                      parseInt(document.getElementById("initPQ").value) + 
                      parseInt(document.getElementById("initQQ").value);
    }
    var parent = generations[generations.length - 1];
    generations.push(parent.mate(childAmount));

    var children = generations[generations.length - 1];
    myLineChart.addData([children.ppPercent, children.pqPercent, children.qqPercent], "");
    
    document.getElementById("genCounter").innerHTML = generations.length - 1;
}

function clearGenerations() {
    if (timerBoolean) {
        autoMate();
    }
    
    for (var i = 0; i < generations.length; i++) {
        myLineChart.removeData();
    }
    generations = [];
    
    document.getElementById("initial").style.display = "block";
    document.getElementById("pop").style.display = "none";
    
    document.getElementById("initPP").disabled = false;
    document.getElementById("initPQ").disabled = false;
    document.getElementById("initQQ").disabled = false;
    
    document.getElementById("mate").disabled = false;
    document.getElementById("autorun").disabled = false;
    
    document.getElementById("genCounter").innerHTML = 0;
}

function migrate() {
    var ppGroup = parseInt(document.getElementById("pp-gen-drift").value)
    if (ppGroup >= 0) {
        for (var i = 0; i < ppGroup; i++) {
            addedGeneration.push(new Organism("p", "p"));
        }
    } else {
        removedGeneration[0] = Math.min(-ppGroup, generations[generations.length-1].pp);
    }
    
    var pqGroup = parseInt(document.getElementById("pq-gen-drift").value)
    if (pqGroup >= 0) {
        for (var i = 0; i < pqGroup; i++) {
            addedGeneration.push(new Organism("p", "q"));
        }
    } else {
        removedGeneration[1] = Math.min(-pqGroup, generations[generations.length-1].pq);
    }
    
    var qqGroup = parseInt(document.getElementById("qq-gen-drift").value)
    if (qqGroup >= 0) {
        for (var i = 0; i < qqGroup; i++) {
            addedGeneration.push(new Organism("q", "q"));
        }
    } else {
        removedGeneration[2] = Math.min(-qqGroup, generations[generations.length-1].qq);
    }
}