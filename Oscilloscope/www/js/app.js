document.addEventListener("deviceready", onDeviceReady, false);
var values = [];
var value;

function onDeviceReady()
{
    bluetooth = Bluetooth;
    chart = Chart;
    bluetooth.isEnabled();
    setInitialOptionsAndEvents(bluetooth, chart);
}

$(document).on("mobileinit", function () {
    $.mobile.allowCrossDomainPages = true;
    $.support.cors = true;
    $.mobile.buttonMarkup.hoverDelay = 0;
    $.mobile.pushStateEnabled = false;
    $.mobile.defaultPageTransition = "none";
});

function receive() {
    bluetooth.readUntil();
}
function setArrayOfCoordinate(point) {
    values.push({
        x: point.x,
        y: point.y
    });
}

function getArrayOfCoordinate() {
    var arrayOfValues = values.slice(0);
    values.length = 0;
    return arrayOfValues;
}

function setPoint(point) {
    value = {
        x: point.x,
        y: point.y
    };
}
function getPoint() {
    return value;
}
function sendDataForChart(typeChart, values) {
    var signalValues;
    $.mobile.loading("hide");
    if (typeChart == "Static") {
        signalValues = chart.staticChart(values);
        printSignalValues(signalValues, bluetooth);
    } else {
        if (typeChart == "secondDinamic") {
            signalValues = chart.secondDinamicChart(values);
            printSignalValues(signalValues, bluetooth);
        }
    }
}