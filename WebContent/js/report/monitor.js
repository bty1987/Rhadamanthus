$(function(){

    var redis = 14;
    com.charts("reportDiv", "sensors",{"api": 'system.flask_monitor.selectReception', "key":"sensors", "name":"TEST-521", "redis":redis},"col-xs-6", {"height": "500px"});
    com.charts("reportDiv", "cpu",{"api": 'system.flask_monitor.selectReception', "key":"cpu", "name":"TEST-521", "redis":redis},"col-xs-6", {"height": "500px"});
    com.charts("reportDiv", "flow",{"api": 'system.flask_monitor.selectReception', "key":"flow", "name":"TEST-521", "redis":redis},"col-xs-6", {"height": "500px"});
    com.charts("reportDiv", "memory",{"api": 'system.flask_monitor.selectReception', "key":"memory", "name":"TEST-521", "redis":redis},"col-xs-6", {"height": "500px"});

});
