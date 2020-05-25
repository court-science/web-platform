/*Summary
https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-9/1
9.9. Summary
Integrating D3 with MVC frameworks or view rendering libraries like React means you need to only use the parts of D3 that don’t overlap with your other libraries.
You have two fundamentally different ways to integrate D3: pass the DOM node to D3 and work on it separately from the rest of your application using traditional D3 select/enter/exit/update, or only use D3 to generate data and drawing instructions to pass to your other libraries.
NPM-based projects are better served by using individual D3 modules.
The brush() component lets you select a range of data in an intuitive way.
Cross-highlighting behavior is useful and expected when creating dashboards.
*/

//Dashboard CSS
<className CSS>
    rect.overlay {
        opacity: 0;
    }
    
    rect.selection {
        fill: #FE9922;
        opacity: 0.5;
    }
    
    rect.handle {
        fill: #FE9922;
        opacity: 0.25;
    }
    
    path.countries {
        stroke-width: 1;
        stroke: #75739F;
        fill: #5EAFC6;
    }
  </className>
/*
packages to install
  react-dom
  d3-shape
  d3-svg-legend
  d3-array
  d3-geo
  d3-selection
  d3-transition
  d3-brush
  d3-axis
  */

//React BarChart Component
import React, { Component } from 'react'
import './App.css'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'

class BarChart extends Component {
  constructor(props){
    super(props)
    this.createBarChart = this.createBarChart.bind(this)
  }

  componentDidMount() {
    this.createBarChart()
  }

  componentDidUpdate() {
    this.createBarChart()
  }

  createBarChart() {
    const node = this.node
    const dataMax = max(this.props.data)
    const yScale = scaleLinear()
      .domain([0, dataMax])
      .range([0, this.props.size[1]])

    select(node)
      .selectAll("rect")
      .data(this.props.data)
      .enter()
      .append("rect")

    select(node)
      .selectAll("rect")
      .data(this.props.data)
      .exit()
      .remove()

    select(node)
      .selectAll("rect")
      .data(this.props.data)
      .style("fill", "#fe9922")
      .attr("x", (d,i) => i * 25)
      .attr("y", d => this.props.size[1] - yScale(d))
      .attr("height", d => yScale(d))
      .attr("width", 25)
  }

  render() {
    return <svg ref={node => this.node = node}
            width={500} height={500}>
    </svg>
  }
}

export default BarChart

//Referencing BarChart.js in App.js
import React, { Component } from 'react'
import './App.css'
import BarChart from './BarChart'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>d3ia dashboard</h2>
        </div>
        <div>
        <BarChart data={[5,10,1,3]} size={[500,500]} />
        </div>
      </div>
    )
  }
}

export default App

//React WorldMap component
import React, { Component } from 'react'
import './App.css'
import worlddata from './world'
import { geoMercator, geoPath } from 'd3-geo'

class WorldMap extends Component {
  render() {
    const projection = geoMercator()
    const pathGenerator = geoPath().projection(projection)
    const countries = worlddata.features
      .map((d,i) => <path
        key={"path" + i}
        d={pathGenerator(d)}
        className="countries"
      />)

    return <svg width={500} height={500}>
      {countries}
    </svg>
  }
}

export default WorldMap

/*World.js Data
export default {"type":"FeatureCollection","features":[
    {"type":"Feature","id":"AFG","properties":{"name":"Afghanistan"},"geometry": {
        "type":"Polygon","coordinates":[61.210817,35.650072]},'
        */
//Updated App.js with sample data
       //...import the existing app.js imports...
       import WorldMap from './WorldMap'
       import worlddata from './world'
       import { range, sum } from 'd3-array'
       import { scaleThreshold } from 'd3-scale'
       import { geoCentroid } from 'd3-geo'
     
       const appdata = worlddata.features
       .filter(d => geoCentroid(d)[0] < -20)
     
       appdata
       .forEach((d,i) => {
         const offset = Math.random()
         d.launchday = i
         d.data = range(30).map((p,q) =>
           q < i ? 0 : Math.random() * 2 + offset) })
     
       class App extends Component {
     
         render() {
     
     const colorScale = scaleThreshold().domain([5,10,20,30,50])
        range(["#75739F", "#5EAFC6"])
           return (
             <div className="App">
               <div className="App-header">
                 <h2>d3ia dashboard</h2>
               </div>
               <div>
                 <WorldMap colorScale={colorScale} data={appdata} size={[500,400]} />
              </div>
           </div>
         )
       }
     }
     
     export default App
     
//Updated WorldMap component with color and data from parent
    import React, { Component } from 'react'
    import './App.css'
    import { geoMercator, geoPath } from 'd3-geo'

    class WorldMap extends Component {
    render() {
        const projection = geoMercator()
        .scale(120)
        .translate([430,250])
        const pathGenerator = geoPath().projection(projection)
        const countries = this.props.data
        .map((d,i) => <path
            key={"path" + i}
            d={pathGenerator(d)}
            style={{fill: this.props.colorScale(d.launchday),
                stroke: "black", strokeOpacity: 0.5 }}
            className="countries"
        />)
        return <svg width={this.props.size[0]} height={this.props.size[1]}>
        {countries}
        </svg>
    }
    }

    export default WorldMap;

