import React, { Component } from "react";
import './viz_lab.css';
import { CSVReader } from 'react-papaparse'

const inputElement = document.getElementById("test");
const dropDown = document.getElementById("drop-down");
const radar_input = document.getElementById('radar-input');
const bar_input = document.getElementById('bar-input');
var img_src = "static/Radar-Chart.png";
var target_id = "";
var max_players = 3;
var min_players = 1;
var max_stats = 7;
var min_stats = 3;


function allowDropStats(ev) {
    if (document.getElementById('drop-stats').children.length<max_stats && target_id.includes('stat')) ev.preventDefault();
}

function allowDropPlayers(ev) {
    if (document.getElementById('drop-players').children.length<max_players && target_id.includes('name')) ev.preventDefault();
}

function allowDropPlayersBack(ev) {
    if(target_id.includes('name')) ev.preventDefault();
}

function allowDropStatsBack(ev) {
    if(target_id.includes('stat')) ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    target_id = ev.target.id;
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    court_science_magic(inputCSV);
}

function disableDrop(ev) {
    ev.stopPropagation();
}

function CSV_to_parsed_df(data, rows, cols) {
    var obj_df = [];
    for (var i=1; i<data.length; i++) {
        var obj = {};
        for (var col of cols) {
            obj[data[0][col]] = data[i][col];
        }
        obj['Plot'] = rows.includes(i);
        obj_df.push(obj);
    }
    return obj_df;
}

function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'static/Definitions.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }

function getHoverDefinition(stat, id) {
loadJSON(function(response) {
    var JSON_parsed = JSON.parse(response);
    var stat_to_search = stat.toUpperCase();
    if (JSON_parsed.hasOwnProperty(stat_to_search)) {
        document.getElementById(id).title = JSON_parsed[stat_to_search];
    }
});
}


function main(data) {
    var lst_stats = [window.$name_index];
    var lst_players = [];
    var stats_children = document.getElementById('drop-stats').children;
    var players_children = document.getElementById('drop-players').children;
    var div_to_add = document.getElementById('right-div');
    var chart = document.getElementById('chart-div');
    console.log(stats_children);

    for (ch of stats_children) {
        lst_stats.push(parseInt(ch.value));
    }

    for (ch of players_children) {
        lst_players.push(parseInt(ch.value));
    }

    var obj_df = CSV_to_parsed_df(data, lst_players, lst_stats);
    chart.remove();
    div_to_add.insertAdjacentHTML('beforeend', "<div id='chart-div' style='float: right; width: 70%; margin-top: 30px;'><div id='container' class='svg-container'></div></div>");

    /*
    var g = d3.select("#chart-div").select("#container")
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 -20 600 450")
                .classed("svg-content", true);

     */

    if(radar_input.checked) {
        //radarChart(obj_df);
        console.log('test-radar');
    } else {
        //groupedBarChart(obj_df);
        console.log('test-bar');

    }
}

function court_science_magic (inputCSV) {
    Papa.parse(inputCSV, {
        download: true,
        dynamicTyping: true,
        complete: function(results) {
            var stats = document.getElementById('drop-stats').children.length;
            var players = document.getElementById('drop-players').children.length;
            if(stats >= min_stats && stats <= max_stats && players >= min_players && players <= max_players) {
                main(results['data']);
            }
        }
    });
}

