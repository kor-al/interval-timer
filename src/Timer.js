import React from 'react';

class Timer extends React.Component {

    constructor(props) {
        super(props);

        this.remaining = 0;
        this.currentDuration = 0; //to track changes in duration on pauses
        this.timerInterval = null
        this.startTime = undefined;
        this.activeMode = 'session';
        this.countModeSwitches = 0;
        this.isPaused = true;

        this.update = this.update.bind(this);
        this.clear = this.clear.bind(this);
        this.start = this.start.bind(this);
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);
        this.reset = this.reset.bind(this);
        this.stop = this.stop.bind(this);
        this.switchMode = this.switchMode.bind(this);
        this.switchPause = this.switchPause.bind(this);

    }

    clear() {
        clearInterval(this.timerInterval)
    }

    update(timer) {
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);

        console.log('update state', minutes, seconds);

        if (minutes >= 0 && seconds >= 0) {
            let properties = {
                'minutes': minutes,
                'seconds': seconds
            }
            this.props.setProperty(properties, this.activeMode);
        }

    }

    setTimerInterval(duration) {
        this.clear();
        var timer = duration;
        this.startTime = Date.now();
        --timer;
        this.timerInterval = setInterval(() => {
            this.update(timer);
            if (--timer < 0) {
                this.clear();
                //this.props.setPause(true);
                this.switchMode();
                this.start();
            }
        }, 1000)
    }


    start() {
        if (!this.isPaused) {
            this.pause();
        }
        else {
            //if first start
            if (this.remaining === 0 || (this.currentDuration !== this.props.data[this.activeMode].duration)) {
                this.remaining = this.props.data[this.activeMode].duration * 60 + this.props.data[this.activeMode].seconds;//in seconds;
                this.currentDuration = this.props.data[this.activeMode].duration;
            }
            console.log('remaining', this.remaining);
            this.resume(this.remaining);
        }
    }


    pause() {
        this.clear();
        this.switchPause(true);

        let pauseTime = Date.now(); //mseconds
        this.remaining -= (pauseTime - this.startTime) / 1000;
    }

    stop() {
        this.switchPause(true);
        this.clear();
    }

    resume(remaining) {
        this.switchPause(false);
        this.setTimerInterval(remaining);
    }

    reset() {
        this.clear();
        this.switchPause(true);
        this.remaining = 0;
        this.props.reset();
    }

    switchMode() {
        this.activeMode = (this.activeMode === 'session' ? 'break' : 'session');
        this.remaining = 0;
        this.countModeSwitches += 1;
    }

    switchPause(value) {
        this.isPaused = value;
        this.props.setPause(this.isPaused);
    }


    render() {

        let minutes = this.props.data[this.activeMode].minutes;
        let seconds = this.props.data[this.activeMode].seconds;
        minutes = `${minutes < 10 ? "0" + minutes : minutes}`;
        seconds = `${seconds < 10 ? "0" + seconds : seconds}`;

        return (
            <div id='timer'>
                <div id="timer-label">{this.activeMode}</div>
                <div id="time-left">{`${minutes}:${seconds}`}</div>
                <button id="start_stop" onClick={this.start}>start/pause</button>
                <button id="reset" onClick={this.reset}>reset</button>
            </div>
        )
    }

}


export default Timer;