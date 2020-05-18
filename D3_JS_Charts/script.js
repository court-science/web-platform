// sampleRawData = [
// 	{"Player":"Kawhi Leonard","PTS":50.4, "AST":4.2, "REB":10.6,"STL":1.70,"Blocks":1.8},
// 	{"Player":"Steph Curry","PTS":30.5, "AST":7.2, "REB":5.8,"STL":1.59,"Blocks":1.4},
// 	{"Player":"Kevin Durant","PTS":24.8, "AST":5.5, "REB":8.6,"STL":1.47,"Blocks":2.2},
// 	{"Player":"Lebron James","PTS":22.6, "AST":8.7, "REB":7.4,"STL":2.22,"Blocks":1.6},
// 	]

// samplePlotData = [
// 	{"Player":"Kawhi Leonard","PTS":20.4, "AST":4.2, "REB":10.6,"STL":1.70,"Blocks":1.8,"Plot":true},
// 	{"Player":"Steph Curry","PTS":30.5, "AST":7.2, "REB":5.8,"STL":1.59,"Blocks":1.4,"Plot":true},
// 	{"Player":"Kevin Durant","PTS":24.8, "AST":5.5, "REB":8.6,"STL":1.47,"Blocks":2.2,"Plot":false},
// 	{"Player":"Lebron James","PTS":22.6, "AST":8.7, "REB":7.4,"STL":2.22,"Blocks":1.6,"Plot":true},
// 	]
	
//var colorscale = d3.scaleSequential().domain([1,10])

//Legend titles
var LegendOptions = ['Player 1','Player 2','Player 3','Player 4'];

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
  w: 500,
  h: 500,
  maxValue: 1,
  levels: 6,
  ExtraWidthX: 300
}


google.charts.load('current', {'packages':['table']});
google.charts.setOnLoadCallback(drawTable);

function drawTable(data) {
var table_data = new google.visualization.DataTable();
//add columns using object keys (loop through all keys and column data types)

//for (let i=0;i<data.length;i++) {
	table_data.addColumn('string', 'Name');
	table_data.addColumn('number', 'PTS');
	table_data.addColumn('number', 'REB');
	table_data.addColumn('number', 'AST');
	//table_data.addColumn('boolean', 'Full Time Employee');
	table_data.addRows([
		['Lebron James',  26.4, 8.1, 10.7],
		['Kawhi Leonard',   28.2,  9.3, 4.2],
		['Kevin Durant', 30.1, 8.5, 5.6],
		['Stephen Curry',   29.5,  5.5, 8.3]
	]);
//}

var table = new google.visualization.Table(document.getElementById('table_div'));

table.draw(table_data, {showRowNumber: true, width: '100%', height: '100%'});
}