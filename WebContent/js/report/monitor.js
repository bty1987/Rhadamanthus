$(function(){

    com.charts("reportDiv", "sensors",{"api": 'system.flask_monitor.getSensors', "mongo":'monitor'},"col-xs-6", {"height": "500px"});

});
