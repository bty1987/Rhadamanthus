
$(function(){
    
    console.log("server config");
    
    config.name = '方林信息平台';
    config.ename = 'Fanglin Information Platform';
    config.company = 2952158214; // 1918: 8541268764 , ehome: 2153458453
    config.companyName = '方林装饰';
    config.companyFullName = '辽宁方林装饰工程有限公司';
    config.companyAddr = '沈阳市铁西区兴华北街30号';

    config.prefix = ''; // 使用在获取二维码路径
    config.iconImg = './images/icon_fanglin.png';
    config.backgroundImg = './images/bg_fanglin.jpg';
    config.shakingColor = '#197bb5'; // 1918: #892f89 , ehome: #3d677c

    if(!location.hostname.startsWith('192.168')){
        config.host = 'http://61.161.185.22/';
        config.server = 'http://61.161.185.22/';
        config.media = 'http://61.161.185.22/';
        config.dmedia = 'http://static.dingtalk.com/media/';
        config.communion = 'http://61.161.185.22:30001/';
    }else{
        config.host = 'http://192.168.5.21/';
        config.server = 'http://192.168.5.21/';
        config.media = 'http://192.168.5.21/Demeter/';
        config.dmedia = 'http://static.dingtalk.com/media/';
        config.communion = 'http://192.168.5.23/';
    }
	
});



