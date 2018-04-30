/**
 * Created by Luca on 16/03/2016.
 */
var Bluetooth = (function () {
    var point = Coordinate;
    var mac;
    var defaultMac = "98:D3:31:20:47:6A";
    var status;
    var acquisitionTime = 500;
    var isConnected = function () {
        bluetoothSerial.isConnected(function () {
            connectionEstablished();
        }, function () {
            connectionFailed();
        });
    };
    var enable = function () {
        bluetoothSerial.enable(function () {

        }, function () {

        });
    };
    var unsubscribe = function () {
        bluetoothSerial.unsubscribe(function () {

        }, function () {

        });
    }
    return {
        connect: function (mac) {
            var macArduino;
            if (mac != null) {
                this.setMac(mac);
                macArduino = this.getMac();
            } else {
                macArduino = this.getDefaultMac();
            }
            bluetoothSerial.connect(macArduino, function () {
                isConnected();
            }, function () {
                isConnected();
            });
            return status;
        },
        disconnect: function () {
            bluetoothSerial.disconnect(function () {
                isConnected();
            }, function () {
                isConnected();
            });
        },
        isEnabled: function () {
            bluetoothSerial.isEnabled(function () {

            }, function () {
                enable();
            });
        },
        readUntil: function () {
            bluetoothSerial.readUntil("\n", null, null);
            bluetoothSerial.readUntil("\n", function (data) {
                if (data != "" && isNaN(parseFloat(data)) == false) {
                    point.setCoordinate((new Date()).getTime(), parseFloat(data));
                    setPoint(point.getCoordinate());
                } else {

                }
            }, function () {
            });
            this.clearBuffer();
        },
        subscribe: function (forMilliSec,type) {
            var i = 0;
            var j = 0;
            if (forMilliSec != null) {
                this.setAcquisitionTime(forMilliSec)
            } else {
            }
            bluetoothSerial.subscribe("\n", function (data) {
                if (j < 2) {//Salto i primi due valori ricevuti per evitare dati incompleti
                    j++;
                } else {
                    if (data != "" && isNaN(parseFloat(data)) == false) {
                        point.setCoordinate(i, parseFloat(data));
                        setArrayOfCoordinate(point.getCoordinate())
                        i++;
                    } else {

                    }

                }
            }, function () {

            });
            setTimeout(function () {
                i = 0;
                j = 0;
                unsubscribe();
                sendDataForChart(type, getArrayOfCoordinate())
            }, this.getAcquisitionTime());
        },
        setMac: function (setMac) {
            mac = setMac;
        },
        getMac: function () {
            return mac;
        },
        getDefaultMac: function () {
            return defaultMac;
        },
        setAcquisitionTime: function (time) {
            acquisitionTime = time;
        },
        getAcquisitionTime: function () {
            return acquisitionTime;
        },
        clearBuffer: function () {
            bluetoothSerial.clear(function () {
            }, function () {

            });
        }
    };
}());