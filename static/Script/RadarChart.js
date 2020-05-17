var RadarChart = {
  draw: function(id, d, options){
   
    if('undefined' !== typeof options){
      for(var i in options){
        if('undefined' !== typeof options[i]){
          cfg[i] = options[i];
        }
      }
    }  

    var g = d3.select("#chart-div").select("svg");//.attr("width",400).attr("height",350);
    // console.log("NEW SVG HEIGHT IS:",g.attr("height"))
    // console.log("NEW SVG WIDTH IS:",g.attr("width"))
    var margin = {top: 30, right: 20, bottom: 30, left: 50};
    cfg = {
      radius: 5,
      h: 450,//+g.attr("height"),
      w: 500,//+g.attr("width"),
      factor: 1,
      factorLegend: .85,
      levels: 3,
      maxValue: 1,
      radians: 2 * Math.PI,
      opacityArea: 0.5,
      ToRight: 5,
      TranslateX: 80,
      TranslateY: 30,
      ExtraWidthX: 100,
      ExtraWidthY: 100,
      color:  d3.scaleOrdinal()
      .range(["#ca0020","#f4a582","#d5d5d5","#92c5de","#0571b0"])
     };

     cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
     var allAxis = (d[0].map(function(i, j){return i.axis}));
     var total = allAxis.length;
     var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
     var Format = d3.format('.1%');
     
     g
      .attr("width", cfg.w+cfg.ExtraWidthX)
      .attr("height", cfg.h+cfg.ExtraWidthY)
      .append("g")
      .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
      ;

    var tooltip;
    
    //Circular segments
    for(var j=0; j<cfg.levels-1; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data(allAxis)
       .enter()
       .append("svg:line")
       .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
       .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
       .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
       .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
       .attr("class", "line")
       .style("stroke", "grey")
       .style("stroke-opacity", "0.75")
       .style("stroke-width", "0.3px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor + margin.left) + ", " + (cfg.h/2-levelFactor + margin.top) + ")");
    }

    //Text indicating at what % each level is
    // for(var j=0; j<cfg.levels; j++){
    //   var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
    //   g.selectAll(".levels")
    //    .data([1]) //dummy data
    //    .enter()
    //    .append("svg:text")
    //    .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
    //    .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
    //    .attr("class", "legend")
    //    .style("font-family", "sans-serif")
    //    .style("font-size", "10px")
    //    .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
    //    .attr("fill", "#737373")
    //    .text(Format((j+1)*cfg.maxValue/cfg.levels));
    // }
    
    series = 0;

    var axis = g.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

    axis.append("line")
        .attr("x1", cfg.w/2)
        .attr("y1", cfg.h/2)
        .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
        .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "1px");

    axis.append("text")
        .attr("class", "legend")
        .text(function(d){return d})
        .style("font-family", "sans-serif")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .attr("transform", "translate(" + margin.left + "," + (margin.top + -10) + ")")
        .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
        .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

 
    d.forEach(function(y, x){
      dataValues = [];
      g.selectAll(".nodes")
        .data(y, function(j, i){
          dataValues.push([
            cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
            cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
          ]);
        });
      dataValues.push(dataValues[0]);
      g.selectAll(".area")
        .data([dataValues])
        .enter()
        .append("polygon")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "radar-chart-serie"+series)
        .style("stroke-width", "2px")
        .style("stroke", cfg.color(series))
        .attr("points",function(d) {
            var str="";
            for(var pti=0;pti<d.length;pti++){
                str=str+d[pti][0]+","+d[pti][1]+" ";
            }
            return str;
        })
        .style("fill", function(j, i){return cfg.color(series)})
        .style("fill-opacity", cfg.opacityArea);

      g.selectAll(".area")
        .on('mouseover', function (d){
                          z = "polygon."+d3.select(this).attr("class");
                          g.selectAll("polygon")
                            .transition(200)
                            .style("fill-opacity", 0.1); 
                          g.selectAll(z)
                            .transition(200)
                            .style("fill-opacity", .7);
                          console.log(d)
                        })
        .on('mouseout', function(){
                          g.selectAll("polygon")
                            .transition(200)
                            .style("fill-opacity", cfg.opacityArea);
        });
      series++;
    });
    series=0;


    d.forEach(function(y, x){
      g.selectAll(".nodes")
        .data(y).enter()
        .append("svg:circle")
        .attr("class", "radar-chart-serie"+series)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr('r', cfg.radius)
        .attr("alt", function(j){return Math.max(j.value, 0)})
        .attr("cx", function(j, i){
          dataValues.push([
            cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
            cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
        ]);
        return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
        })
        .attr("cy", function(j, i){
          return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
        })
        .attr("data-id", function(j){return j.axis})
        .style("fill", cfg.color(series)).style("fill-opacity", .9)
        .on('mouseover', function (d){
                    newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                    newY =  parseFloat(d3.select(this).attr('cy')) - 5;
                    
                    z = "polygon."+d3.select(this).attr("class");
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1); 
                    g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", .7);
                    tooltip
                        .attr('x', newX)
                        .attr('y', newY)
                        .text(Format(d.value))
                        .transition(200)
                        .style('opacity', 1);
                    console.log(d)
                  })
        .on('mouseout', function(){
                    tooltip
                        .transition(200)
                        .style('opacity', 0);
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.opacityArea);
                  })
        .append("svg:title")
        .text(function(j){return Math.max(j.value, 0)});

      series++;
    });
    //Tooltip
    tooltip = g.append('text')
               .style('opacity', 0)
               .style('font-family', 'sans-serif')
               .style('font-size', '13px');

    ////////////////////////////////////////////
    /////////// Initiate legend ////////////////
    ////////////////////////////////////////////
    var LegendOptions = playerNames;
    
   g
    .select('svg')
    .attr("width", cfg.w+300)
    .attr("height", cfg.h)

    //Create the title for the legend
    var text = g.append("text")
    .attr("class", "legend-title")
    .attr('transform', 'translate(70,0)') 
    .attr("x", cfg.w - 110)
    .attr("y", 10)
    .text("Players:");
      
    //Initiate Legend	
    var legend = g.append("g")
    .attr("class", "legend")
    .attr("height", 100)
    .attr("width", 200)
    .attr('transform', 'translate(70,20)') 
    ;
    //Create colour squares
    legend.selectAll('rect')
      .data(LegendOptions)
      .enter()
      .append("rect")
      .attr("x", cfg.w - 105)
      .attr("y", function(d, i){ return i * 20;})
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d, i){ return cfg.color(i);})
      ;
    //Create text next to squares
    legend.selectAll('text')
      .data(LegendOptions)
      .enter()
      .append("text")
      .attr("x", cfg.w - 92)
      .attr("y", function(d, i){ return i * 20 + 9;})
      .attr("font-size", "11px")
      .attr("fill", "#737373")
      .text(function(d) { return d; })
      ;	
  }
  
};

