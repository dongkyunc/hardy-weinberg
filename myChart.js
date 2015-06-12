// Get the context of the canvas element we want to select
var ctx = document.getElementById("myChart").getContext("2d");

var initData = {
    labels: [],
    datasets: [
        {
            label: "pp",
            fillColor: "rgba(0,0,0,0)",
            strokeColor: "rgba(127,21,55,1)",
            pointColor: "rgba(127,21,55,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(127,21,55,1)",
            data: []
        },
        {
            label: "pq",
            fillColor: "rgba(0,0,0,0)",
            strokeColor: "rgba(33,33,193,1)",
            pointColor: "rgba(33,33,193,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(33,33,193,1)",
            data: []
        },
        {
            label: "qq",
            fillColor: "rgba(0,0,0,0)",
            strokeColor: "rgba(3,119,120,1)",
            pointColor: "rgba(3,119,120,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(3,119,120,1)",
            data: []
        }
    ]
};

var data = initData;

var myLineChart = new Chart(ctx).Line(data, {
    bezierCurve: false,
    animationEasing: "easeOutQuint",
    animation: true,
    animationSteps: 10,
    pointDot: true
});