//App.js updates for adding the barchart
import BarChart from './BarChart'
        <BarChart colorScale={colorScale} data={appdata}
size={[500,400]} />

//updated 
createBarChart() {
    const node = this.node
    const dataMax = max(this.props.data.map(d => sum(d.data)))
    const barWidth = this.props.size[0] / this.props.data.length
    const yScale = scaleLinear()
      .domain([0, dataMax])
      .range([0, this.props.size[1]])

//...nothing else changed in createBarChart until we create rectangles...

    select(node)
      .selectAll("rect")
      .data(this.props.data)
      .attr("x", (d,i) => i * barWidth)
      .attr("y", d => this.props.size[1] - yScale(sum(d.data)))
      .attr("height", d => yScale(sum(d.data)))
      .attr("width", barWidth)
      .style("fill", (d,i) => this.props.colorScale(d.launchday))
      .style("stroke", "black")
      .style("stroke-opacity", 0.25)

    }

    render() {
      return <svg ref={node => this.node = node}
              width={this.props.size[0]} height={this.props.size[1]}>
     </svg>
  }

//React Streamgraph component
import React, { Component } from 'react'
import './App.css'
import { stack, area, curveBasis, stackOrderInsideOut, stackOffsetSilhouette } from 'd3-shape'
import { range } from 'd3-array'
import { scaleLinear } from 'd3-scale'

class StreamGraph extends Component {
  render() {

    const stackData = range(30).map(() => ({}))
    for (let x = 0; x<30; x++) {
      this.props.data.forEach(country => {
        stackData[x][country.id] = country.data[x]
      })
    }
    const xScale = scaleLinear().domain([0, 30])
      .range([0, this.props.size[0]])

    const yScale = scaleLinear().domain([0, 60])
      .range([this.props.size[1], 0])

    const stackLayout = stack()
      .offset(stackOffsetSilhouette)
      .order(stackOrderInsideOut)
      .keys(Object.keys(stackData[0]))
    const stackArea = area()
      .x((d, i) => xScale(i))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(curveBasis)

    const stacks = stackLayout(stackData).map((d, i) => <path
        key={"stack" + i}
        d={stackArea(d)}
        style={{ fill: this.props.colorScale(this.props.data[i].launchday),
            stroke: "black", strokeOpacity: 0.25 }}
    />)

    return <svg width={this.props.size[0]} height={this.props.size[1]}>
      <g transform={"translate(0," + (-this.props.size[1] / 2) + ")"}>
      {stacks}
      </g>
    </svg>
  }
}

export default StreamGraph

//Reference streamgraph from App.js
import StreamGraph from './StreamGraph'
//...the rest of your existing app.js behavior...
   <StreamGraph colorScale={colorScale} data={appdata} size={[1000,250]} />

//Responsiveness state and size listeners App.js
   //...import necessary modules...
class App extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.state = { screenWidth: 1000, screenHeight: 500 }

  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth,
    screenHeight: window.innerHeight - 70 })
  }

  render() {
//...existing render behavior...
    const StreamGraph
    
    <StreamGraph colorScale={colorScale} data={appdata}
        size={[this.state.screenWidth, this.state.screenHeight / 2]} />

    <WorldMap colorScale={colorScale} data={appdata}
        size={[this.state.screenWidth / 2, this.state.screenHeight / 2]} />
    <BarChart colorScale={colorScale} data={appdata}
        size={[this.state.screenWidth / 2, this.state.screenHeight / 2]} />
    
    }
}

