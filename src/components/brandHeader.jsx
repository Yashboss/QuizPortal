import React, { Component } from 'react';
import Logo from '../image/Logo.png';
import Head from '../image/hackgridLogo.png'
 

class BrandHeader extends Component {
    state = {  }
    render() { 
        return ( 
            <div className="brand">
            <div className="navBar">
              <img id="Logo" src={Logo} alt="logo" className="navLogo"/>
              <div id="playerDetail" className="navs">
                <p id="teamName">Team Name:  {this.props.teamName}</p>
              </div>
            </div>
            <div className="headerText">
              <p style={{fontSize: 20}}>Hello! welcome to</p>
              <img src={Head} alt="HackGrid" id="headLogo"/>
              <p style={{fontSize: 17}}>By Apple Developers Group</p>
            </div>
          </div>
         );
    }
}

export default BrandHeader;
