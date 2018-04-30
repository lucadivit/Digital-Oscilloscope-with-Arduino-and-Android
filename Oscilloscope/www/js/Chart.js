/**
 * Created by Luca on 16/03/2016.
 */
var Chart = (function () {
    var dinamicaInterval;
    var defineSettings = function () {
        Highcharts.setOptions({
            chart: {
                renderTo: "chartdiv",
                type: "spline"
            },
            global: {
                useUTC: false
            },
            exporting: {
                enabled: false
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                spline: {
                    marker: {
                        enabled: false
                    },
                    lineWidth: 2
                }
            },
            yAxis: {
                title: {
                    text: "Voltage"
                },
                max: null,
                min: null
            }
        });
    };

    var nullChart = function () {
        var zeroArray = [];
        for (i = 0; i < 10; i++) {
            zeroArray.push({
                x: i,
                y: 0
            })
        }
        ;
        var option = {
            title: {
                text: ""
            },
            series: [{
                    showInLegend: false,
                    data: zeroArray
                }]
        };
        new Highcharts.Chart(option);
    };
    var offsetCalculates = function (values) {
        var numberOfElements = values.length;
        var sum = 0;
        var offset = 0;
        values.forEach(function (item) {
            sum = sum + Math.abs(item.y);
        });
        offset = (Math.round((sum / numberOfElements) * 100)) / 100;
        return offset;
    };
    var amplitudeCalculate = function (values) {
        var min = 0;
        var max = 0;
        var amplitude = 0;
        var voltageValue = [];
        values.forEach(function (item) {
            voltageValue.push(item.y)
        });
        min = Math.min.apply(null, voltageValue);
        max = Math.max.apply(null, voltageValue);
        amplitude = (Math.round((max - min) * 100)) / 100;
        return amplitude;
    };
    return {
        initialize: function () {
            defineSettings();
            nullChart();
        },
        modifyOrdinateScale: function (min, max) {
            if (min == 0 && max == 0) {
                Highcharts.setOptions({
                    yAxis: {
                        max: null,
                        min: null
                    }
                });
            } else {
                Highcharts.setOptions({
                    yAxis: {
                        max: max,
                        min: min
                    }
                });
            }
            nullChart();

        },
        dinamicChartStop: function () {
            clearInterval(dinamicaInterval);
        },
        staticChart: function (values) {
            var offset = offsetCalculates(values);
            var amplitude = amplitudeCalculate(values);
            var option = {
                title: {
                    text: "Static Chart"
                },
                xAxis: {
                    title: {
                        text: "Sample"
                    },
                },
                series: [{
                        showInLegend: false,
                        data: values
                    }]
            };
            new Highcharts.Chart(option);
            return {
                offset: offset,
                samplesNumber: values.length,
                amplitude: amplitude
            };
        },
        secondDinamicChart: function (values) {
            var firstValue = [];
            var offset = offsetCalculates(values);
            var amplitude = amplitudeCalculate(values);
            var j = 1;
            firstValue.push({
                x: 0,
                y: values[0].y
            })
            var option = {
                title: {
                    text: "Dinamic II Chart"
                },
                xAxis: {
                    min: 0,
                    minRange: values.length,
                    title: {
                        text: "Sample"
                    },
                },
                chart: {
                    animation: Highcharts.svg,
                    events: {
                        load: function () {
                            var series = this.series[0];
                            var interval = setInterval(function () {
                                if (j < values.length) {
                                    var xCoordinate = j
                                    var yCoordinate = values[j].y
                                    series.addPoint([xCoordinate, yCoordinate], true, false);
                                    j++;
                                } else {
                                    clearInterval(interval)
                                }
                            }, 500);
                        }
                    }
                },
                series: [{
                        showInLegend: false,
                        data: firstValue
                    }]
            }
            new Highcharts.Chart(option);
            return {
                offset: offset,
                samplesNumber: values.length,
                amplitude: amplitude
            };
        },
        dinamicChart: function (firstPoint) {
            var option = {
                plotOptions: {
                    spline: {
                        marker: {
                            enabled: true
                        },
                        lineWidth: 2
                    }
                },
                chart: {
                    animation: Highcharts.svg,
                    events: {
                        load: function () {
                            var series = this.series[0];
                            dinamicaInterval = setInterval(function () {
                                receive();
                                var point = getPoint();
                                series.addPoint([point.x, point.y], true, true);
                            }, 500);
                        }
                    }
                },
                title: {
                    text: "Dinamic I Chart"
                },
                series: [{
                        showInLegend: false,
                        data: (function () {
                            var data = [];
                            for (i = -10; i <= 0; i++) {
                                data.push({
                                    x: firstPoint.x + i * 500,
                                    y: firstPoint.y
                                });
                            }
                            return data;
                        }())
                    }],
                xAxis: {
                    title: {
                        text: "Time"
                    },
                    type: 'datetime',
                    tickPixelInterval: 150,
                }
            }
            new Highcharts.Chart(option);
        }
    }
}());