function papaParse(inputCSV) {
    Papa.parse(inputCSV, {
        download: true,
        complete: function(results) {
            let df = results['data'];
            window.num_players = df.length - 1;
            let headers = df[0];
            //console.log(headers);
            let sample_data = df[1];
            let num_str = "0123456789";
            let headers_filtered = [];
            let headers_filtered_index = [];
            let count = 1;
            window.$name_index = 0;
            let name_found = false;

            for (let i = 0; i < headers.length; i++) {
                if (num_str.includes(sample_data[i][0])) {
                    headers_filtered.push(headers[i]);
                    headers_filtered_index.push(i);
                }
                if (headers[i].toUpperCase().includes("NAME") && !name_found) {
                    window.$name_index = i;
                    name_found = true;
                }
            }
            if(!name_found) {
                alert("Please include a 'player name' column in your spreadsheet to identify players!")
            } else {
                window.num_stats = headers_filtered.length;

                var stats_drag = document.getElementById('drag-stats');
                var players_drag = document.getElementById('drag-players');
                var stats_drop = document.getElementById('drop-stats');
                var players_drop = document.getElementById('drop-players');
                stats_drag.innerHTML = '';
                players_drag.innerHTML = '';
                stats_drop.innerHTML = '';
                players_drop.innerHTML = '';


                for (let i=0; i < headers_filtered.length; i++) {
                    let name = "'stat" + String(count) + "'";
                    let id = "stat" + String(count);
                    let string_to_add = "<button type='button' style='margin-right: 2%; margin-bottom: 2%' class='btn btn-primary' ondragover='disableDrop(event)' ondrop='disableDrop(event)' name='" + headers_filtered[i] + "' draggable='true' ondragstart='drag(event)' id=" + name + " value=" + "'"+ headers_filtered_index[i] + "'>" + headers_filtered[i] + "</button>";
                    //console.log(string_to_add);
                    stats_drag.insertAdjacentHTML('beforeend', string_to_add);
                    getHoverDefinition(headers_filtered[i], id);
                    count += 1;
                }

                count = 1;

                for (let i = 1; i < df.length; i++) {
                    let player_name = df[i][window.$name_index];
                    let name = "'name" + String(count) + "'";
                    let name_attr = "'" + player_name + "'";
                    let string_to_add = "<button type='button' style='margin-right: 2%; margin-bottom: 2%' class='btn btn-primary' ondragover='disableDrop(event)' ondrop='disableDrop(event)' name=" + name_attr + " draggable='true' ondragstart='drag(event)' id=" + name + " value=" + "'"+ i + "'>" + player_name + "</button>";
                    players_drag.insertAdjacentHTML('beforeend', string_to_add);
                    count++;
                }
            }
        }
    });
}

function resetButton() {
    dropDown.disabled = false;
    inputElement.disabled = false;
    papaParse(inputCSV);
    document.getElementById('chart-div').remove();
    document.getElementById('right-div').insertAdjacentHTML('beforeend', "<div id='chart-div' style='float: right; width: 100%; margin-top: 30px;'><img id=\"starter-img\" height='550' style=\"float: right; width: 95%\"></div>");
    document.getElementById('starter-img').src = img_src;
}


var inputCSV = "";

inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {
    inputCSV = this.files[0];
    papaParse(inputCSV);
    //let dataFrame = returnDF(inputCSV);
    dropDown.disabled = true;
}

dropDown.addEventListener("change", handleLocalFiles, false);
function handleLocalFiles() {
    if (dropDown.value != "") {
        inputCSV = dropDown.value;
        papaParse(inputCSV);
        //console.log(d3.csv(dropDown.value));
        inputElement.disabled = true;
    }
}


var stats_message = document.getElementById('stats-message');
var players_message = document.getElementById('players-message');
var image_display = document.getElementById('starter-img');

radar_input.addEventListener("change", handleRadar, false);
function handleRadar() {
    if(radar_input.checked) {
        var stats = document.getElementById('drop-stats').children.length;
        var players = document.getElementById('drop-players').children.length;
        stats_message.innerHTML = "*Drop 3-7 stats";
        players_message.innerHTML = "*Drop 1-3 players";
        max_players=3;
        max_stats=7;
        min_stats = 3;
        min_players = 1;
        image_display.src = 'static/Radar-Chart.png';
        img_src = "static/Radar-Chart.png";
        if(stats >= min_stats && stats <= max_stats && players >= min_players && players <= max_players) {
            court_science_magic(inputCSV)
        } else if((stats > 0 && stats < min_stats) || (stats > max_stats) || (players > 0 && players < min_players) || (players > max_players)) {
            document.getElementById('chart-div').remove();
            document.getElementById('right-div').insertAdjacentHTML('beforeend', "<div id='chart-div' style='float: right; width: 100%; margin-top: 30px;'><img src=\"{{ url_for('static', filename='Radar-Chart.png') }}\" id=\"starter-img\" height='550' style=\"float: right; width: 95%\"></div>");
            alert("Please select " + min_stats + "-" + max_stats + " stats and " + min_players + "-" + max_players + " players to plot!");
        }
    }
}

