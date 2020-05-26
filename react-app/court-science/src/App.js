import React, { Component } from 'react';
import logo from './logo.svg';
import './static/style.css';
import NavBar from './Components/NavBar/nav_bar'
import About from './Components/About/about'

function App() {
  return (
    <div className="App">
        <body>
        <NavBar />
        <About />
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
                            <input type="text" className="searchInput" id="searchInputStats" onKeyUp="searchBarStats()"
                                   placeholder="Search for stats"/>
                                <p>Stats</p>
                                <div className='div-container' id='drag-stats' onDrop='drop(event)'
                                     onDragOver='allowDropStatsBack(event)'></div>
                        </div>
                        <div>
                            <input type="text" className="searchInput" id="searchInputPlayers"
                                   onKeyUp="searchBarPlayers()" placeholder="Search for players"/>
                                <p>Players</p>
                                <div className='div-container' id='drag-players' onDrop='drop(event)'
                                     onDragOver='allowDropPlayersBack(event)'></div>
                        </div>
                        <div id='submit-reset' className='div-spacing'>
                            <button type='button' className='btn btn-outline-dark btn-lg' value='Reset'
                                    onClick='resetButton()' style={{width: '100%'}}>Reset
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
                                             src={require("./static/Radar_Chart_Button.png")}/>
                                </label>
                            </div>
                            <div style={{float: 'right', width: '42%', height: '80px;'}}>
                                <label>
                                    <input id='bar-input' type="radio" name="radio-button" value="Bar"/>
                                        <img style={{width: '100%', height: '100%'}} title="Bar Chart"
                                             src={require("./static/Bar_Chart_Button.png")}/>
                                </label>
                            </div>
                        </div>
                        <div style={{float: 'left', marginRight: '5%', width: '35%'}}>
                            <p>Stats to Plot</p>
                            <div className='drop-zone' id='drop-stats' onDrop='drop(event)'
                                 onDragOver='allowDropStats(event)'></div>
                            <p><i id='stats-message'>*Drop 3-7 stats</i></p>
                        </div>
                        <div style={{float: 'left', width: '35%'}}>
                            <p>Players to Compare</p>
                            <div className='drop-zone' id='drop-players' onDrop='drop(event)'
                                 onDragOver='allowDropPlayers(event)'></div>
                            <p><i id='players-message'>*Drop 1-3 players</i></p>
                        </div>
                        <div id="chart-div" style={{float: 'right', width: '100%', marginTop: '3%'}}>
                            <img src={require("./static/Radar-Chart.png")} id="starter-img"
                                 alt="Radar-Chart.png" className="display-chart"/>
                        </div>
                    </div>
                </div>
        </div>
        <div id="contact" className="body-section-1">
            <h2 className="title">GET IN TOUCH</h2>
            <p className="body-text" style={{textAlign: 'center'}}>
                We would love to hear from you, send us a shout below!
            </p>
            <a href="mailto:contact@courtscience.ca">
                <img alt="email" className="email-button"
                     src="https://farm4.staticflickr.com/3726/13855354235_887ae071c0_b.jpg"/>
            </a>
        </div>
        <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"
                integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n"
                crossOrigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
                integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
                crossOrigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
                integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
                crossOrigin="anonymous"></script>
        </body>
    </div>
  );
}

export default App;
