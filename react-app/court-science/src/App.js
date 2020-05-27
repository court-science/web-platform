import React, { Component } from 'react';
import logo from './logo.svg';
import './static/style.css';
import NavBar from './Components/NavBar/nav_bar'
import About from './Components/About/about'
import Contact from './Components/Contact/contact'
import VizLab from './Components/VizLab/viz_lab'


function App() {
  return (
    <div className="App">
        <body>
        <NavBar />
        <About />
        <VizLab />
        <Contact />
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
