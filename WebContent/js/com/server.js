$(function(){

    window.console && window.console.log && console.log("%cServer Config Ready 服务配置就绪", "color:#0a0; font-size:1em");
    
    config.intranet = true;
    
    config.name = '方林信息平台';
    config.ename = 'Fanglin Information Platform';

    config.prefix = ''; // 使用在获取二维码路径
    config.iconImg = './images/icon_fanglin.png';
    config.backgroundImg = './images/bg_fanglin.jpg';
    
    config.shakingColor = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6); //fanglin: #197bb5, 1918: #892f89 , ehome: #3d677c

    if(!location.hostname.startsWith('192.168')){
        
        config.library = ''
        config.communion = '';
        config.server = '';
        config.media = '';
        config.dmedia = 'http://static.dingtalk.com/media/';
        
    }else{
        
        config.library = 'http://192.168.5.22:5000/';
        config.communion = 'http://192.168.5.21/';
        config.server = 'http://192.168.5.21/';
        config.media = 'http://192.168.5.21/';
        config.dmedia = 'http://static.dingtalk.com/media/';

    }

});