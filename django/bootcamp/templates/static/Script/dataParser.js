// This function returns all numerical object entry values
// normalized using ratio of max calculation 
// while retaining original "raw_value"
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

//This function sets up the data to be plotted for radar charts
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
                }        
            }
        for (let j=0;j<all_stats.length;j++) {
            all_stats[j]["raw_value"]=data[i]["raw_"+all_stats[j].axis]
        }
        shapedData.push(all_stats)
    }
    return shapedData
};

//convert data into JSON object in the shape of: 
//[{bar_cluster: bar_cluster_label , values: [{bar1:value1},{bar2:value2},...]}]
//Add original "raw_values" to each bar in a cluster along with rank
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