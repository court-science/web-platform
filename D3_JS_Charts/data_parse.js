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

function normalizeCSV(data) {
    let table = [];
        data.forEach(row => {
            let[keys,values] = [Object.keys(row),Object.values(row)]
            let tableRow={}
            for (let [key, value] of Object.entries(row)) {
                if(parseFloat(isNaN(value))==true) {
                    each_stat.push([{key: key, value: value}])
                } else {
                    
                }
            };
            table.push(tableRow);
    });
}

// var radar_data = []
// for (var i=0;i<data.length;i++) { 
//     each_stat = []
//     for (let [key, value] of Object.entries(data[i])) { 
//         each_stat.push([{axis: key, value: value}])
//     }
//     radar_data[i]=each_stat.flat(Infinity)
// }
//console.log("RADAR DATA",radar_data)



////TESTING PROMISES
// const getData = function (){
//     return new Promise((resolve, reject) => {
//         d3.csv(url, function(d) {
//             //console.log(d)
//             resolve(d)
//         });
//     });
// }

const shapeData = function(data){
    var shapedData = []
    //Iterate through array and set each column header as an axis with its corresponding value for each player
    for (var i=0;i<data.length;i++) { 
        each_stat = []
            for (let [key, value] of Object.entries(data[i])) { 
                each_stat.push([{axis: key, value: value}])
            }
        shapedData[i]=each_stat.flat(Infinity)
    }
    return shapedData
};

async function drawRadarChart(url){
    let data = await d3.csv(url)//,d => {return d;})
    let cleanedData = shapeData(data)
    console.log("Original data structure:",data)
    console.log("Shaped for Radar Chart structure:",cleanedData)
    return cleanedData
}

async function getReadyData() {
    try {
        console.log("USE THIS DATA TO MAKE CHART:",drawRadarChart(url))
        let d = await drawRadarChart(url)
        //RadarChart.draw("#chart", d, mycfg);
    }
    catch(err) {console.error(err)}

}