bar_input.addEventListener("change", handleBar, false);
function handleBar() {
    if(bar_input.checked) {
        var stats = document.getElementById('drop-stats').children.length;
        var players = document.getElementById('drop-players').children.length;
        stats_message.innerHTML = "*Drop 1-5 stats";
        players_message.innerHTML = "*Drop 2-5 players;";
        max_players=5;
        max_stats=5;
        min_stats = 1;
        min_players = 2;
        image_display.src = 'static/Bar-Chart (3).png';
        img_src = "static/Bar-Chart (3).png";
        if(stats >= min_stats && stats <= max_stats && players >= min_players && players <= max_players) {
            court_science_magic(inputCSV)
        } else if((stats > 0 && stats < min_stats) || (stats > max_stats) || (players > 0 && players < min_players) || (players > max_players) || (stats > 0 && players < min_players)) {
            document.getElementById('chart-div').remove();
            document.getElementById('right-div').insertAdjacentHTML('beforeend', "<div id='chart-div' style='float: right; width: 100%; margin-top: 30px;'><img src=\"{{ url_for('static', filename='Bar-Chart (3).png') }}\" id=\"starter-img\" height='550' style=\"float: right; width: 95%\"></div>")
            alert("Please select " + min_stats + "-" + max_stats + " stats and " + min_players + "-" + max_players + " players to plot!");
        }
    }
}

function searchBarPlayers() {
  var input, filter, container, buttons, i, txtValue;
  input = document.getElementById('searchInputPlayers');
  filter = input.value.toUpperCase();
  container = document.getElementById("drag-players");
  buttons = container.getElementsByTagName('button');

  for (i = 0; i < buttons.length; i++) {
    txtValue = buttons[i].name;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      buttons[i].style.display = "";
    } else {
      buttons[i].style.display = "none";
    }
  }
}

function searchBarStats() {
  var input, filter, container, buttons, i, txtValue;
  input = document.getElementById('searchInputStats');
  filter = input.value.toUpperCase();
  container = document.getElementById("drag-stats");
  buttons = container.getElementsByTagName('button');

  for (i = 0; i < buttons.length; i++) {
    txtValue = buttons[i].name;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      buttons[i].style.display = "";
    } else {
      buttons[i].style.display = "none";
    }
  }
}


