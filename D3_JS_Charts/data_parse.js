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
    normData = data
    console.log("Normalizing this data:",normData)
    statNames = Object.keys(normData[0])
    
    /*************** For-Loop with "Plot" variable will iterate through each key but the last one so length is n-1 ***************/
    //Plot value not yet implemented
    for (let j=1;j<statNames.length;j++) {
    //Below loop definition will run when plot is implemented
    //for (let j=1;j<statNames.length-1;j++) {
        statValues = []
        for (let i=0;i<normData.length;i++){
            statValues.push(normData[i][statNames[j]])
        }
  
        ratio = Math.max.apply(Math, statValues),
        length = statValues.length;
  
        for (let i = 0; i < length; i++) {
            statValues[i] = +((statValues[i] / ratio).toFixed(2));
        }
  
        for (let i=0;i<normData.length;i++){
            normData[i][statNames[j]]=statValues[i]
        }
    }
    return normData
  }
  
  const shapeRadarData = function(data){
    /*************** Shaping data with "Plot" variable requires filtering objects where "Plot"==true and then removing that variable ***************/
    /*** THIS SECTION WILL BE UNCOMMENTED WHEN PLOT VARIABLE ADDED
    //filter to only include players we want to plot
    var plotData =  data.filter(function(data) {
        return data.Plot == true;
    });
    //remove "Plot" attribute to prepare objects for plotting
    for (i=0;i<plotData.length;i++){delete plotData[i].Plot}
  */
    //This line will be removed when plot variable added
    let plotData = data
    playerNames = getPlayerNames(plotData)
    var shapedData = []
    //Iterate through array and set each column header as an axis with its corresponding value for each player
    for (var i=0;i<plotData.length;i++) { 
        each_stat = []
            for (let [key, value] of Object.entries(plotData[i])) { 
                if (typeof value == "number"){
                    each_stat.push([{axis: key, value: value}])
                } 
            }
        shapedData[i]=each_stat.flat(Infinity)
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


