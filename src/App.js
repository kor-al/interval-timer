
import './App.css';
import './Timer.js';
import React from 'react';
import ReactFCCtest from 'react-fcctest';
import Timer from './Timer.js';


class Controls extends React.Component {

  constructor(props) {
      super(props);
      this.state = {count: 25}
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
      this.state = {count: 25, isTimerPaused: true};
      this.updateCount = this.updateCount.bind(this);
      this.updatePause = this.updatePause.bind(this);
  }

  updateCount(value){
    if(this.state.count + value >=0 && this.state.isTimerPaused){
      this.setState({ count: this.state.count + value });
    }
    console.log('update');
  }

  updatePause(value){
    console.log('pause', value);
    this.setState({ isTimerPaused: value });
  }
  
  render(){
    return (
    <div className="App">
      <Controls type='session' update={this.updateCount}  count={this.state.count}/>
      <Timer duration ={this.state.count * 60} setPaused={this.updatePause}/>
      <ReactFCCtest />
    </div>
  );
    }
}

export default App;
