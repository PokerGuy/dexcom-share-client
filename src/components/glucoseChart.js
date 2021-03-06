import React, {Component}                    from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import {Line} from 'react-chartjs-2';

export default class GlucoseChart extends Component {
    constructor(props) {
        super(props);
        this.formatTime = this.formatTime.bind(this);
    }

    componentWillMount() {
        this.setState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    formatTime(ticks, t, cb) {
        if (ticks % 6 == 0) {
            var AMPM = 'AM';
            var tz;
            if (localStorage.tz == undefined) {
                tz = 'America/Chicago';
            } else {
                tz = localStorage.tz;
            }
            var m = moment.tz(t, tz).format('HH:mm');
            var s = m.split(':');
            var h;
            var mins;
            if (s[0] == 0) {
                h = 12;
            } else if (s[0] == 12) {
                h = 12;
                AMPM = 'PM';
            } else if (s[0] > 12) {
                h = s[0] - 12;
                AMPM = 'PM';
            } else {
                h = s[0];
            }

            cb(h + ':' + s[1] + ' ' + AMPM);
        } else {
            cb("");
        }
    }

    render() {
        var history = <div></div>
        var historicalData;
        if (this.state.history) {
            var ticks = 0;
            var comptime;
            var historicalData = [];
            var labels = [];

            for (var x = this.state.history.length - 1; x >= 0; x--) {
                ticks++;
                var utcTime = new Date(this.state.history[x].time).getTime();
                if (ticks === 1) {
                    comptime = utcTime;
                    historicalData.push(this.state.history[x].glucose);
                    this.formatTime(6, utcTime, function (ft) {
                        labels.push(ft);
                    });
                } else if (((comptime + 4 * 60 * 1000) < utcTime) && (utcTime < (comptime + 6 * 60 * 1000))) {
                    this.formatTime(ticks, utcTime, function (ft) {
                        labels.push(ft);
                    });
                    historicalData.push(this.state.history[x].glucose);
                    comptime = utcTime;
                } else {
                    while (utcTime > (comptime + 5.5 * 60 * 1000)) {
                        this.formatTime(ticks, comptime, function (ft) {
                            labels.push(ft);
                        });
                        ticks++;
                        historicalData.push(null);
                        comptime += 5 * 60 * 1000;
                    }
                    comptime = utcTime;
                    this.formatTime(ticks, utcTime, function (ft) {
                        labels.push(ft);
                    });
                    historicalData.push(this.state.history[x].glucose);
                }
            }
            var h = 300;
            var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            if (w > 768) {
                h = 100;
            }
            var data = {
                labels: labels,
                datasets: [
                    {
                        label: '',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: historicalData
                    }
                ]
            };
            var options = {
                title: {
                    display: true,
                    text: 'Trend Data'
                },
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        //type: 'logarithmic',
                        ticks: {
                            min: 0,
                            max: 400,
                        }
                    }],
                    range: [
                        {
                            start: 0,
                            end: 80,
                            color: 'rgba(250,0,0,0.5)'
                        },
                        {
                            start: 280,
                            end: 400,
                            color: 'rgba(250,0,0,0.5)'
                        }
                    ]
                }
            };
            history = <div><Line data={data} options={options} height={h}/></div>
        }
        return (
            <div>{history}</div>
        );
    }
}
