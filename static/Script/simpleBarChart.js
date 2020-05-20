sample = true;
var statToPlot = "TOPG";
/*
sampleParsedData = [
    [
        {name:"Player",value:"Kawhi Leonard"},
        {name:"Points",value:0.75},
        {name:"Rebounds",value:0.56},
        {name:"Assists",value:0.28},
        {name:"Steals",value:0.60},
        {name:"Blocks",value:0.48},
        {name:"FG%",value:0.55},
        {name:"3PT%",value:0.35},
        {name:"EFG%",value:0.57},
        {name:"FT%",value:0.78},
        {name:"FGM",value:0.72},
        {name:"3PM",value:0.30},
        {name:"FTM",value:0.68},
    ],[
        {name:"Player",value:"Kevin Durant"},
        {name:"Points",value:0.80},
        {name:"Rebounds",value:0.26},
        {name:"Assists",value:0.82},
        {name:"Steals",value:0.79},
        {name:"Blocks",value:0.18},
        {name:"FG%",value:0.64},
        {name:"3PT%",value:0.51},
        {name:"EFG%",value:0.65},
        {name:"FT%",value:0.87},
        {name:"FGM",value:0.42},
        {name:"3PM",value:0.77},
        {name:"FTM",value:0.53},
    ],[
        {name:"Player",value:"Steph Curry"},
        {name:"Points",value:0.67},
        {name:"Rebounds",value:0.26},
        {name:"Assists",value:0.82},
        {name:"Steals",value:0.79},
        {name:"Blocks",value:0.18},
        {name:"FG%",value:0.64},
        {name:"3PT%",value:0.51},
        {name:"EFG%",value:0.65},
        {name:"FT%",value:0.87},
        {name:"FGM",value:0.42},
        {name:"3PM",value:0.77},
        {name:"FTM",value:0.53},
      ]
  ];

var sampleData = [
    {"Player":"Kawhi Leonard","PTS":0.44, "AST":0.23, "REB":0.65,"STL":0.70,"Blocks":0.88},
    {"Player":"Steph Curry","PTS":0.59, "AST":0.28, "REB":0.84,"STL":0.59,"Blocks":0.48},
    {"Player":"Kevin Durant","PTS":0.78, "AST":0.55, "REB":0.64,"STL":0.47,"Blocks":0.28},
    {"Player":"Lebron James","PTS":0.66, "AST":0.73, "REB":0.46,"STL":0.22,"Blocks":0.68},
]

//sampleData = d3.csv()

 */


const simpleBarChart = function(sampleData) {
    var t0 = performance.now()
    //var url = "https://query.data.world/s/d6jhscskd5ep4hfw36eda3lgh6htzg"
    var url = "https://query.data.world/s/d6jhscskd5ep4hfw36eda3lgh6htzg"
    var svg = d3.select("svg"),
    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,

    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //console.log(height);
    //var parseTime = d3.timeParse("%d-%b-%y");

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    if (sample){
        dataFromSample(sampleData,statToPlot);
    } else {
        dataFromURL(url);
    }

    async function dataFromURL(url) {
        d3.csv(url).then(function (data) {
            data.sort(function(a, b) {
                return b["Vertical (Max)"] - a["Vertical (Max)"];
            });
            
            data = data.filter(data => Number(data["Vertical (Max)"]) > 42)
            //console.log(data)
        
            x.domain(data.map(function (d) {
                    return d.Player;
                }));
            y.domain([0, d3.max(data, function (d) {
                        return Number(d["Vertical (Max)"]);
                    })]);

            g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))

            g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Vertical (Max)");

            g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d.Player);
            })
            .attr("y", function (d) {
                return y(Number(d["Vertical (Max)"]));
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(Number(d["Vertical (Max)"]));
            });
            
            var t1 = performance.now()
            //console.log("Parsing and plotting took " + (t1 - t0) + " milliseconds.")
        });
    }

    function dataFromSample(sampleData,statToPlot) {
        let data = sampleData
        //console.log(data)
        data.sort(function(a, b) {
            return b[statToPlot] - a[statToPlot];
        });
        
        //data = data.filter(data => Number(data[1]) > 25)
        //console.log(data)

        x.domain(data.map(function (d) {
                return d.Player;
            }));
        y.domain([0, d3.max(data, function (d) {
                    return Number(d[statToPlot]);
                })]);

        g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

        g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text(statToPlot);

        g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.Player);
        })
        .attr("y", function (d) {
            return y(Number(d[statToPlot]));
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return height - y(Number(d[statToPlot]));
        });
        
        var t1 = performance.now()
        //console.log("Parsing and plotting took " + (t1 - t0) + " milliseconds.")
    };
}