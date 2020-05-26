const groupedBarChart = function(rawData) {
    var t0 = performance.now()
    //console.log("Starting to plot:", t0)
    //console.log("Passing this data into groupedBarChart:",rawData)
    var svg = d3.select('#chart-div').select('svg')
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    height = 450 - margin.top - margin.bottom,
    width = 600 - margin.left - margin.right;

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
        .range(["#ca0020","#f4a582","#d5d5d5","#92c5de","#0571b0"]);

    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // playerXAxis(rawData)
    statXAxis(rawData)

    function playerXAxis(rawData) {

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
                    .style("left", (d3.event.pageX + 5) + "px")		
                    .style("top", (d3.event.pageY - 20) + "px");	
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
        var legend = svg.selectAll(".legend")
            .data(data[0].values.map(function(d) { return d.stat; }).reverse())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
            .style("opacity","0");

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d) { return color(d); });

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) {return d; });

        legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");

            };

    function statXAxis(rawData) {

        //console.log("Running parsing function!")
        var plotData =  rawData.filter(function(rawData) {
            return rawData.Plot == true;
        });
        for (i=0;i<plotData.length;i++){delete plotData[i].Plot}

        //convert data into JSON object in the shape of: [{bar_cluster: bar_cluster_label , values: [{bar1:value1},{bar2:value2},...]}]
        var data = [];
        var stat_keys = Object.keys(plotData[0]).slice(1,)
        for (let j=0;j<stat_keys.length;j++) {
            data[j]={}
            data[j].Stat=stat_keys[j]
            data[j].values=[]
            for (let i=0;i<plotData.length;i++){
                data[j].values[i]={}
                player_name=Object.values(plotData[i])[0]
                stat_key = stat_keys[j]
                stat_value=plotData[i][stat_key]
                data[j].values[i].player=player_name
                data[j].values[i].value=stat_value
            }
        }

       //console.log(data);

       var statNames = data.map(function(d) { return d.Stat; });
       var playerNames = data[0].values.map(function(d) { return d.player; });

        x0.domain(statNames);
        x1.domain(playerNames).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(data, function(Stat) { return d3.max(Stat.values, function(d) { return d.value; }); })]);

        var xAxis = d3.axisBottom().scale(x0)
        var yAxis = d3.axisLeft().scale(y);    

        svg.append("g")
            .attr("class", "x axis")
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
                tip.html(d.value + "<br/>" + d.player)// + "<br/>"+ Player)	
                    .style("left", (d3.event.pageX + 5) + "px")		
                    .style("top", (d3.event.pageY - 20) + "px");	
                })					
            .on("mouseout", function(d) {		
                tip.transition()		
                    .duration(500)		
                    .style("opacity", 0)
                    d3.select(this).style("fill", color(d.player));
            })
            .on("click", function(d) {
                //console.log(d);
            });

        slice.selectAll("rect")
            .transition()
            .delay(function (d) {return Math.random()*1000;})
            .duration(1000)
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); });

        //Legend
        var legend = svg.selectAll(".legend")
            .data(data[0].values.map(function(d) { return d.player; }).reverse())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
            .style("opacity","0");

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d) { return color(d); });

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) {return d; });

        legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");

            };

    var t1 = performance.now()
    //console.log("Parsing and plotting took " + (t1 - t0) + " milliseconds.")
};