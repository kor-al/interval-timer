import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRedo } from '@fortawesome/free-solid-svg-icons';

class Timer extends React.Component {

    constructor(props) {
        super(props);

        this.remaining = 0;
        this.currentDuration = 0; //to track changes in duration on pauses
        this.timerInterval = null
        this.startTime = undefined;
        this.activeMode = 'session';
        this.countSessions = 1;
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

        var btn = document.getElementById('reset');
        btn.onclick = function (event) {
            if (btn.classList.contains('spin')) {
                btn.classList.remove('spin');
            }
            btn.classList.add('spin');
            setTimeout(function () {
                if (btn.classList.contains('spin')) {
                    btn.classList.remove('spin');
                }
            }, 500);
        }

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
        this.countSessions = 1;
        this.props.reset();
    }

    switchMode() {
        this.activeMode = (this.activeMode === 'session' ? 'break' : 'session');
        this.props.setPropery('activeMode', this.activeMode);
        this.remaining = 0;
        if(this.activeMode ==='session'){
            this.countSessions+=1;
        }
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
                    <div id="timer-label" className="timer__label">
                        {this.props.data.activeMode}
                        <span className='sessionCount'>{`${this.props.data.isTimerPaused ?  "": ' #' + this.countSessions}`}</span>
                    </div>
                    <div id="timer-controls" className="timer__controls">
                        <button id="start_stop" className={`btn pause-play ${this.props.data.isTimerPaused ? "pause" : "play"}`} onClick={this.start}></button>
                        <button id="reset" className="btn reset" onClick={this.reset}><FontAwesomeIcon icon={faRedo} size='1x' /></button>
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