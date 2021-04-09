
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
    this.props.update(+1);
  }

  decrement(){
    //only allow positive values
    this.props.update(-1);
  }


  render() {
      return ( 
          <div className='controls'>
            {this.props.count}
            <button id='increment' onClick={this.increment}>+</button>
            <button id='decrement' onClick={this.decrement}>-</button>
          </div>
      )
  }

}



class App extends React.Component {

  constructor(props) {
      super(props);
      this.state = { duration: 25, isTimerPaused: true, minutes: 25, seconds: 0};
      this.updateDuration = this.updateDuration.bind(this);
      this.setPause = this.setPause.bind(this);
      this.setTimeLeft = this.setTimeLeft.bind(this);
      this.setDuration = this.setDuration.bind(this);
  }

  updateDuration(value){
    if(this.state.duration + value >=0 && this.state.isTimerPaused){
      this.setDuration(this.state.duration + value);
      this.setTimeLeft(this.state.duration + value);
    }
    
    console.log('set start time', this.state.duration, value);
  }

  setPause(value){
    this.setState({ isTimerPaused: value });
  }
  
  setTimeLeft(min, sec = 0){
    this.setState({ 'minutes': min, 'seconds': sec })
  } 

  setDuration(duration){
    this.setState({ duration: duration });
  }  
  
  
  render(){
    return (
    <div className="App">
      <Controls type='session' update={this.updateDuration}  count={this.state.duration} />
      <Timer default={25} duration={this.state.duration*60} minutes={this.state.minutes} seconds={this.state.seconds}
       setPaused={this.setPause} setTimeLeft={this.setTimeLeft} setDuration={this.setDuration}/> 
      <ReactFCCtest />
    </div>
  );
    }
}

export default App;
