import React, { Component } from 'react'
import './App.css'
import * as d3 from 'd3';

class RadarChart extends Component {
    state = {
        rawStatsData: null
    }

    componentWillMount() {
        const samplePlotData = [
            [
                {axis:"Points",value:0.75,raw_value:26},
                {axis:"Rebounds",value:0.56},
                {axis:"Assists",value:0.28},
                {axis:"Steals",value:0.60},
                {axis:"Blocks",value:0.48},
                {axis:"FG%",value:0.55},
                {axis:"3PT%",value:0.35},
            ],[
                {axis:"Points",value:0.59,raw_value:18},
                {axis:"Rebounds",value:0.26},
                {axis:"Assists",value:0.82},
                {axis:"Steals",value:0.79},
                {axis:"Blocks",value:0.18},
                {axis:"FG%",value:0.64},
                {axis:"3PT%",value:0.51},
            ],[
                {axis:"Points",value:0.59*Math.random()+0.4,raw_value:19},
                {axis:"Rebounds",value:0.26*Math.random()+0.4},
                {axis:"Assists",value:0.82*Math.random()+0.4},
                {axis:"Steals",value:0.79*Math.random()+0.4},
                {axis:"Blocks",value:0.18*Math.random()+0.4},
                {axis:"FG%",value:0.64*Math.random()+0.4},
                {axis:"3PT%",value:0.51*Math.random()+0.4},]
                // ],[
                // {axis:"Points",value:0.59*Math.random()+0.4},
                // {axis:"Rebounds",value:0.26*Math.random()+0.4},
                // {axis:"Assists",value:0.82*Math.random()+0.4},
                // {axis:"Steals",value:0.79*Math.random()+0.4},
                // {axis:"Blocks",value:0.18*Math.random()+0.4},
                // {axis:"FG%",value:0.64*Math.random()+0.4},
                // {axis:"3PT%",value:0.51*Math.random()+0.4},
                // ],[
                // {axis:"Points",value:0.59*Math.random()+0.4},
                // {axis:"Rebounds",value:0.26*Math.random()+0.4},
                // {axis:"Assists",value:0.82*Math.random()+0.4},
                // {axis:"Steals",value:0.79*Math.random()+0.4},
                // {axis:"Blocks",value:0.18*Math.random()+0.4},
                // {axis:"FG%",value:0.64*Math.random()+0.4},
                // {axis:"3PT%",value:0.51*Math.random()+0.4},
                // ]
          ];
        
        this.setState({
            rawStatsData : samplePlotData,
            selected: null
        });
    }

    componentDidMount() {
        const g = d3.select(this.refs.anchor),
            {width, height} = this.props;

        const d = this.state.rawStatsData;
        console.log("data within componentDidUpdate",d)

        const margin = {top: 30, right: 20, bottom: 30, left: 50};
        const cfg = {
              radius: 5,
              h: height,
              w: width,
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
              .range(["#ca0020","#f4a582","#92c5de","#0571b0","ffc033"])
             };
        
        cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
        const allAxis = (d[0].map(function(i, j){return i.axis}));
        const total = allAxis.length;
        const radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
        const Format = d3.format('0.1f');
             
        g
        .attr("width", cfg.w+cfg.ExtraWidthX)
        .attr("height", cfg.h+cfg.ExtraWidthY)
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
            
        //Circular segments
        for (let j=0; j<cfg.levels-1; j++){
            const levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
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

        var series = 0;
        
        const axis = g.selectAll(".axis")
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
        
         
        var dataValues = [];
        d.forEach(function(y, x){
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
                                var z = "polygon."+d3.select(this).attr("class");
                                g.selectAll("polygon")
                                .transition(200)
                                .style("fill-opacity", 0.1); 
                                g.selectAll(z)
                                .transition(200)
                                .style("fill-opacity", .7);
                                //console.log(d)
                            })
            .on('mouseout', function(){
                                g.selectAll("polygon")
                                .transition(200)
                                .style("fill-opacity", cfg.opacityArea);
            });
            series++;
        });
        series=0;
        
        
        d.forEach(function(y, x) {
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
                        var newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                        var newY =  parseFloat(d3.select(this).attr('cy')) - 5;
                        
                        var z = "polygon."+d3.select(this).attr("class");
                        g.selectAll("polygon")
                            .transition(200)
                            .style("fill-opacity", 0.1); 
                        g.selectAll(z)
                            .transition(200)
                            .style("fill-opacity", .7);
                        tooltip
                            .attr('x', newX)
                            .attr('y', newY)
                            .text(Format(d.raw_value))
                            .transition(200)
                            .style('opacity', 1);
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
        var tooltip = g.append('text')
                    .style('opacity', 0)
                    .style('font-family', 'sans-serif')
                    .style('font-size', '13px');
    }

    render() {
        console.log("THIS STATE:",this.state)
        return <g ref="anchor" />
    }
}

export default RadarChart;