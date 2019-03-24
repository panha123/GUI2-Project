import React, { Component } from 'react'
import Pika from '../../img/pika.jpg'

export default class Dashboard2 extends Component {
  render() {
    return (
        <div className="col m4">
            <div id="ProfPic">
                <img src={Pika} alt="Pika" width="250" height="250"/>
                
            </div>

            <div id="InfoBox">

            </div>
        </div>
    )
  }
}
