import './App.css';
import './Timer.css';
import './Timer.js';
import React from 'react';
import ReactFCCtest from 'react-fcctest';
import Timer from './Timer.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';


class Controls extends React.Component {

  constructor(props) {
    super(props);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }

  increment() {
    this.props.update(+1, this.props.type);
  }

  decrement() {
    //only allow positive values
    this.props.update(-1, this.props.type);
  }


  render() {
    return (
      <div className='controls' id={`${this.props.type}-controls`}>
        <div id={`${this.props.type}-label`} className='controls__label'>{this.props.type}</div>
        <div className="controls__panel">
          <span id={`${this.props.type}-length`} className='controls__length'>{this.props.count}</span>
          <span className='controls__buttons' >
            <button id={`${this.props.type}-increment`} className='controls__increment' onClick={this.increment}><FontAwesomeIcon icon={faAngleUp} size='2x' /></button>
            <button id={`${this.props.type}-decrement`} className="controls__decrement" onClick={this.decrement}><FontAwesomeIcon icon={faAngleDown} size='2x' /></button>
          </span>
        </div>
      </div>
    )
  }

}



class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.defaultState();

    this.updateDuration = this.updateDuration.bind(this);
    this.setTypeProperty = this.setTypeProperty.bind(this);
    this.setProperty = this.setProperty.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  defaultState() {
    return {
      session: { duration: 25, minutes: 25, seconds: 0, default: 25 },
      break: { duration: 5, minutes: 5, seconds: 0, default: 5 },
      isTimerPaused: true,
      activeMode: 'session'
    }
  }

  componentDidMount() {
    // var timer = document.getElementById('timer');
    var app = document.querySelector('.App');
    var controls = document.querySelector('.App__controls');
    var timer = document.getElementById('timer');

    // timer.addEventListener('mouseover', (e) => {

    //     if (!controls.classList.contains('active')) {
    //       controls.classList.add('active');
    //       setTimeout(()=>{
    //         if(!this.state.isTimerPaused){
    //           controls.classList.remove('active');
    //         }
    //     }, 3000);
    //     } 
  
  
    //   });

  }

  resetState() {
    this.setState(this.defaultState());
  }

  updateDuration(value, type = 'session') {
    this.setState((prevState) => {
      var typeState = { ...prevState[type] };
      var nextDuration = typeState.duration + value;
      if (nextDuration > 0 && nextDuration <= 60 && prevState.isTimerPaused) {
        typeState.duration = nextDuration;
        typeState.minutes = nextDuration;
        typeState.seconds = 0;
        return { [type]: typeState };
      }
    })
  }

  setProperty(property, value) {
    this.setState({ [property]: value })
  }


  setTypeProperty(properties, type) {
    //properties = {property1: value1, property2: value2, ...}
    var typeState = { ...this.state[type] }
    Object.keys(properties).forEach((property) => {
      typeState[property] = properties[property];
    })
    this.setState({ [type]: typeState })
  }


  render() {
    
    let appClass = '';
    if(this.state.isTimerPaused){
      appClass = 'paused';
    }
    else{
      if(this.state.activeMode === 'session'){
        appClass = 'in-session';
      }
      if(this.state.activeMode === 'break'){
        appClass = 'in-break';
      }
    } 


    return (
      <div className={`App ${appClass}`}>
        <div className="App__container">
        <Timer data={this.state} setTypeProperty={this.setTypeProperty} setPropery={this.setProperty} reset={this.resetState} />
        <div className={`App__controls ${this.state.isTimerPaused ? "active" : ""}`}>
          <Controls type='session' update={this.updateDuration} count={this.state['session'].duration} />
          <Controls type='break' update={this.updateDuration} count={this.state['break'].duration} />
        </div>
        <ReactFCCtest />
      </div>
      </div>
    );
  }
}

export default App;