//Legends
import { legendColor } from 'd3-svg-legend'
import { transition } from 'd3-transition';

  createBarChart(); {
    const dataMax = max(this.props.data.map(d => sum(d.data)))
    const barWidth = this.props.size[0] / this.props.data.length
    const node = this.node

    const legend = legendColor()
      .scale(this.props.colorScale)
      .labels(["Wave 1", "Wave 2", "Wave 3", "Wave 4"])

    select(node)
      .selectAll("g.legend")
      .data([0])
      .enter()
      .append("g")
      .attr("class", "legend")
      .call(legend)

    select(node)
      .select("g.legend")
      .attr("transform", "translate(" + (this.props.size[0] - 100) + ", 20)"

  }

  //CROSS HIGHLIGHTING (App.js Updates)
  this.onHover = this.onHover.bind(this)
this.state = { screenWidth: 1000, screenHeight: 500, hover: "none" }

onHover(d) {
    this.setState({ hover: d.id })
}

<StreamGraph hoverElement={this.state.hover} onHover={this.onHover}
     colorScale={colorScale} data={appdata} size={[this.state.screenWidth,
this.state.screenHeight / 2]} />
<WorldMap hoverElement={this.state.hover} onHover={this.onHover}
     colorScale={colorScale} data={appdata}
size={[this.state.screenWidth / 2, this.state.screenHeight / 2]} />
<BarChart hoverElement={this.state.hover} onHover={this.onHover}
     colorScale={colorScale} data={appdata}
size={[this.state.screenWidth / 2, this.state.screenHeight / 2]} />


  //CROSS HIGHLIGHTING (CHARTS.js Updates)
  
  //BarChart
    select(node)
      .selectAll("rect")
      .data(this.props.data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .on("mouseover", this.props.onHover)

    select(node)
      .selectAll("rect.bar")
      .data(this.props.data)
      .attr("x", (d,i) => i * barWidth)
      .attr("y", d => this.props.size[1] - yScale(sum(d.data)))
      .attr("height", d => yScale(sum(d.data)))
      .attr("width", barWidth)
      .style("fill", (d,i) => this.props.hoverElement === d.id ?
            "#FCBC34" : this.props.colorScale(i))

    //WorldMap
    .map((d,i) => <path
        key={"path" + i}
        d={pathGenerator(d)}
        onMouseEnter={() => {this.props.onHover(d)}}
        style={{fill: this.props.hoverElement === d.id ? "#FCBC34" :
            this.props.colorScale(i), stroke: "black",
            strokeOpacity: 0.5 }}
        className="countries"
    />)

    //StreamGraph
    const stacks = stackLayout(stackData).map((d, i) => <path
        key={"stack" + i}
        d={stackArea(d)}
        onMouseEnter={() => {this.props.onHover(this.props.data[i])}}
        style={{fill: this.props.hoverElement === this.props.data[i]["id"] ?
        "#FCBC34" : this.props.colorScale(this.props.data[i]["id"].launchday),
        stroke: "black", strokeOpacity: 0.5 }}

    />)


//Brush component
//App.js
import Brush from './Brush'
<Brush size={[this.state.screenWidth, 50]} />

//Brush.js
import React, { Component } from 'react'
import './App.css'
import { select, event } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { brushX } from 'd3-brush'
import { axisBottom } from 'd3-axis'

class Brush extends Component {
  constructor(props){
    super(props)
    this.createBrush = this.createBrush.bind(this)
  }

  componentDidMount() {
    this.createBrush()
  }

  componentDidUpdate() {
    this.createBrush()
  }
  createBrush() {
  const node = this.node
  const scale = scaleLinear().domain([0,30])
    .range([0,this.props.size[0]])

  const dayBrush = brushX()
                  .extent([[0, 0], this.props.size])
                  .on("brush", brushed)

  const dayAxis = axisBottom()
    .scale(scale)

  select(node)
    .selectAll("g.brushaxis")
    .data([0])
    .enter()
    .append("g")
    .attr("class", "brushaxis")
    .attr("transform", "translate(0,25)")

  select(node)
    .select("g.brushaxis")
    .call(dayAxis)

  select(node)
    .selectAll("g.brush")
    .data([0])
    .enter()
    .append("g")
    .attr("class", "brush")

  select(node)
    .select("g.brush")
    .call(dayBrush)

  function brushed() {
    console.log(event)
     // brushed code
  };

  }

  render() {
    return <svg  ref={node => this.node = node}
width={this.props.size[0]} height={50}></svg>
  }
}

export default Brush

//Brush.js add brushed function
const brushFn = this.props.changeBrush
function brushed() {
    const selectedExtent = event.selection.map(d => scale.invert(d))
    brushFn(selectedExtent)
}

//App.js more changes for brush

this.onBrush = this.onBrush.bind(this)
this.state = { screenWidth: 1000, screenHeight: 500, hover: "none",
    brushExtent: [0,40] }


onBrush(d) {
    this.setState({ brushExtent: d })
}
render() {
    const filteredAppdata = appdata.filter((d,i) =>
        d.launchday >= this.state.brushExtent[0] &&
        d.launchday <= this.state.brushExtent[1])

<StreamGraph hoverElement={this.state.hover} onHover={this.onHover}
     colorScale={colorScale} data={filterdAppdata}
     size={[this.state.screenWidth, this.state.screenHeight / 2]} />
<Brush changeBrush={this.onBrush} size={[this.state.screenWidth, 50]} />
<WorldMap hoverElement={this.state.hover} onHover={this.onHover}
     colorScale={colorScale} data={filterdAppdata}
     size={[this.state.screenWidth / 2, this.state.screenHeight / 2]} />
<BarChart hoverElement={this.state.hover} onHover={this.onHover}
     colorScale={colorScale} data={filterdAppdata}
     size={[this.state.screenWidth / 2, this.state.screenHeight / 2]} />

//Pure render of overall statline (StatLine.js)
import React from 'react'
import { mean, sum } from 'd3-array'

export default (props) => {
  const allLength = props.allData.length
  const filteredLength = props.filteredData.length
  let allSales = mean(props.allData.map(d => sum(d.data)))
  allSales = Math.floor(allSales * 100)/100
  let filteredSales = mean(props.filteredData.map(d => sum(d.data)))
  filteredSales = Math.floor(filteredSales * 100)/100
  return <div>
  <h1><span>Stats: </span>
  <span>{filteredLength}/{allLength} countries selected. </span>
  <span>Average sales: </span>
  <span>{filteredSales} ({allSales})</span>
  </h1>
</div>
}
