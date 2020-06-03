//Data
var url = "https://query.data.world/s/d6jhscskd5ep4hfw36eda3lgh6htzg"
// // 1. Call helloCatAsync passing a callback function,
// //    which will be called receiving the result from the async operation
// console.log("1. function called...")
// helloCatAsync(function parseRadarData(result) {
//     // 5. Received the result from the async function,
//     //    now do whatever you want with it:
//     console.log("5. result is: ", result);
// });

// // 2. The "callback" parameter is a reference to the function which
// //    was passed as argument from the helloCatAsync call
// function helloCatAsync(callback) {
//     console.log("2. callback here is the function passed as argument above...")
//     // 3. Start async operation:
//     setTimeout(function() {
//     console.log("3. start async operation...")
//     console.log("4. finished async operation, calling the callback, passing the result...")
//         // 4. Finished async operation,
//         //    call the callback passing the result as argument
//     }, Math.random() * 2000);
// }

//Data pull from NBA combine


// parseCSVData(function cleanDataForRadar(rawData,callback){
//     var combine_data = []
//     //Iterate through array and set each column header as an axis with its corresponding value for each player
//     for (var i=0;i<rawData.length;i++) { 
//         each_stat = []
//             for (let [key, value] of Object.entries(rawData[i])) { 
//                 each_stat.push([{axis: key, value: value}])
//             }
//     combine_data[i]=each_stat.flat(Infinity)
//     }
//     callback(combine_data)
// })


// function parseCSVData(callback) {
//     d3.csv(url, function(d) {
//        rawData = d
//        callback(rawData)
//     })
// }

// //console.log("NBA Combine Data: ",data.length)



// //console.log("Combine data parsed:",nba_combine.get(function(error,rows){rows}))

// // var combine_data = []
// // for (var i=0;i<nba_combine.length;i++) { 
// //     each_stat = []
// //     for (let [key, value] of Object.entries(nba_combine[i])) { 
// //         each_stat.push([{axis: key, value: value}])
// //     }
// //     combine_data[i]=each_stat.flat(Infinity)
// // }
// //console.log("COMBINE DATA",combine_data)


// //Example CSV data after parsing
sampleData = [
    {"Player":"Kawhi Leonard","PTS":0.44, "AST":0.23, "REB":0.65,"STL":0.70,"Blocks":0.88},
    {"Player":"Steph Curry","PTS":0.59, "AST":0.28, "REB":0.84,"STL":0.59,"Blocks":0.48},
    {"Player":"Kevin Durant","PTS":0.78, "AST":0.55, "REB":0.64,"STL":0.47,"Blocks":0.28},
    {"Player":"Lebron James","PTS":0.66, "AST":0.73, "REB":0.46,"STL":0.22,"Blocks":0.68},
    ]
sampleRawData = [
    {"Player":"Kawhi Leonard","PTS":50.4, "AST":4.2, "REB":10.6,"STL":1.70,"Blocks":1.8},
    {"Player":"Steph Curry","PTS":30.5, "AST":7.2, "REB":5.8,"STL":1.59,"Blocks":1.4},
    {"Player":"Kevin Durant","PTS":24.8, "AST":5.5, "REB":8.6,"STL":1.47,"Blocks":2.2},
    {"Player":"Lebron James","PTS":22.6, "AST":8.7, "REB":7.4,"STL":2.22,"Blocks":1.6},
    ]

samplePlotData = [
    {"Player":"Kawhi Leonard","PTS":20.4, "AST":4.2, "REB":10.6,"STL":1.70,"Blocks":1.8,"Plot":true},
    {"Player":"Steph Curry","PTS":30.5, "AST":7.2, "REB":5.8,"STL":1.59,"Blocks":1.4,"Plot":true},
    {"Player":"Kevin Durant","PTS":24.8, "AST":5.5, "REB":8.6,"STL":1.47,"Blocks":2.2,"Plot":false},
    {"Player":"Lebron James","PTS":22.6, "AST":8.7, "REB":7.4,"STL":2.22,"Blocks":1.6,"Plot":true},
    ]

   
function radar(){radarChart(samplePlotData)}
function groupedBar(){groupedBarChart(samplePlotData)}

function normalizeObjects(data) {
    let normData = data

    let statNames = Object.keys(normData[0])
    
    for (let j=1;j<statNames.length-1;j++) {
        let statValues = [];
        for (let i=0;i<normData.length;i++){
            statValues.push(normData[i][statNames[j]])
            normData[i]["raw_"+statNames[j]]=normData[i][statNames[j]]
        };
  
        let ratio = Math.max.apply(Math, statValues);
          
        for (let i = 0; i < statValues.length; i++) {
            statValues[i] = +((statValues[i] / ratio).toFixed(2));
        };
  
        for (let i=0;i<normData.length;i++){
            normData[i][statNames[j]]=statValues[i]
        };
    }
    //filter to only include players we want to plot
    var plotData =  normData.filter(function(d) {
        return d.Plot == true;
    });
    //remove "Plot" attribute to prepare objects for plotting
    for (i=0;i<plotData.length;i++){delete plotData[i].Plot};
    
    return plotData;
}
  
