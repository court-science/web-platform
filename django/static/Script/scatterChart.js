const scatterChart = function(data) {

    const width = 500
    const height = 350

    const svg = d3.select('#chart-div').append('svg')
                    .attr("viewBox", [0, 0, width, height]);
    var tip = d3.select("#chart-div").append("div")	
                    .attr("class", "tooltip")				
                    .style("opacity", 0);
    
    const save = d3.select('#chart-div').append('div')
                      .attr('id','save-button')
                      .attr('class','btn btn-outline-dark btn-lg')
                      .style('height','xx')
                      .style('width','xx')
                      .style('margin-left','190px')
                      .style('margin-top','15px')
                      .attr('value','Save')
                      .html('Save Chart');

    const render = data => {

        const xAxisLabel=data[0].xLabel
        const yAxisLabel=data[0].yLabel

        const title = data[0].yLabel + ' vs. ' + data[0].xLabel;
                
        const xValue = d => d.xValue;        
        const yValue = d => d.yValue;

        
        const circleRadius = 5;
        const unselectedOpacity = 0.25;
        const legendCircleRadius = 7;
        const selectedPlayerCircleRadius = 7;
        const hoverOverCircleRadius = 15;

        const margin = { top: 40, right: 40, bottom: 40, left: 40 };
        const innerWidth = width - margin.left - margin.right-120;
        const innerHeight = height - margin.top - margin.bottom;
        
        const color = d3.scaleOrdinal()
        .range(["#92c5de","#0571b0","#ffbf4f"]);
        const unselectedColor = 'red';

        const xScale = d3.scaleLinear()
          .domain(d3.extent(data, xValue))
          .range([0, innerWidth])
          .nice();
        
        const yScale = d3.scaleLinear()
          .domain(d3.extent(data, yValue))
          .range([innerHeight, 0])
          .nice();
        
        const g = svg.append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);
        
        const xAxis = d3.axisBottom(xScale)
          .tickSize(-innerHeight)
          .tickPadding(15);
        
        const yAxis = d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickPadding(10);
        
        const yAxisG = g.append('g').call(yAxis);
        yAxisG.selectAll('.domain').remove();
        
        yAxisG.append('text')
            .attr('class', 'axis-label')
            .attr('y', -30)
            .attr('x', -innerHeight / 2)
            .attr('fill', 'black')
            .attr('transform', `rotate(-90)`)
            .attr('text-anchor', 'middle')
            .text(yAxisLabel);
        
        const xAxisG = g.append('g').call(xAxis)
          .attr('transform', `translate(0,${innerHeight})`);
        
        xAxisG.select('.domain').remove();
        
        xAxisG.append('text')
            .attr('class', 'axis-label')
            .attr('y', 40)
            .attr('x', innerWidth / 2)
            .attr('fill', 'black')
            .text(xAxisLabel);
        
        g.selectAll('circle').data(data)
          .enter().append('circle')
            .attr('cy', d => yScale(yValue(d)))
            .attr('cx', d => xScale(xValue(d)))
            .attr('r', circleRadius)
            .style('fill',unselectedColor)
            .style('opacity',unselectedOpacity)
        .filter(function(d) {return d.plot > 0; })
            .raise()
            .attr('r',selectedPlayerCircleRadius)
            .style("fill", function(d) { return color(d.player) })
            .style('opacity',1);
            
            
        g.selectAll('circle')
        .on('mouseover', function (d){
            g.selectAll('circle')
                .transition(100);
            
                if(this.getAttribute("r")==selectedPlayerCircleRadius) {
                    d3.select(this).attr('r',hoverOverCircleRadius)
                };

            tip.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
            tip.html(d.player+"<br>"+d.yValue+" "+d.yLabel+"<br>"+d.xValue+" "+d.xLabel) 	
              .style("left", (parseInt(d3.select(this).attr("cx")) + document.getElementById("chart-div").offsetLeft) + "px")     
              .style("top", (parseInt(d3.select(this).attr("cy")) + document.getElementById("chart-div").offsetTop) + "px");
              })
        .on('mouseout', function(){
            tip.transition()		
                .duration(500)		
                .style("opacity", 0)

                if(this.getAttribute("r")==hoverOverCircleRadius) {
                    d3.select(this)
                        .attr('r',selectedPlayerCircleRadius)
                };

            g.selectAll('circle')
                .transition(0)
                .style('fill',unselectedColor)
                .style('opacity',unselectedOpacity)
            .filter(function(d) {return d.plot > 0; })
                .style("fill", function(d) { return color(d.player) })
                .style('opacity',1)
              })
        
        g.append('text')
            .attr('class', 'title')
            .attr('y', -10)
            .attr('text-anchor','right')
            .text(title);

            g
            .select('svg')
                .attr("width", width+300)
                .attr("height", height)
        
            //Create the title for the legend
            var text = g.append("text")
                            .attr("class", "legend-title")
                            .attr('transform', 'translate(-72,-5)') 
                            .attr("x", width - 110)
                            .attr("y", 10)
                            .text("Players:");
                
            //Initiate Legend	
            var legend = g.append("g")
                            .attr("class", "legend")
                            .attr("height", 100)
                            .attr("width", 200)
                            .attr('transform', 'translate(-70,20)');
    
            //Create colour squares
            legend.selectAll('circle')
                    .data(data)
                    .enter()
                    .filter(function(d) {return d.plot > 0; })
                    .append('circle')
                    .attr("cx", width - 105)
                    .attr("cy", function(d, i){ return i * 20;})
                    .attr("r", legendCircleRadius)
                    .filter(function(d) {return d.plot > 0; })
                    .style("fill", function(d) { return color(d.player) });
    
            //Create text next to squares
            legend.selectAll('text')
                    .data(data)
                    .enter()
                    .filter(function(d) {return d.plot > 0; })
                    .append("text")
                    .attr("x", width - 92)
                    .attr("y", function(d, i){ return i * 20 + 4;})
                    .attr("font-size", "11px")
                    .attr("fill", "#737373")
                    .text(function(d) { return d.player; });

            // Set-up the export button
            d3.select('#save-button').on('click', function(){
              var svgString = getSVGString(svg.node());
              svgString2Image( svgString, 2*width, 2*height, 'png', save ); // passes Blob and filesize String to the callback
            
              function save( dataBlob, filesize ){
                saveAs( dataBlob, 'Court Science Scatter Chart.png' ); // FileSaver.js function
              }
            });
      };
    
    data = shapeScatterData(data) 
    render(data);
}
