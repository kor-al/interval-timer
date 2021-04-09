import React from 'react';

class Timer extends React.Component {

    constructor(props) {
        super(props);

        this.remaining = 0;
        this.currentDuration = 0; //to track changes in duration on pauses
        this.timerInterval = null
        this.startTime = undefined;

        this.update = this.update.bind(this);
        this.clear = this.clear.bind(this);
        this.start = this.start.bind(this);
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);
        this.reset = this.reset.bind(this);
    
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
        this.props.setTimeLeft(minutes, seconds)
    }

    setTimerInterval(duration) {
        this.clear();
        var timer = duration;
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.update(timer);
            if (--timer < 0) {
                this.clear();
                this.props.setPaused(true);
            }
        }, 1000)
    }


    start() {
        //if first start
        if(this.remaining === 0 || (this.currentDuration!==this.props.duration)){
            this.remaining = this.props.duration;//this.props.minutes*60 + this.props.seconds;
            this.currentDuration = this.props.duration;
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
        this.props.setPaused(false);
        this.setTimerInterval(remaining);
    }

    reset(){
        this.clear();
        this.props.setPaused(true);
        this.props.setDuration(this.props.default);
        this.props.setTimeLeft(this.props.default);
        this.remaining = 0;
    }

    

    render() {
        // let minutes = `${this.props.minutes < 10 ? "0" + this.props.minutes : this.props.minutes}`;
        // let seconds = `${this.props.seconds < 10 ? "0" + this.props.seconds : this.props.seconds}`;
        //let minutes = this.props.minutes ;
        //let seconds = this.props.seconds ;
        return (
            <div id='timer'>
                {this.props.minutes} : {this.props.seconds}
                <button onClick={this.start}>start</button>
                <button onClick={this.pause}>pause</button>
                <button onClick={this.reset}>reset</button>
            </div>
        )
    }

}


export default Timer;