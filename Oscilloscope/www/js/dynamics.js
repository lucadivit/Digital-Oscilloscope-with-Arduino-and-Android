
function manageAttr(idTag, attribute, value, remove) {
    if (remove) {
        return $("#" + idTag).removeAttr(attribute);
    } else {
        return $("#" + idTag).attr(attribute, value);
    }
}
function manageProp(idTag, attribute, value, check) {
    if (check) {
        return $("#" + idTag).prop(attribute);
    } else {
        return $("#" + idTag).prop(attribute, value);
    }

}
function connectionEstablished() {
    $.mobile.loading("hide");
    navigator.notification.alert("The device is connected", null, "Bluetooth State");
    manageAttr("homeToChart", "href", "#chart", false); //Assegna il link al tasto di indirizzamento della pagine del grafico
    manageProp("connectButton", "disabled", true, false); //Disabilita il tasto di connessione del bluetooth.
    manageProp("disconnectButton", "disabled", false, false); //Abilita il tasto di disconnessione del bluetooth.
}
function connectionFailed() {
    $.mobile.loading("hide");
    navigator.notification.alert("The device is disconnected", null, "Bluetooth State");
    manageAttr("homeToChart", "href", null, true);//Elimina il link assegnato al tasto di indirizzamento della pagine del grafico
    manageProp("connectButton", "disabled", false, false); //Attiva il pulsante di connessione del bluetooth
    manageProp("disconnectButton", "disabled", true, false); //Disabilita il pulsante di connessione del bluetooth
}
function printSignalValues(arrayOfCharacteristics, bluetooth) {
    $("#popupInfoOffset").text("Offset: " + arrayOfCharacteristics.offset);
    $("#popupInfoSamples").text("Number Of Samples: " + arrayOfCharacteristics.samplesNumber + " in: " + bluetooth.getAcquisitionTime() + " milliSec.");
    $("#popupInfoAmplitude").text("Amplitude: " + arrayOfCharacteristics.amplitude+" V")
}

function setInitialOptionsAndEvents(bluetooth, chart) {
    // Bluetooth relative

    var defaultMac = bluetooth.getDefaultMac();

    manageProp("disconnectButton", "disabled", true, false)//Disabilita bottone di disconnessione
    manageProp("macA", "disabled", true, false)//Disabilita la casella di input dell'indirizzo MAC

    if (manageProp("defaultMac", "checked", null, true)) {//Controlla il valore dell'attributo checked del tag relativo all'ID
        manageAttr("macA", "value", defaultMac);//Assegna alla casella di input il MAC di default
    } else {

    }

    $("#disconnectButton").click(function () {
        $.mobile.loading("show", {
            text: "I'm Disconnecting",
            textVisible: true
        })
        bluetooth.disconnect();
    });

    $("#connectButton").click(function () {
        $.mobile.loading("show", {
            text: "I'm Trying To Connect",
            textVisible: true
        })
        var mac = $("#macA").val();
        bluetooth.connect(mac);
    });

    $("#defaultMac").change(function () {
        if (manageProp("defaultMac", "checked", null, true)) {//Controlla il valore dell'attributo checked del tag relativo all'ID
            manageAttr("macA", "placeholder", "", false);//Annulla il placeholder della casella di testo del MAC
            manageAttr("macA", "value", defaultMac, false);//Assegna il MAC di default alla casella di testo del MAC
            manageProp("macA", "disabled", true, false);//Disabilita la casella di testo del MAC non rendendo possibile scriverci
        } else {
            manageAttr("macA", "value", null, false)//Annulla il valore della casella di testo del MAC
            manageAttr("macA", "placeholder", "AA:BB:CC:DD:EE:FF", false)//Attiva il placeholder della casella di testo del MAC
            manageProp("macA", "disabled", false, false);//Elimina la disabilitazione della casella di testo del MAC. Rende possibile scriverci.
        }
    });

    //Chart relative

    chart.initialize();

    $("#setYMinMax").click(function () {
        chart.modifyOrdinateScale($("#minY").val(), $("#maxY").val());
    });

    $("#secondDinamicChart").click(function () {
        chart.dinamicChartStop();
        $.mobile.loading("show", {
            text: "Loading",
            textVisible: true
        })
        bluetooth.clearBuffer();
        bluetooth.subscribe(null, "secondDinamic");
    })

    $("#staticChart").click(function () {
        chart.dinamicChartStop();
        $.mobile.loading("show", {
            text: "Loading",
            textVisible: true
        })
        bluetooth.clearBuffer();
        bluetooth.subscribe(null, "Static");
    });

    $("#dinamicChart").click(function () {
        bluetooth.readUntil();
        chart.dinamicChart(getPoint());
    });
}
