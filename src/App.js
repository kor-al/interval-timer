
import './App.css';
import './Timer.js';
import React from 'react';
import ReactFCCtest from 'react-fcctest';
import Timer from './Timer.js';


class Controls extends React.Component {

  constructor(props) {
      super(props);
      this.increment = this.increment.bind(this);
      this.decrement = this.decrement.bind(this);
  }

  increment(){
    this.props.update(+1, this.props.type);
  }

  decrement(){
    //only allow positive values
    this.props.update(-1, this.props.type);
  }


  render() {
      return ( 
          <div className='controls' id={`${this.props.type}-controls`}>
            <div id={`${this.props.type}-label`}>{this.props.type} length</div>
            <span id={`${this.props.type}-length`}>{this.props.count}</span>
            <button id={`${this.props.type}-increment`} className="increment" onClick={this.increment}>+</button>
            <button id={`${this.props.type}-decrement`} className="decrement" onClick={this.decrement}>-</button>
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
      this.setPause = this.setPause.bind(this);
      this.resetState = this.resetState.bind(this);
  }

  defaultState(){
    return {
      session: { duration: 25, minutes: 25, seconds: 0, default: 25},
      break: { duration: 5, minutes: 5, seconds: 0, default: 5 },
      isTimerPaused: true
    }
  }

  resetState() {
    this.setState(this.defaultState());
  }

  updateDuration(value, type = 'session'){
    this.setState((prevState )=>{
        var typeState = {...prevState [type]};
        var nextDuration =  typeState.duration + value;
        console.log('is paused', prevState.isTimerPaused);
        if( nextDuration > 0 && nextDuration <= 60 && prevState.isTimerPaused){
          typeState.duration = nextDuration;
          typeState.minutes = nextDuration;
          return {[type] : typeState};
        }
      })
    console.log('set start time', this.state[type].duration, value, type);
  }

  setPause(value){
    console.log('set pause to', value);
    this.setState({isTimerPaused : value})
  }
  
  // setTimeLeft(min, type, sec = 0){
  //   var typeState = {...this.state[type]}
  //   typeState.minutes = value;
  //   this.setState({typeState})
  // } 

  setTypeProperty(properties , type){
    //properties = {property: value}
    var typeState = {...this.state[type]}
    Object.keys(properties).forEach((property)=>{
      typeState[property] = properties[property];
    })
    this.setState({[type] : typeState})
  }  
  
  
  render(){
    return (
    <div className="App">
      <Controls type='session' update={this.updateDuration}  count={this.state['session'].duration} />
      <Controls type='break' update={this.updateDuration}  count={this.state['break'].duration} />
      <Timer data={this.state} setProperty = {this.setTypeProperty} setPause={this.setPause} reset = {this.resetState}/>
       {/* duration={this.state.duration*60} minutes={this.state.minutes} seconds={this.state.seconds} */}
       {/* setPaused={this.setPause} setTimeLeft={this.setTimeLeft} setDuration={this.setDuration}/>  */}
      <ReactFCCtest />
    </div>
  );
    }
}

export default App;