function shapeRadarData(data) {
    playerNames = getPlayerNames(data)
    //Iterate through array and set each column header as an axis with its corresponding value for each player
    var shapedData = []
    for (var i=0;i<data.length;i++) {
        let player = Object.values(data[i])[0] 
        all_stats = []
            for (let [key, value] of Object.entries(data[i])) {
                each_stat={} 
                if (typeof value == "number" & key.indexOf("raw_") != 0){
                    
                    each_stat["player_name"]=player
                    each_stat["axis"]=key;
                    each_stat["value"]=value;
                    all_stats.push(each_stat)
                    console.log(each_stat)
                }        
            }
        for (let j=0;j<all_stats.length;j++) {
            all_stats[j]["raw_value"]=data[i]["raw_"+all_stats[j].axis]
        }
        shapedData.push(all_stats)
    }
    return shapedData
};
  
  async function setupRadarData(rawData){
    console.log("Original data structure:",rawData)
    let data = await normalizeObjects(rawData)
    let shapedData = await shapeRadarData(data)
    console.log("Shaped for Radar Chart structure:",shapedData)
    return shapedData
  }
  
  //retrieve player names to use for legend
  function getPlayerNames(data) {
    var playerNames = [];
    for (let i=0;i<data.length;i++){
        player = Object.values(data[i])[0]
        playerNames.push(player)
    }
    return playerNames
  }
  
  async function radarChart(rawData) {
    d = await setupRadarData(rawData)
    RadarChart.draw("#chart-div", d)
  }


/*****DRAWING RADAR CHART FROM URL******************/
// async function drawRadarChart(url){
//     let data = await d3.csv(url)//,d => {return d;})
//     let cleanedData = shapeData(data)
//     console.log("Original data structure:",data)
//     console.log("Shaped for Radar Chart structure:",cleanedData)
//     return cleanedData
// }

// async function getReadyData() {
//     try {
//         console.log("USE THIS DATA TO MAKE CHART:",drawRadarChart(url))
//         let d = await drawRadarChart(url)
//         //RadarChart.draw("#chart", d, mycfg);
//     }
//     catch(err) {console.error(err)}
// }

//Function to reset dummy data to be used in testing
function resetData() {
    samplePlotData = [
        {"Player":"Kawhi Leonard","PTS":20.4,"AST":4.2,"REB":10.6,"STL":1.70,"Blocks":1.8,"Plot":true},
        {"Player":"Steph Curry","PTS":30.5, "AST":7.2, "REB":5.8,"STL":1.59,"Blocks":1.4,"Plot":true},
        {"Player":"Kevin Durant","PTS":24.8, "AST":5.5, "REB":8.6,"STL":1.47,"Blocks":2.2,"Plot":false},
        {"Player":"Lebron James","PTS":22.6, "AST":8.7, "REB":7.4,"STL":2.22,"Blocks":1.6,"Plot":true},
        ];
    normalizeObjects(samplePlotData)
}

sampleScatterData = [
    {"Player":"Kawhi Leonard","PTS":20.4,"AST":4.2,"Plot":true},
    {"Player":"Steph Curry","PTS":30.5, "AST":7.2,"Plot":true},
    {"Player":"Kevin Durant","PTS":24.8, "AST":5.5,"Plot":false},
    {"Player":"Lebron James","PTS":22.6, "AST":8.7,"Plot":true},
    ];

function shapeScatterData(data) {
    var data_points = [];
    var stat_keys = Object.keys(data[0])
    var player_key = stat_keys[0]
    var xLabel_key = stat_keys[1]
    var yLabel_key = stat_keys[2]
    var plot_key = stat_keys[3]

    for (let i=0;i<data.length;i++) {
        data_points[i] = {};
        data_points[i].player = data[i][player_key]
        data_points[i].xLabel = xLabel_key
        data_points[i].xValue = data[i][xLabel_key]
        data_points[i].yLabel = yLabel_key
        data_points[i].yValue = data[i][yLabel_key]
        data_points[i].plot = data[i][plot_key]
    }
    return data_points;
}

function shapeGroupedBarData(data) {
    var clusters = [];
    var stat_keys = Object.keys(data[0]).slice(1,)
    console.log(stat_keys)
    for (let j=0;j<stat_keys.length;j++) {
        if(stat_keys[j].indexOf("raw_") != 0) {
            clusters[j]={}
            clusters[j].Stat=stat_keys[j]
            clusters[j].values=[]
            for (let i=0;i<data.length;i++) {
                clusters[j].values[i] = {}
                clusters[j].values[i].player = Object.values(data[i])[0]
                clusters[j].values[i].value = data[i][stat_keys[j]]
                clusters[j].values[i].raw_value = data[i]["raw_"+stat_keys[j]]
                clusters[j].values[i].stat_name = stat_keys[j]
            }
        }
    }
    console.log(clusters)
    return clusters;
}