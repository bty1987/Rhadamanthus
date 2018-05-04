
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
    }else{
        config.communion = 'http://192.168.5.23/';
        config.server = 'http://192.168.5.21/';
        config.media = 'http://192.168.5.21/Demeter/';
        config.dmedia = 'http://static.dingtalk.com/media/';
    }

});



