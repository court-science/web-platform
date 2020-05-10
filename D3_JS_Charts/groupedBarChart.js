const groupedBarChart = function(rawData) {
    console.log("Passing this data into groupedBarChart:",rawData)
    var t0 = performance.now()
    var svg = d3.select('svg')
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    height = +svg.attr("height") - margin.top - margin.bottom,
    width = +svg.attr("width") - margin.left - margin.right;

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

    dataFromSampleGroupedBar(rawData)

    function dataFromSampleGroupedBar(rawData) {

        console.log("Running parsing function!")
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

       console.log(data);

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
                d3.select(this).style("fill", d3.rgb(color(d.stat)).darker(2));
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill", color(d.stat));
            });

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
    var t1 = performance.now()
    console.log("Parsing and plotting took " + (t1 - t0) + " milliseconds.")
}