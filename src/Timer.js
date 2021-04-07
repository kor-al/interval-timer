import React from 'react';

class Timer extends React.Component {

    constructor(props) {
        super(props);

        this.remaining = undefined;
        this.timerInterval = null
        this.startTime = undefined;


        this.state = { 'minutes': 0, 'seconds': 0 }
        this.update = this.update.bind(this);


        this.clear = this.clear.bind(this);
        this.start = this.start.bind(this);
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);
    
    }

    clear() {
        clearInterval(this.timerInterval)
    }

    update(timer) {
        console.log('update state', timer);
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        this.setState({ 'minutes': minutes, 'seconds': seconds })
    }

    setTimerInterval(duration) {
        this.clear();
        var timer = duration;
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.update(timer);
            if (--timer < 0) {
                timer = duration;
            }
        }, 1000)
    }


    start() {
        //if first start
        if(this.remaining === undefined){
            this.remaining = this.props.duration;
        }
        this.resume(this.remaining);

    }


    pause() {
        this.clear()
        this.props.setPaused(true);
        let pauseTime = Date.now(); //mseconds
        this.remaining -= (pauseTime - this.startTime)/1000;
    }

    resume(remaining) {
        this.setTimerInterval(remaining)
        this.props.setPaused(false);
    }


    render() {
        return (
            <div id='timer'>
                <div key = {this.props.duration}>{this.state.minutes}:{this.state.seconds}</div>
                {/* <button onClick={this.start}>start</button> */}
                {/* <button onClick={this.pause}>pause</button> */}
            </div>
        )
    }

}


export default Timer;