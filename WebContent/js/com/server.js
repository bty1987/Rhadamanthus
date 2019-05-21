$(function(){

    console.log("server config");
    
    config.intranet = true;

    config.prefix = ''; // 使用在获取二维码路径
    config.iconImg = './images/icon_fanglin.png';
    config.backgroundImg = './images/bg_fanglin.jpg';
    config.shakingColor = '#197bb5'; // 1918: #892f89 , ehome: #3d677c

    if(!location.hostname.startsWith('192.168')){
        config.communion = 'http://61.161.185.22:30001/';
        config.server = 'http://61.161.185.22:30080/';
        config.media = 'http://61.161.185.22:30080/';
        config.dmedia = 'http://static.dingtalk.com/media/';
        config.store = 'https://www.fanglinserver.com/store/';
    }else{
        config.communion = 'http://192.168.5.23/';
        config.server = 'http://192.168.5.40:8888/';
        config.media = 'http://192.168.5.21/Demeter/';
        config.dmedia = 'http://static.dingtalk.com/media/';
        config.library = 'http://192.168.5.22:5000/';
        config.store = 'http://192.168.5.21/';
		config.flaskServer = 'http://192.168.5.21:5000/';
		config.flaskServer = 'http://192.168.5.22:5200/';
    }

});