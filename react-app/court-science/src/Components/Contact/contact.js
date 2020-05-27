import React, { Component } from "react";
import './contact.css';

class Contact extends Component {
  render() {
      return(
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
      );
  }
}

export default Contact