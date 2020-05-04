var BarChart = {
    draw: function(d){
        let width = 50
        let height = 50
        let data=d
        const svg = d3.create("svg")
            .attr("viewBox", [0, 0, width, height]);
        
        const bar = svg.append("g")
            .attr("fill", "steelblue")
        .selectAll("rect")
        .data(data)
        .join("rect")
            .style("mix-blend-mode", "multiply")
            .attr("x", d => x(d.name))
            .attr("y", d => y(d.value))
            .attr("height", d => y(0) - y(d.value))
            .attr("width", x.bandwidth());
        
        const gx = svg.append("g")
            .call(xAxis);
        
        const gy = svg.append("g")
            .call(yAxis);
    
        return Object.assign(svg.node(), {
        update(order) {
            x.domain(data.sort(order).map(d => d.name));
    
            const t = svg.transition()
                .duration(750);
    
            bar.data(data, d => d.name)
                .order()
            .transition(t)
                .delay((d, i) => i * 20)
                .attr("x", d => x(d.name));
    
            gx.transition(t)
                .call(xAxis)
            .selectAll(".tick")
                .delay((d, i) => i * 20);
            }
        });
  }
}