function normalizeObjects(data) {
  normData = data
  console.log("Normalizing this data:",normData)
  statNames = Object.keys(normData[0])
  
  for (let j=1;j<statNames.length-1;j++) {
      statValues = []
      for (let i=0;i<normData.length;i++){
          statValues.push(normData[i][statNames[j]])
      }

      ratio = Math.max.apply(Math, statValues),
      length = statValues.length;

      for (let i = 0; i < length; i++) {
          statValues[i] = +((statValues[i] / ratio).toFixed(2));
      }

      /***This loop adds the normalized stats to each player object rather than replace original values. This will be used for tooltips***/
      // for (let i=0;i<normData.length;i++){
      //     normStatName="norm_"+statNames[j]
      //     normData[i][normStatName]=statValues[i]
      // }

      for (let i=0;i<normData.length;i++){
          normData[i][statNames[j]]=statValues[i]
      }
  }
  return normData
}

const shapeRadarData = function(data){

  //filter to only include players we want to plot
  var plotData =  data.filter(function(data) {
      return data.Plot == true;
  });
  //remove "Plot" attribute to prepare objects for plotting
  for (i=0;i<plotData.length;i++){delete plotData[i].Plot}

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

sampleRawData = [
  {"Player":"Kawhi Leonard","PTS":20.4, "AST":4.2, "REB":10.6,"STL":1.70,"Blocks":1.8,"Plot":true},
  {"Player":"Steph Curry","PTS":30.5, "AST":7.2, "REB":5.8,"STL":1.59,"Blocks":1.4,"Plot":true},
  {"Player":"Kevin Durant","PTS":24.8, "AST":5.5, "REB":8.6,"STL":1.47,"Blocks":2.2,"Plot":false},
  {"Player":"Lebron James","PTS":22.6, "AST":8.7, "REB":7.4,"STL":2.22,"Blocks":1.6,"Plot":true},
  ]
