const groupedBarChart = function(rawData) {
    var width = 900
    var height = 700

    var svg = d3.select('#chart-div')
                .append('svg')
                .attr("viewBox", [0, 0, width, height]);
    var margin = {top: 10, right: 20, bottom: 30, left: 40},

    height = height - margin.top - margin.bottom,
    width = width - margin.left - margin.right - 130;

    var tip = d3.select("#chart-div").append("div")	
                    .attr("class", "tooltip")				
                    .style("opacity", 0);

    var x0 = d3.scaleBand()
        .rangeRound([0, width], 0.5)
        .padding(0.15);

    var x1 = d3.scaleBand();

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var color = d3.scaleOrdinal()
        .range(["#ca0020","#f4a582","#92c5de","#0571b0","#ffbf4f"]);

    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // playerXAxis(rawData)
    statXAxis(rawData)

    async function playerXAxis(rawData) {

        //console.log("Running parsing function!")
        var plotData =  rawData.filter(function(rawData) {
            return rawData.Plot == true;
        });
        for (i=0;i<plotData.length;i++){delete plotData[i].Plot}

        //convert data into JSON object in the shape of: [{bar_cluster: bar_cluster_label , values: [{bar1:value1},{bar2:value2},...]}]
        var data = [];
        for (let i=0;i<plotData.length;i++){
            first_key = Object.keys(plotData[i])[0]
            first_value = Object.values(plotData[i])[0]
            data[i]={}
            data[i].Player=first_value

            stat_keys = Object.keys(plotData[i]).slice(1,)
            stat_values = Object.values(plotData[i]).slice(1,)

            let statsList = []
            stat_keys.reduce((acc ,val, index) => {
                let obj = {...acc , stat:val, value:stat_values[index]};
                statsList.push(obj);
            },{});
            data[i].values = statsList
        }

        //console.log(data);

        var playerNames = data.map(function(d) { return d.Player; });
        var statNames = data[0].values.map(function(d) { return d.stat; });

        x0.domain(playerNames);
        x1.domain(statNames).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(data, function(Player) { return d3.max(Player.values, function(d) { return d.value; }); })]);

        var xAxis = d3.axisBottom().scale(x0)
        var yAxis = d3.axisLeft().scale(y);    

        svg.append("g")
            .attr("class", "x axis")
            .attr("id","x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .style('opacity','0')
            .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight','bold')
            .text("Value");

        svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

        var slice = svg.selectAll(".slice")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform",function(d) { return "translate(" + x0(d.Player) + ",0)"; });

        slice.selectAll("rect")
            .data(function(d) { return d.values; })
        .enter().append("rect")
            .attr("width", x1.bandwidth())
            .attr("x", function(d) { return x1(d.stat); })
            .style("fill", function(d) { return color(d.stat) })
            .attr("y", function(d) { return y(0); })
            .attr("height", function(d) { return height - y(0); })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color(d.stat)).darker(2))		
                tip.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                tip.html(d.value + " " + d.stat)// + "<br/>"+ Player)	
                    .style("left", (document.getElementById("chart-div").offsetLeft) + "px")
                    .style("top", (document.getElementById("chart-div").offsetTop) + "px");
                })					
            .on("mouseout", function(d) {		
                tip.transition()		
                    .duration(500)		
                    .style("opacity", 0)
                    d3.select(this).style("fill", color(d.stat));
            })

        slice.selectAll("rect")
            .transition()
            .delay(function (d) {return Math.random()*1000;})
            .duration(1000)
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); });

        //Legend
        svg
        .select('svg')
        .attr("width", width+300)
        .attr("height", height)
    
        //Create the title for the legend
        svg.append("text")
            .attr("class", "legend-title")
            .attr('transform', 'translate(70,0)') 
            .attr("x", width - 110)
            .attr("y", 10)
            .text("Players:");
          
        //Initiate Legend	
        var legend = svg.append("g")
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
          .attr("x", width - 105)
          .attr("y", function(d, i){ return i * 20;})
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", function(d, i){ return color(d);})
          ;
        //Create text next to squares
        legend.selectAll(".legend")
            .data(data[0].values.map(function(d) { return d.stat; }).reverse())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
            .style("opacity","0");

        legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");

            };

    async function statXAxis(rawData) {
        rawData = await normalizeObjects(rawData);
        let data = shapeGroupedBarData(rawData);

        var statNames = data.map(function(d) { return d.Stat; });
        var playerNames = data[0].values.map(function(d) { return d.player; });

        x0.domain(statNames);
        x1.domain(playerNames).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(data, function(Stat) { return d3.max(Stat.values, function(d) { return d.value; }); })]);

        var xAxis = d3.axisBottom().scale(x0)
        var yAxis = d3.axisLeft().scale(y);    

        svg.append("g")
            .attr("class", "x axis")
            .attr("id", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .style('opacity','0')
            .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight','bold')
            .text("Value");

        svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

        var slice = svg.selectAll(".slice")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform",function(d) { return "translate(" + x0(d.Stat) + ",0)"; });

        slice.selectAll("rect")
            .data(function(d) { return d.values; })
        .enter().append("rect")
            .attr("width", x1.bandwidth())
            .attr("x", function(d) { return x1(d.player); })
            .style("fill", function(d) { return color(d.player) })
            .attr("y", function(d) { return y(0); })
            .attr("height", function(d) { return height - y(0); })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color(d.player)).darker(2))		
                tip.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                tip.html(d.player + "<br>" + d.raw_value + " " + d.stat_name)
                    .style("left", (document.getElementById("chart-div").offsetLeft + 570) + "px")
                    .style("top", (document.getElementById("chart-div").offsetTop + 60) + "px");
                })				
            .on("mouseout", function(d) {		
                tip.transition()		
                    .duration(500)		
                    .style("opacity", 0)
                    d3.select(this).style("fill", color(d.player));
            })
            .on("click", function(d) {
                console.log(this);
            });

        slice.selectAll("rect")
            .transition()
            .delay(function (d) {return Math.random()*1000;})
            .duration(1000)
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); });

        //Legend
        svg
        .select('svg')
        .attr("width", width+300)
        .attr("height", height)
    
        //Create the title for the legend
        svg.append("text")
            .attr("class", "legend-title")
            .attr('transform', 'translate(70,0)') 
            .attr("x", width - 70)
            .attr("y", 30)
            .text("Players:");
          
        //Initiate Legend	
        var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr('transform', 'translate(70,36)') 
        ;
        //Create colour squares
        legend.selectAll('rect')
          .data(data[0].values.map(function(d) { return d.player; }))
          .enter()
          .append("rect")
          .attr("x", width - 70)
          .attr("y", function(d, i){ return i * 20 + 5;})
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", function(d, i){ return color(d);})
          ;
        //Create text next to squares
        legend.selectAll('text')
            .data(data[0].values.map(function(d) { return d.player; }))
            .enter()
            .append("text")
            .attr("x", width - 55)
            .attr("y", function(d, i){ return i * 20 + 14;})
            .attr("class","legend-labels")
            .text(function(d) { return d; });

        legend.transition().duration(500).delay(function(d,i){console.log("Number of players in legend=",i); return 1300 + 100 * i; }).style("opacity","1");
            };

    var t1 = performance.now()
    //console.log("Parsing and plotting took " + (t1 - t0) + " milliseconds.")
};