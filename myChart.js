// Get the context of the canvas element we want to select
var ctx = document.getElementById("myChart").getContext("2d");

var data = {
    labels: [],
    datasets: [
        {
            label: "pp",
            fillColor: "rgba(0,0,0,0)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: []
        },
        {
            label: "pq",
            fillColor: "rgba(0,0,0,0)",
            strokeColor: "rgba(101,137,155,1)",
            pointColor: "rgba(101,137,155,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: []
        },
        {
            label: "qq",
            fillColor: "rgba(0,0,0,0)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: []
        }
    ]
};

var myLineChart = new Chart(ctx).Line(data, {
    bezierCurve: false,
    animationEasing: "easeOutQuint",
    animation: true,
    animationSteps: 60,
    pointDot : true
});