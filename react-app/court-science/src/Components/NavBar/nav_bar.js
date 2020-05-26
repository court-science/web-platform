import React, { Component } from "react";
import './nav_bar.css';

class NavBar extends Component {
  render() {
      return(
      <div className="navigation-bar">
          <ul className="navigation-bar">
              <li>
                  <div className="logo"><img src={require("./Nuclear_Court Science Logo.png")}
                                             style={{width: '200px'}}/></div>
              </li>
              <li className="navigation-bar-item" style={{marginRight: '2%'}}><a href="#contact">CONTACT</a></li>
              <li className="navigation-bar-item"><a href="#demo">VIZ LAB</a></li>
              <li className="navigation-bar-item"><a href="#home">HOME</a></li>
          </ul>
      </div>
      );
  }
}

export default NavBar