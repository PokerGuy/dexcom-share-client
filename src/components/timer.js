import React, {Component}                    from 'react';

export default class NextReading extends Component {
    constructor(props) {
        super(props);
        this.calcTime = this.calcTime.bind(this);
        this.decrementTime = this.decrementTime.bind(this);
        this.state = {};
    }

    componentDidMount() {
        var state = {};
        if (this.props.lastEntry && this.props.status == 'CONNECTED') {
            state.next = this.calcTime(this.props.lastEntry);
            state.timer = true;
            window.timer = setInterval(this.decrementTime, 1000);
        } else {
            state.timer = false;
        }
        this.setState(state);
    }

    componentWillReceiveProps(nextProps) {
        var state = {};
        clearInterval(window.timer);
        if (nextProps.lastEntry && nextProps.status == 'CONNECTED') {
            state.next = this.calcTime(nextProps.lastEntry);
            window.timer = setInterval(this.decrementTime, 1000);
        } else {
            state.timer = false;
        }
        this.setState(state);
    }

    componentWillUnmount() {
        if (this.state.timer == true) {
            clearInterval(window.timer);
        }
    }

    calcTime(lastEntry) {
        var now = new Date().getTime();
        var last = new Date(lastEntry).getTime();
        var next = last + (60 * 1000 * 6); // 60 seconds, 1000 milliseconds per seconds, and anticipating in 6 minutes after the last call
        var until = next - now;
        if (until < 0) {
            until = 30 * 1000;
        }
        return until;
    }

    decrementTime() {
        var state = this.state;
        state.next = state.next - 1000;
        this.setState(state);
    }

    render() {
        var nextCall = 'Not Available';
        if (this.state.next) {
            var trunc = (this.state.next / 1000).toString().split(".");
            var seconds = parseInt(trunc[0]);
            var minutes = (seconds / 60).toString().split(".");
            var strMinutes = parseInt(minutes[0]);
            var strSeconds = seconds % 60;
            if (strSeconds < 10) {
                strSeconds = '0' + strSeconds;
            }
            nextCall = strMinutes + ':' + strSeconds;
            if (this.state.next < 0) {
                nextCall = 'Any second now...';
            }
        }
        if (this.state.status == 'DISCONNECTED') {
            nextCall = 'Disconnected';
        }
        return (
            <div>Next Reading: {nextCall}</div>
        );
    }
}