class VizLab extends Component {
  render() {
      return(
      <div className="body-section-2" id="demo">
            <div style={{marginBottom:'50px'}}><h2 className="title">VISUALIZATION LAB</h2></div>
            <b className="list-text" style={{fontSize: "36px"}}>5 Steps to Court Science Magic:</b>
            <ol className="list-text">
                <li>Select a sample NBA Dataset from the dropdown menu or upload your own spreadsheet (in CSV format).
                </li>
                <li>Select your chart type.</li>
                <li>Drag and drop the stats you'd like to plot into the 'Stats to Plot' box.</li>
                <li>Drag and drop the players you'd like to compare into the 'Players to Compare' box.</li>
                <li>Watch your visualizations being created in real-time and have fun!</li>
            </ol>
            <br/><br/>
                <div style={{marginBottom: '50px', height: '70px'}}>
                    <div style={{float: 'left', width: '100%'}}>
                        <div style={{float: 'left', marginRight: '2%', marginTop: '18px'}}>
                            <select id="drop-down" name="Data selection">
                                <option value="">Select NBA Data Source</option>
                                <option
                                    value="https://raw.githubusercontent.com/court-science/MVP/master/NBA%20Data/2019-2020%20NBA%20Player%20Stats.xlsx%20-%20Sheet1.csv">2019-2020
                                    NBA Season
                                </option>
                                <option
                                    value="https://raw.githubusercontent.com/court-science/MVP/master/NBA%20Data/2018-2019%20NBA%20Player%20Stats.xlsx%20-%20Sheet1.csv">2018-2019
                                    NBA Season
                                </option>
                                <option
                                    value="https://raw.githubusercontent.com/court-science/MVP/master/NBA%20Data/nba_draft_combine_all_years.csv">NBA
                                    Draft Combine
                                </option>
                            </select>
                        </div>
                        <div style={{float: 'left', marginRight: '2%', marginTop: '18px'}}><p>OR</p></div>
                        <div style={{float: 'left',}}><input type="file" id="test" name="myCSV" accept=".csv"/></div>
                    </div>
                </div>
                <div>
                    <div id='left-div' style={{float: 'left', marginRight: '4%', width: '30%', height: '100%'}}>
                        <div className="spacing" style={{height: '100%'}}>
                            <input type="text" className="searchInput" id="searchInputStats" onKeyUp={searchBarStats}
                                   placeholder="Search for stats"/>
                                <p>Stats</p>
                                <div className='div-container' id='drag-stats' onDrop={(e) => this.drop(e)}
                                     onDragOver={(e) => this.allowDropStatsBack(e)}></div>
                        </div>
                        <div>
                            <input type="text" className="searchInput" id="searchInputPlayers"
                                   onKeyUp={searchBarPlayers} placeholder="Search for players"/>
                                <p>Players</p>
                                <div className='div-container' id='drag-players' onDrop={(e) => this.drop(e)}
                                     onDragOver={(e) => this.allowDropPlayersBack(e)}></div>
                        </div>
                        <div id='submit-reset' className='div-spacing'>
                            <button type='button' className='btn btn-outline-dark btn-lg' value='Reset'
                                    onClick={resetButton} style={{width: '100%'}}>Reset
                            </button>
                        </div>
                    </div>
                    <div id='right-div' style={{float: 'left', width: '65%', height: '100%'}}>
                        <div id='chart-selection' style={{float: 'left', width: '20%', marginRight: '5%', marginTop: '3vh;'}}>
                            <p style={{textAlign: 'center', fontSize: '24px'}}><b>Chart Type</b></p>
                            <div style={{float:'left', width: '42%', height: '80px'}}>
                                <label>
                                    <input id='radar-input' type="radio" name="radio-button" value="Radar" checked/>
                                        <img style={{width: '100%', height: '100%'}} title="Radar Chart"
                                             src={require("./Radar_Chart_Button.png")}/>
                                </label>
                            </div>
                            <div style={{float: 'right', width: '42%', height: '80px;'}}>
                                <label>
                                    <input id='bar-input' type="radio" name="radio-button" value="Bar"/>
                                        <img style={{width: '100%', height: '100%'}} title="Bar Chart"
                                             src={require("./Bar_Chart_Button.png")}/>
                                </label>
                            </div>
                        </div>
                        <div style={{float: 'left', marginRight: '5%', width: '35%'}}>
                            <p>Stats to Plot</p>
                            <div className='drop-zone' id='drop-stats' onDrop={(e) => this.drop(e)}
                                 onDragOver={(e) => this.allowDropStatsBack(e)}></div>
                            <p><i id='stats-message'>*Drop 3-7 stats</i></p>
                        </div>
                        <div style={{float: 'left', width: '35%'}}>
                            <p>Players to Compare</p>
                            <div className='drop-zone' id='drop-players' onDrop={(e) => this.drop(e)}
                                 onDragOver={(e) => this.allowDropPlayersBack(e)}></div>
                            <p><i id='players-message'>*Drop 1-3 players</i></p>
                        </div>
                        <div id="chart-div" style={{float: 'right', width: '100%', marginTop: '3%'}}>
                            <img src={require("./Radar-Chart.png")} id="starter-img"
                                 alt="Radar-Chart.png" className="display-chart"/>
                        </div>
                    </div>
                </div>
        </div>
      );
  }
}

export default VizLab