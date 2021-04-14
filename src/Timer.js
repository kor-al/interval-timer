import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRedoAlt, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

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
        this.audio = null;

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

    componentDidMount() {
        this.audio = document.getElementById('beep');
    }

    clear() {
        clearInterval(this.timerInterval)
    }

    update(timer) {
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);

        if (minutes >= 0 && seconds >= 0) {
            let properties = {
                'minutes': minutes,
                'seconds': seconds
            }
            this.props.setTypeProperty(properties, this.activeMode);
        }

    }

    setTimerInterval(duration) {
        this.clear();
        var timer = duration;
        this.startTime = Date.now();
        this.update(timer);
        timer--;
        this.timerInterval = setInterval(() => {
            if (timer < 0) {
                this.isPaused = true;
                this.clear();
                this.switchMode();
                this.start();
                return;
            }
            else {
                if (timer === 0) {
                    if (this.audio) {
                        this.audio.play();
                    }
                }
                this.update(timer);
                timer--;
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
        this.activeMode = 'session';
        this.remaining = 0;
        this.audio.pause();
        this.audio.currentTime = 0;
        this.props.reset();
    }

    switchMode() {
        this.activeMode = (this.activeMode === 'session' ? 'break' : 'session');
        this.props.setPropery('activeMode', this.activeMode);
        this.remaining = 0;
        this.countModeSwitches += 1;
    }

    switchPause(value) {
        this.isPaused = value;
        this.props.setPropery('isTimerPaused', this.isPaused);
    }


    render() {

        let minutes = this.props.data[this.activeMode].minutes;
        let seconds = this.props.data[this.activeMode].seconds;
        minutes = `${minutes < 10 ? "0" + minutes : minutes}`;
        seconds = `${seconds < 10 ? "0" + seconds : seconds}`;

        return (
            <div id='timer' className="timer">
                <div className="timer__header">
                    <div id="timer-label" className="timer__label">{this.props.data.activeMode}</div>
                    <div id="timer-controls" className="timer__controls">
                        <button id="start_stop" className="btn" onClick={this.start}><FontAwesomeIcon icon={faPlay} size='1x' /><FontAwesomeIcon icon={faPause} size='1x' /></button>
                        <button id="reset" className="btn" onClick={this.reset}><FontAwesomeIcon icon={faRedoAlt} size='1x' /></button>
                    </div>
                </div>

                <div className="timer__display">
                    <div id="time-left">{`${minutes}:${seconds}`}</div>
                </div>

                <audio id="beep" src={process.env.PUBLIC_URL + '/sounds/07022112.wav'}></audio>
                {/* <audio id="beep" src="https://sound-effects-media.bbcrewind.co.uk/mp3/07022112.mp3"></audio> */}
            </div>
        )
    }

}


export default Timer;