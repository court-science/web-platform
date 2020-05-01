var w = 500,
	h = 500;

var colorscale = d3.scale.category10();

//Legend titles
var LegendOptions = ['Player 1','Player 2','Player 3','Player 4'];

//Data

//Data pull from NBA combine
// d3.csv("https://data.world/achou/nba-draft-combine-measurements/file/2012_nba_draft_combine.csv")
//     .get(function(error, rows) { console.log(rows); });

//Example CSV data after parsing
var data = [
    {"PTS":0.44, "AST":0.23, "REB":0.65,"STL":0.70,"Blocks":0.88},
    {"PTS":0.59, "AST":0.28, "REB":0.84,"STL":0.59,"Blocks":0.48},
    {"PTS":0.78, "AST":0.55, "REB":0.64,"STL":0.47,"Blocks":0.28},
    {"PTS":0.66, "AST":0.73, "REB":0.46,"STL":0.22,"Blocks":0.68},
    ]

var radar_data = []
for (var i=0;i<data.length;i++) { 
    each_stat = []
    for (let [key, value] of Object.entries(data[i])) { 
        each_stat.push([{axis: key, value: value}])
    }
    radar_data[i]=each_stat.flat(Infinity)
}
console.log("RADAR DATA",radar_data)

//Hardcoded example data
var d = [
		  [
			{axis:"Points",value:0.75},
			{axis:"Rebounds",value:0.56},
			{axis:"Assists",value:0.28},
			{axis:"Steals",value:0.60},
			{axis:"Blocks",value:0.48},
			{axis:"FG%",value:0.55},
			{axis:"3PT%",value:0.35},
			{axis:"EFG%",value:0.57},
			{axis:"FT%",value:0.78},
			{axis:"FGM",value:0.72},
			{axis:"3PM",value:0.30},
			{axis:"FTM",value:0.68},
		  ],[
			{axis:"Points",value:0.59},
			{axis:"Rebounds",value:0.26},
			{axis:"Assists",value:0.82},
			{axis:"Steals",value:0.79},
			{axis:"Blocks",value:0.18},
			{axis:"FG%",value:0.64},
			{axis:"3PT%",value:0.51},
			{axis:"EFG%",value:0.65},
			{axis:"FT%",value:0.87},
			{axis:"FGM",value:0.42},
			{axis:"3PM",value:0.77},
			{axis:"FTM",value:0.53},
		  ]
		];
//console.log("Hardcoded Data:",d)

//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 0.6,
  levels: 6,
  ExtraWidthX: 300
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
RadarChart.draw("#chart", radar_data, mycfg);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svg = d3.select('#body')
	.selectAll('svg')
	.append('svg')
	.attr("width", w+300)
	.attr("height", h)

//Create the title for the legend
var text = svg.append("text")
	.attr("class", "title")
	.attr('transform', 'translate(90,0)') 
	.attr("x", w - 70)
	.attr("y", 10)
	.attr("font-size", "12px")
	.attr("fill", "#404040")
	.text("Top Player Attributes");
		
//Initiate Legend	
var legend = svg.append("g")
	.attr("class", "legend")
	.attr("height", 100)
	.attr("width", 200)
	.attr('transform', 'translate(90,20)') 
	;
	//Create colour squares
	legend.selectAll('rect')
	  .data(LegendOptions)
	  .enter()
	  .append("rect")
	  .attr("x", w - 65)
	  .attr("y", function(d, i){ return i * 20;})
	  .attr("width", 10)
	  .attr("height", 10)
	  .style("fill", function(d, i){ return colorscale(i);})
	  ;
	//Create text next to squares
	legend.selectAll('text')
	  .data(LegendOptions)
	  .enter()
	  .append("text")
	  .attr("x", w - 52)
	  .attr("y", function(d, i){ return i * 20 + 9;})
	  .attr("font-size", "11px")
	  .attr("fill", "#737373")
	  .text(function(d) { return d; })
	  ;	