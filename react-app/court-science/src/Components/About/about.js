import React, { Component } from "react";
import './about.css';

class About extends Component {
  render() {
      return(
        <div className="body-section-top" id="home">
            <h2 className="title">WHO WE ARE</h2>
            <p className="body-text">
                Court Science is a non-profit organization that aims to bridge the gap between STEM and sports by making
                the
                power of Data Science accessible to basketball enthusiasts worldwide, through our online interactive
                data
                visualization platform called the <a className="body-link" href="#demo">Visualization Lab</a> and
                community initiatives.
                In light of COVID-19, we have shifted all of our outreach efforts online (Youth Basketball Data Camp
                coming soon!),
                and hope that our simple yet powerful tools can empower you to explore new dimensions of your favourite
                sport
                through a STEM lens, while learning something new about Data Science. It's as easy as a few clicks and
                you're on
                your way!
            </p>
        </div>
      );
  }
}

export default About