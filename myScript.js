"use strict";

var generations = []; // Holds all the data

// Config for the automatic mating
var mateTimer;
var timerBoolean = false;

// Holds info for genetic flow
var addedGeneration = [];
var removedGeneration = [0,0,0];

// Runs a timer to turn on/off mating
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

// Each item in the generation is an organism
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

// Placing it here for javascript optimization
// returnGenotype() is pretty useful for finding certain organisms
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
    // This is an array of organisms
    this.organisms = _organisms;
    this.populationSize = this.organisms.length;
    
    // Counts the number of each genotype
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
    
    // Counts the number of each gene (I don't think I ever used this data)
    this.p = (2 * this.pp + this.pq) / (2 * this.populationSize);
    this.q = (2 * this.qq + this.pq) / (2 * this.populationSize);
    this.ppPercent = this.pp / this.populationSize;
    this.pqPercent = this.pq / this.populationSize;
    this.qqPercent = this.qq / this.populationSize;
};

// Again, prototype for optimization
Generation.prototype.mate = function (childrenAmount) {
    // This handles gene flow
    migrate();
    var childArray = addedGeneration;
    
    // Too harsh of a environment makes the code sad and run way too many times
    var infiniteLoopStopper = 0;
    
    // This is where the new organisms are made
    for (var i = 0; i < childrenAmount; i++) {
        // Pulling two organisms from the parent generation
        var father = this.organisms[Math.floor(Math.random() * this.populationSize)];
        var mother = this.organisms[Math.floor(Math.random() * this.populationSize)];
        
        // Getting a random allele from each
        var fatherAllele = father.gene[Math.round(Math.random())];
        var motherAllele = mother.gene[Math.round(Math.random())];
        
        // Mutating threshold  on user-inputted mutation rates
        var pqMutateRate = parseFloat(document.getElementById("p-q-mutate").value);
        var qpMutateRate = parseFloat(document.getElementById("q-p-mutate").value);
        
        // Two random numbers
        var pqChance = Math.random();
        var qpChance = Math.random();
        
        // If the two random numbers are lower than the mutation threshold, the gene mutates
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

        // Creating a new organisms from the alleles. Hasn't survived yet
        var child = new Organism(fatherAllele, motherAllele);
        
        // Similar to mutation rate. Creating a threshold and an random number
        var killRate;
        var survivalRate = Math.random();
        
        // Making sure that emigration is handled before organism is added
        var emigrationQueueID;
        
        // Getting the survival threshold from the user input
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
        
        // Seeing if the organism passes the survival threshold
        if (survivalRate < killRate) {
            // It lives!
            
            // If all the emigrants haven't left yet, this one child will
            if (removedGeneration[emigrationQueueID] < 1) {
                // Only runs when there is no more emigration
                childArray.push(child);
            } else {
                // Amount more needed to emigrate goes down by one
                removedGeneration[emigrationQueueID]--;
                i--;   
            }
        } else {
            // Child isn't added, so loop is added
            i--;
            infiniteLoopStopper++;
            
            // Stopping if it's too slow
            if (infiniteLoopStopper > this.organisms.length*200) {
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
    // Resetting gene flow variables
    addedGeneration = [];
    removedGeneration = [0,0,0];
    
    // New generation of children
    return new Generation(childArray);
};

// Only runs if it's the first generation
function init() {
    // Parsing data
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
    
    
    // Some UI changes
    document.getElementById("initial").style.display = "none";
    document.getElementById("pop").style.display = "block";
    document.getElementById("initPP").disabled = true;
    document.getElementById("initPQ").disabled = true;
    document.getElementById("initQQ").disabled = true;

    document.getElementById('childAmount').value = parseInt(document.getElementById("initPP").value) + 
                  parseInt(document.getElementById("initPQ").value) + 
                  parseInt(document.getElementById("initQQ").value);
}

function mateClick() {
    // Altering pop. amount by gene value
    var childAmount = parseInt(document.getElementById('childAmount').value) +
                      parseInt(document.getElementById("pp-gen-drift").value) +
                      parseInt(document.getElementById("pq-gen-drift").value) +
                      parseInt(document.getElementById("qq-gen-drift").value);
    document.getElementById('childAmount').value = childAmount;
    
    // Edge case to see if all organisms are gone
    if (childAmount <= 0) {
        alert("Everyone died! End of simulation.");
        document.getElementById("mate").disabled = true;
        document.getElementById("autorun").disabled = true;
        if (timerBoolean) {
            autoMate();
        }
        return;
    }
    
    // Init if first generation
    if (generations.length === 0) {
        init();
    }
    
    // Calling the latest generation to mate
    var parent = generations[generations.length - 1];
    generations.push(parent.mate(childAmount));
    
    // Pushing the newest generation (From above parent) to the 
    var children = generations[generations.length - 1];
    myLineChart.addData([children.ppPercent, children.pqPercent, children.qqPercent], "");
    
    // This increments the counter on the screen
    document.getElementById("genCounter").innerHTML = generations.length - 1;
}

// Resets everthing
function clearGenerations() {
    if (timerBoolean) {
        autoMate();
    }
    
    for (var i = 0; i < generations.length; i++) {
        myLineChart.removeData();
    }
    generations = [];
    
    // UI Stuff
    document.getElementById("initial").style.display = "block";
    document.getElementById("pop").style.display = "none";
    
    document.getElementById("initPP").disabled = false;
    document.getElementById("initPQ").disabled = false;
    document.getElementById("initQQ").disabled = false;
    
    document.getElementById("mate").disabled = false;
    document.getElementById("autorun").disabled = false;
    
    document.getElementById("genCounter").innerHTML = 0;
}

// Gene flow
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